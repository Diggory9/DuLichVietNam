import { Request, Response, NextFunction } from "express";
import { Province } from "../models/Province";
import { AppError } from "../middleware/errorHandler";

export async function getAllProvinces(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const provinces = await Province.find().sort({ order: 1 });
    res.json({ success: true, data: provinces });
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedProvinces(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const provinces = await Province.find({ featured: true }).sort({ order: 1 });
    res.json({ success: true, data: provinces });
  } catch (err) {
    next(err);
  }
}

export async function getProvinceBySlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const province = await Province.findOne({ slug: req.params.slug });
    if (!province) {
      throw new AppError("Không tìm thấy tỉnh", 404);
    }
    res.json({ success: true, data: province });
  } catch (err) {
    next(err);
  }
}

export async function createProvince(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const province = await Province.create(req.body);
    res.status(201).json({ success: true, data: province });
  } catch (err) {
    next(err);
  }
}

export async function updateProvince(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const province = await Province.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!province) {
      throw new AppError("Không tìm thấy tỉnh", 404);
    }
    res.json({ success: true, data: province });
  } catch (err) {
    next(err);
  }
}

export async function deleteProvince(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const province = await Province.findOneAndDelete({ slug: req.params.slug });
    if (!province) {
      throw new AppError("Không tìm thấy tỉnh", 404);
    }
    res.json({ success: true, message: "Đã xoá tỉnh thành công" });
  } catch (err) {
    next(err);
  }
}
