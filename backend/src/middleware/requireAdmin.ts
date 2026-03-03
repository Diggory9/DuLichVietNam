import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Không có quyền truy cập", 403));
  }
  next();
}
