import { Request, Response, NextFunction } from "express";
import { Hotel } from "../models/Hotel";
import { AppError } from "../middleware/errorHandler";

export async function getAllHotels(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = "1", limit = "12" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { active: true };
    const [hotels, total] = await Promise.all([
      Hotel.find(filter).sort({ order: 1 }).skip(skip).limit(limitNum),
      Hotel.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: hotels,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedHotels(_req: Request, res: Response, next: NextFunction) {
  try {
    const hotels = await Hotel.find({ featured: true, active: true }).sort({ order: 1 }).limit(6);
    res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
}

export async function searchHotels(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      q, province, minStars, minPrice, maxPrice, amenities, sort = "order",
      page = "1", limit = "12",
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = { active: true };

    if (q) {
      const regex = { $regex: q, $options: "i" };
      filter.$or = [{ name: regex }, { nameVi: regex }, { description: regex }, { address: regex }];
    }
    if (province) filter.provinceSlug = province;
    if (minStars) filter.stars = { $gte: parseInt(minStars) };
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter.$gte = parseInt(minPrice);
      if (maxPrice) priceFilter.$lte = parseInt(maxPrice);
      filter["priceRange.min"] = priceFilter;
    }
    if (amenities) {
      filter.amenities = { $all: amenities.split(",") };
    }

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      order: { order: 1 },
      price_asc: { "priceRange.min": 1 },
      price_desc: { "priceRange.min": -1 },
      stars: { stars: -1 },
      rating: { averageRating: -1 },
      newest: { createdAt: -1 },
    };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [hotels, total] = await Promise.all([
      Hotel.find(filter).sort(sortOptions[sort] || sortOptions.order).skip(skip).limit(limitNum),
      Hotel.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: hotels,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getHotelsByProvince(req: Request, res: Response, next: NextFunction) {
  try {
    const hotels = await Hotel.find({ provinceSlug: req.params.slug, active: true }).sort({ order: 1 });
    res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
}

export async function getHotelsByDestination(req: Request, res: Response, next: NextFunction) {
  try {
    const hotels = await Hotel.find({ destinationSlug: req.params.slug, active: true }).sort({ order: 1 });
    res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
}

export async function getHotelBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const hotel = await Hotel.findOne({ slug: req.params.slug });
    if (!hotel) throw new AppError("Không tìm thấy khách sạn", 404);
    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
}

export async function createHotel(req: Request, res: Response, next: NextFunction) {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
}

export async function updateHotel(req: Request, res: Response, next: NextFunction) {
  try {
    const hotel = await Hotel.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hotel) throw new AppError("Không tìm thấy khách sạn", 404);
    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
}

export async function deleteHotel(req: Request, res: Response, next: NextFunction) {
  try {
    const hotel = await Hotel.findOneAndDelete({ slug: req.params.slug });
    if (!hotel) throw new AppError("Không tìm thấy khách sạn", 404);
    res.json({ success: true, message: "Đã xoá khách sạn thành công" });
  } catch (err) {
    next(err);
  }
}
