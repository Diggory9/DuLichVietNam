import { Request, Response, NextFunction } from "express";
import { Booking } from "../models/Booking";
import { Hotel } from "../models/Hotel";
import { Tour } from "../models/Tour";
import { RoomInventory } from "../models/RoomInventory";
import { AppError } from "../middleware/errorHandler";

function getDateRange(checkIn: string, checkOut: string): Date[] {
  const dates: Date[] = [];
  const current = new Date(checkIn + "T00:00:00.000Z");
  const end = new Date(checkOut + "T00:00:00.000Z");
  while (current < end) {
    dates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

export async function createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, hotelSlug, roomName, tourSlug, checkIn, checkOut, tourDate, guests, contactInfo, notes } = req.body;

    let totalPrice = 0;

    if (type === "hotel") {
      if (!hotelSlug || !roomName || !checkIn || !checkOut) {
        throw new AppError("Thiếu thông tin đặt phòng khách sạn", 400);
      }
      const hotel = await Hotel.findOne({ slug: hotelSlug, active: true });
      if (!hotel) throw new AppError("Không tìm thấy khách sạn", 404);

      const room = hotel.rooms.find((r) => r.name === roomName);
      if (!room) throw new AppError("Không tìm thấy phòng", 404);
      if (!room.available) throw new AppError("Phòng không còn trống", 400);

      const dates = getDateRange(checkIn, checkOut);
      if (dates.length < 1) throw new AppError("Ngày trả phòng phải sau ngày nhận phòng", 400);
      totalPrice = room.price * dates.length;

      // Reserve rooms in inventory for each night
      const defaultTotal = room.totalRooms || 1;
      const reservedDates: Date[] = [];

      try {
        for (const date of dates) {
          // Try to increment bookedRooms where there's still availability
          const updated = await RoomInventory.findOneAndUpdate(
            {
              hotelSlug,
              roomName,
              date,
              $expr: { $lt: ["$bookedRooms", "$totalRooms"] },
            },
            { $inc: { bookedRooms: 1 } },
            { new: true }
          );

          if (!updated) {
            // Check if doc exists but is full
            const existing = await RoomInventory.findOne({ hotelSlug, roomName, date });
            if (existing) {
              // Room is fully booked for this date
              const dateStr = date.toISOString().slice(0, 10);
              throw new AppError(`Phòng đã hết cho ngày ${dateStr}`, 400);
            }
            // No inventory doc exists - create one with default totalRooms
            await RoomInventory.create({
              hotelSlug,
              roomName,
              date,
              totalRooms: defaultTotal,
              bookedRooms: 1,
            });
          }

          reservedDates.push(date);
        }
      } catch (err) {
        // Rollback previously reserved dates
        if (reservedDates.length > 0) {
          await RoomInventory.updateMany(
            { hotelSlug, roomName, date: { $in: reservedDates } },
            { $inc: { bookedRooms: -1 } }
          );
        }
        throw err;
      }
    } else if (type === "tour") {
      if (!tourSlug || !tourDate) {
        throw new AppError("Thiếu thông tin đặt tour", 400);
      }
      const tour = await Tour.findOne({ slug: tourSlug, active: true });
      if (!tour) throw new AppError("Không tìm thấy tour", 404);

      totalPrice = (tour.discountPrice || tour.price) * guests;
    } else {
      throw new AppError("Loại đặt chỗ không hợp lệ", 400);
    }

    const booking = await Booking.create({
      userId: req.user!._id,
      type,
      hotelSlug,
      roomName,
      tourSlug,
      checkIn,
      checkOut,
      tourDate,
      guests,
      contactInfo,
      notes,
      totalPrice,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
}

export async function getMyBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = "1", limit = "10" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { userId: req.user!._id };
    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Booking.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getBookingByCode(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await Booking.findOne({
      bookingCode: req.params.code,
      userId: req.user!._id,
    });
    if (!booking) throw new AppError("Không tìm thấy đặt chỗ", 404);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
}

export async function cancelBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await Booking.findOne({
      bookingCode: req.params.code,
      userId: req.user!._id,
    });
    if (!booking) throw new AppError("Không tìm thấy đặt chỗ", 404);
    if (booking.status === "cancelled") throw new AppError("Đặt chỗ đã bị huỷ", 400);

    booking.status = "cancelled";
    booking.cancellationReason = req.body.reason || "Người dùng tự huỷ";
    await booking.save();

    // Release room inventory if hotel booking
    if (booking.type === "hotel" && booking.checkIn && booking.checkOut) {
      const checkInStr = new Date(booking.checkIn).toISOString().slice(0, 10);
      const checkOutStr = new Date(booking.checkOut).toISOString().slice(0, 10);
      const dates = getDateRange(checkInStr, checkOutStr);

      if (dates.length > 0) {
        await RoomInventory.updateMany(
          {
            hotelSlug: booking.hotelSlug,
            roomName: booking.roomName,
            date: { $in: dates },
            bookedRooms: { $gt: 0 },
          },
          { $inc: { bookedRooms: -1 } }
        );
      }
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
}

export async function getAllBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, type, page = "1", limit = "20" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).populate("userId", "username email"),
      Booking.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateBookingStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      throw new AppError("Trạng thái không hợp lệ", 400);
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === "cancelled" ? { cancellationReason: req.body.reason || "Admin huỷ" } : {}) },
      { new: true }
    );
    if (!booking) throw new AppError("Không tìm thấy đặt chỗ", 404);

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
}

export async function getBookingStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const [total, pending, confirmed, cancelled, revenue] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "cancelled" }),
      Booking.aggregate([
        { $match: { status: { $in: ["pending", "confirmed"] } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        confirmed,
        cancelled,
        revenue: revenue[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
}
