import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler";

export function uploadSingle(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new AppError("Vui lòng chọn ảnh để upload", 400);
    }

    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({
      success: true,
      data: {
        url,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (err) {
    next(err);
  }
}

export function uploadMultiple(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new AppError("Vui lòng chọn ảnh để upload", 400);
    }

    const data = files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
