import { Request, Response, NextFunction } from "express";
import { Notification } from "../models/Notification";
import { AppError } from "../middleware/errorHandler";

export async function getMyNotifications(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const notifications = await Notification.find({ userId: req.user!._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
}

export async function getUnreadCount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const count = await Notification.countDocuments({
      userId: req.user!._id,
      read: false,
    });
    res.json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      throw new AppError("Không tìm thấy thông báo", 404);
    }
    if (notification.userId.toString() !== req.user!._id.toString()) {
      throw new AppError("Không có quyền", 403);
    }

    notification.read = true;
    await notification.save();
    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await Notification.updateMany(
      { userId: req.user!._id, read: false },
      { read: true }
    );
    res.json({ success: true, message: "Đã đánh dấu tất cả đã đọc" });
  } catch (err) {
    next(err);
  }
}
