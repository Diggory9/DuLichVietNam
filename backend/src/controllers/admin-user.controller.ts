import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { AppError } from "../middleware/errorHandler";

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page = "1", limit = "20", role, q } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (q) {
      filter.$or = [
        { username: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { role } = req.body;
    if (!role || !["admin", "user"].includes(role)) {
      throw new AppError("Role không hợp lệ", 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) throw new AppError("Không tìm thấy người dùng", 404);

    // Don't allow changing own role
    if (user._id.toString() === req.user!._id.toString()) {
      throw new AppError("Không thể thay đổi role của chính mình", 400);
    }

    user.role = role;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError("Không tìm thấy người dùng", 404);

    // Don't allow deleting self
    if (user._id.toString() === req.user!._id.toString()) {
      throw new AppError("Không thể xoá chính mình", 400);
    }

    await user.deleteOne();
    res.json({ success: true, message: "Đã xoá người dùng" });
  } catch (err) {
    next(err);
  }
}
