import { Request, Response, NextFunction } from "express";
import { RoomInventory } from "../models/RoomInventory";
import { Hotel } from "../models/Hotel";
import { AppError } from "../middleware/errorHandler";

function getDatesInRange(startDate: string, endDate: string): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate + "T00:00:00.000Z");
  const end = new Date(endDate + "T00:00:00.000Z");

  while (current < end) {
    dates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

export async function checkAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const { hotelSlug, roomName, checkIn, checkOut } = req.query as Record<string, string>;

    if (!hotelSlug || !roomName || !checkIn || !checkOut) {
      throw new AppError("Thiếu thông tin kiểm tra phòng trống", 400);
    }

    const hotel = await Hotel.findOne({ slug: hotelSlug, active: true });
    if (!hotel) throw new AppError("Không tìm thấy khách sạn", 404);

    const room = hotel.rooms.find((r) => r.name === roomName);
    if (!room) throw new AppError("Không tìm thấy phòng", 404);

    const defaultTotal = room.totalRooms || 1;
    const dates = getDatesInRange(checkIn, checkOut);

    if (dates.length === 0) {
      throw new AppError("Khoảng ngày không hợp lệ", 400);
    }

    const inventoryDocs = await RoomInventory.find({
      hotelSlug,
      roomName,
      date: { $gte: dates[0], $lte: dates[dates.length - 1] },
    });

    const inventoryMap = new Map<string, typeof inventoryDocs[0]>();
    for (const doc of inventoryDocs) {
      inventoryMap.set(doc.date.toISOString().slice(0, 10), doc);
    }

    let minAvailable = Infinity;
    const details: { date: string; available: number; total: number }[] = [];

    for (const date of dates) {
      const dateKey = date.toISOString().slice(0, 10);
      const inv = inventoryMap.get(dateKey);
      const total = inv ? inv.totalRooms : defaultTotal;
      const booked = inv ? inv.bookedRooms : 0;
      const available = total - booked;

      if (available < minAvailable) minAvailable = available;
      details.push({ date: dateKey, available, total });
    }

    res.json({
      success: true,
      data: {
        available: minAvailable > 0,
        minAvailable: Math.max(0, minAvailable),
        details,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function setInventory(req: Request, res: Response, next: NextFunction) {
  try {
    const { hotelSlug, roomName, totalRooms, startDate, endDate } = req.body;

    if (!hotelSlug || !roomName || totalRooms == null || !startDate || !endDate) {
      throw new AppError("Thiếu thông tin cập nhật tồn kho phòng", 400);
    }

    const hotel = await Hotel.findOne({ slug: hotelSlug });
    if (!hotel) throw new AppError("Không tìm thấy khách sạn", 404);

    const room = hotel.rooms.find((r) => r.name === roomName);
    if (!room) throw new AppError("Không tìm thấy phòng", 404);

    const dates = getDatesInRange(startDate, endDate);
    if (dates.length === 0) {
      throw new AppError("Khoảng ngày không hợp lệ", 400);
    }

    const bulkOps = dates.map((date) => ({
      updateOne: {
        filter: { hotelSlug, roomName, date },
        update: { $set: { totalRooms } },
        upsert: true,
      },
    }));

    await RoomInventory.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: `Đã cập nhật ${dates.length} ngày cho phòng ${roomName}`,
    });
  } catch (err) {
    next(err);
  }
}

export async function getInventoryCalendar(req: Request, res: Response, next: NextFunction) {
  try {
    const { hotelSlug, month } = req.query as Record<string, string>;

    if (!hotelSlug || !month) {
      throw new AppError("Thiếu thông tin lịch tồn kho", 400);
    }

    const startDate = new Date(month + "-01T00:00:00.000Z");
    const endDate = new Date(startDate);
    endDate.setUTCMonth(endDate.getUTCMonth() + 1);

    const docs = await RoomInventory.find({
      hotelSlug,
      date: { $gte: startDate, $lt: endDate },
    }).sort({ roomName: 1, date: 1 });

    const grouped: Record<string, { date: string; totalRooms: number; bookedRooms: number }[]> = {};
    for (const doc of docs) {
      if (!grouped[doc.roomName]) grouped[doc.roomName] = [];
      grouped[doc.roomName].push({
        date: doc.date.toISOString().slice(0, 10),
        totalRooms: doc.totalRooms,
        bookedRooms: doc.bookedRooms,
      });
    }

    res.json({ success: true, data: grouped });
  } catch (err) {
    next(err);
  }
}
