import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User, IUser } from "../models/User";
import { AppError } from "./errorHandler";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends IUser {}
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret) as { id: string };
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
  } catch {
    // Ignore token errors, just proceed without user
  }
  next();
}

export async function auth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Chưa đăng nhập", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError("Người dùng không tồn tại", 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }
    next(new AppError("Token không hợp lệ", 401));
  }
}
