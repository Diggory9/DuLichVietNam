import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { env } from "../config/env";
import { AppError } from "../middleware/errorHandler";

function signToken(id: string): string {
  return jwt.sign({ id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new AppError("Vui lòng nhập tên đăng nhập và mật khẩu", 400);
    }

    const user = await User.findOne({ username }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Tên đăng nhập hoặc mật khẩu không đúng", 401);
    }

    const token = signToken(user._id.toString());

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new AppError("Vui lòng nhập đầy đủ thông tin", 400);
    }

    if (password.length < 6) {
      throw new AppError("Mật khẩu phải có ít nhất 6 ký tự", 400);
    }

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      throw new AppError("Tên đăng nhập hoặc email đã tồn tại", 400);
    }

    const user = await User.create({ username, email, password, role: "admin" });
    const token = signToken(user._id.toString());

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    next(err);
  }
}
