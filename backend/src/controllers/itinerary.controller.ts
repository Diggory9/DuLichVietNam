import { Request, Response, NextFunction } from "express";
import { Itinerary } from "../models/Itinerary";
import { AppError } from "../middleware/errorHandler";
import slugify from "../utils/slugify";
import { checkAndAwardBadges } from "../lib/badges";

export async function getMyItineraries(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const itineraries = await Itinerary.find({ userId: req.user!._id })
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: itineraries });
  } catch (err) {
    next(err);
  }
}

export async function getItineraryBySlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const itinerary = await Itinerary.findOne({ slug: req.params.slug });
    if (!itinerary) {
      throw new AppError("Không tìm thấy lộ trình", 404);
    }

    // If not public, only owner can view
    if (!itinerary.isPublic) {
      if (!req.user || itinerary.userId.toString() !== req.user._id.toString()) {
        throw new AppError("Không có quyền xem lộ trình này", 403);
      }
    }

    res.json({ success: true, data: itinerary });
  } catch (err) {
    next(err);
  }
}

export async function createItinerary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, description, days } = req.body;
    if (!title) {
      throw new AppError("Tiêu đề lộ trình là bắt buộc", 400);
    }

    let slug = slugify(title);
    // Ensure unique slug
    const existing = await Itinerary.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const { totalBudget } = req.body;
    const itinerary = await Itinerary.create({
      userId: req.user!._id,
      title,
      slug,
      description,
      days: days || [],
      totalBudget,
    });

    checkAndAwardBadges(req.user!._id.toString()).catch(() => {});
    res.status(201).json({ success: true, data: itinerary });
  } catch (err) {
    next(err);
  }
}

export async function updateItinerary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const itinerary = await Itinerary.findOne({ slug: req.params.slug });
    if (!itinerary) {
      throw new AppError("Không tìm thấy lộ trình", 404);
    }
    if (itinerary.userId.toString() !== req.user!._id.toString()) {
      throw new AppError("Không có quyền sửa lộ trình này", 403);
    }

    const { title, description, days, totalBudget } = req.body;
    if (title) itinerary.title = title;
    if (description !== undefined) itinerary.description = description;
    if (days) itinerary.days = days;
    if (totalBudget !== undefined) itinerary.totalBudget = totalBudget;

    await itinerary.save();
    checkAndAwardBadges(req.user!._id.toString()).catch(() => {});
    res.json({ success: true, data: itinerary });
  } catch (err) {
    next(err);
  }
}

export async function deleteItinerary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const itinerary = await Itinerary.findOne({ slug: req.params.slug });
    if (!itinerary) {
      throw new AppError("Không tìm thấy lộ trình", 404);
    }
    if (itinerary.userId.toString() !== req.user!._id.toString()) {
      throw new AppError("Không có quyền xoá lộ trình này", 403);
    }

    await itinerary.deleteOne();
    res.json({ success: true, message: "Đã xoá lộ trình" });
  } catch (err) {
    next(err);
  }
}

export async function togglePublic(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const itinerary = await Itinerary.findOne({ slug: req.params.slug });
    if (!itinerary) {
      throw new AppError("Không tìm thấy lộ trình", 404);
    }
    if (itinerary.userId.toString() !== req.user!._id.toString()) {
      throw new AppError("Không có quyền thay đổi lộ trình này", 403);
    }

    itinerary.isPublic = !itinerary.isPublic;
    await itinerary.save();
    checkAndAwardBadges(req.user!._id.toString()).catch(() => {});
    res.json({ success: true, data: itinerary });
  } catch (err) {
    next(err);
  }
}
