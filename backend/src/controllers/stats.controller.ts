import { Request, Response, NextFunction } from "express";
import { Province } from "../models/Province";
import { Destination } from "../models/Destination";

export async function getStats(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [provinceCount, destinationCount, categories, regions] =
      await Promise.all([
        Province.countDocuments(),
        Destination.countDocuments(),
        Destination.distinct("category"),
        Province.distinct("region"),
      ]);

    res.json({
      success: true,
      data: {
        provinces: provinceCount,
        destinations: destinationCount,
        categories: categories.length,
        regions: regions.length,
      },
    });
  } catch (err) {
    next(err);
  }
}
