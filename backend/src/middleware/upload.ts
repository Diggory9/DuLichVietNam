import multer from "multer";
import path from "path";
import { env } from "../config/env";
import { AppError } from "./errorHandler";

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, env.uploadsDir);
  },
  filename(_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Chỉ cho phép JPEG, PNG, WebP, AVIF", 400));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});
