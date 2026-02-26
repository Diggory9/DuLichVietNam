import { Request, Response, NextFunction } from "express";
import { Destination } from "../models/Destination";
import { AppError } from "../middleware/errorHandler";

export async function getAllDestinations(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destinations = await Destination.find().sort({ order: 1 });
    res.json({ success: true, data: destinations });
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedDestinations(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destinations = await Destination.find({ featured: true }).sort({
      order: 1,
    });
    res.json({ success: true, data: destinations });
  } catch (err) {
    next(err);
  }
}

export async function getDestinationBySlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug });
    if (!destination) {
      throw new AppError("Không tìm thấy địa danh", 404);
    }
    res.json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
}

export async function getRelatedDestinations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const current = await Destination.findOne({ slug: req.params.slug });
    if (!current) {
      throw new AppError("Không tìm thấy địa danh", 404);
    }

    const related = await Destination.find({
      slug: { $ne: current.slug },
      $or: [
        { provinceSlug: current.provinceSlug },
        { category: current.category },
      ],
    })
      .sort({ order: 1 })
      .limit(3);

    res.json({ success: true, data: related });
  } catch (err) {
    next(err);
  }
}

export async function getDestinationsByProvince(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destinations = await Destination.find({
      provinceSlug: req.params.slug,
    }).sort({ order: 1 });
    res.json({ success: true, data: destinations });
  } catch (err) {
    next(err);
  }
}

export async function createDestination(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
}

export async function updateDestination(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destination = await Destination.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!destination) {
      throw new AppError("Không tìm thấy địa danh", 404);
    }
    res.json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
}

export async function deleteDestination(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destination = await Destination.findOneAndDelete({
      slug: req.params.slug,
    });
    if (!destination) {
      throw new AppError("Không tìm thấy địa danh", 404);
    }
    res.json({ success: true, message: "Đã xoá địa danh thành công" });
  } catch (err) {
    next(err);
  }
}
