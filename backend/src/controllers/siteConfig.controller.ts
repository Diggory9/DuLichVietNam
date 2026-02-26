import { Request, Response, NextFunction } from "express";
import { SiteConfig } from "../models/SiteConfig";
import { AppError } from "../middleware/errorHandler";

export async function getSiteConfig(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const config = await SiteConfig.findOne();
    if (!config) {
      throw new AppError("Không tìm thấy cấu hình site", 404);
    }
    res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
}

export async function updateSiteConfig(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const config = await SiteConfig.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });
    res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
}
