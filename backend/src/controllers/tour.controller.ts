import { Request, Response, NextFunction } from "express";
import { Tour } from "../models/Tour";
import { AppError } from "../middleware/errorHandler";

export async function getAllTours(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = "1", limit = "12" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { active: true };
    const [tours, total] = await Promise.all([
      Tour.find(filter).sort({ order: 1 }).skip(skip).limit(limitNum),
      Tour.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: tours,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedTours(_req: Request, res: Response, next: NextFunction) {
  try {
    const tours = await Tour.find({ featured: true, active: true }).sort({ order: 1 }).limit(6);
    res.json({ success: true, data: tours });
  } catch (err) {
    next(err);
  }
}

export async function searchTours(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      q, province, category, minPrice, maxPrice, minDays, maxDays, difficulty,
      sort = "order", page = "1", limit = "12",
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = { active: true };

    if (q) {
      const regex = { $regex: q, $options: "i" };
      filter.$or = [{ name: regex }, { nameVi: regex }, { description: regex }, { highlights: regex }];
    }
    if (province) filter.provinceSlug = province;
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter.$gte = parseInt(minPrice);
      if (maxPrice) priceFilter.$lte = parseInt(maxPrice);
      filter.price = priceFilter;
    }
    if (minDays || maxDays) {
      const dayFilter: Record<string, number> = {};
      if (minDays) dayFilter.$gte = parseInt(minDays);
      if (maxDays) dayFilter.$lte = parseInt(maxDays);
      filter["duration.days"] = dayFilter;
    }

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      order: { order: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      duration: { "duration.days": 1 },
      rating: { averageRating: -1 },
      newest: { createdAt: -1 },
    };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [tours, total] = await Promise.all([
      Tour.find(filter).sort(sortOptions[sort] || sortOptions.order).skip(skip).limit(limitNum),
      Tour.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: tours,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getToursByProvince(req: Request, res: Response, next: NextFunction) {
  try {
    const tours = await Tour.find({ provinceSlug: req.params.slug, active: true }).sort({ order: 1 });
    res.json({ success: true, data: tours });
  } catch (err) {
    next(err);
  }
}

export async function getToursByDestination(req: Request, res: Response, next: NextFunction) {
  try {
    const tours = await Tour.find({ destinationSlugs: req.params.slug, active: true }).sort({ order: 1 });
    res.json({ success: true, data: tours });
  } catch (err) {
    next(err);
  }
}

export async function getTourBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug });
    if (!tour) throw new AppError("Không tìm thấy tour", 404);
    res.json({ success: true, data: tour });
  } catch (err) {
    next(err);
  }
}

export async function createTour(req: Request, res: Response, next: NextFunction) {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({ success: true, data: tour });
  } catch (err) {
    next(err);
  }
}

export async function updateTour(req: Request, res: Response, next: NextFunction) {
  try {
    const tour = await Tour.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) throw new AppError("Không tìm thấy tour", 404);
    res.json({ success: true, data: tour });
  } catch (err) {
    next(err);
  }
}

export async function deleteTour(req: Request, res: Response, next: NextFunction) {
  try {
    const tour = await Tour.findOneAndDelete({ slug: req.params.slug });
    if (!tour) throw new AppError("Không tìm thấy tour", 404);
    res.json({ success: true, message: "Đã xoá tour thành công" });
  } catch (err) {
    next(err);
  }
}
