import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import { AppError } from "../middleware/errorHandler";

function uploadToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `dulichvietnam/${folder}`,
        resource_type: "image",
        format: "webp",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Upload failed"));
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export async function uploadSingle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      throw new AppError("Vui lòng chọn ảnh để upload", 400);
    }

    const result = await uploadToCloudinary(req.file.buffer, "images");

    res.status(201).json({
      success: true,
      data: {
        url: result.url,
        public_id: result.public_id,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function uploadMultiple(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new AppError("Vui lòng chọn ảnh để upload", 400);
    }

    const results = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer, "images"))
    );

    const data = results.map((result, i) => ({
      url: result.url,
      public_id: result.public_id,
      originalname: files[i].originalname,
      size: files[i].size,
      mimetype: files[i].mimetype,
    }));

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
