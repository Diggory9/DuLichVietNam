import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import { Subscriber } from "../models/Subscriber";
import { AppError } from "../middleware/errorHandler";
import { env } from "../config/env";

export async function subscribe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError("Email không hợp lệ", 400);
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.isActive) {
        return res.json({ success: true, message: "Email đã được đăng ký" });
      }
      // Re-activate
      existing.isActive = true;
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = undefined;
      await existing.save();
      return res.json({ success: true, message: "Đã đăng ký lại thành công" });
    }

    await Subscriber.create({ email: email.toLowerCase() });
    res.status(201).json({ success: true, message: "Đăng ký thành công" });
  } catch (err) {
    next(err);
  }
}

export async function unsubscribe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;
    if (!email) throw new AppError("Email là bắt buộc", 400);

    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    if (!subscriber || !subscriber.isActive) {
      return res.json({ success: true, message: "Email không có trong danh sách" });
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();
    res.json({ success: true, message: "Đã huỷ đăng ký thành công" });
  } catch (err) {
    next(err);
  }
}

export async function adminGetSubscribers(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    const activeCount = await Subscriber.countDocuments({ isActive: true });
    res.json({ success: true, data: subscribers, activeCount });
  } catch (err) {
    next(err);
  }
}

export async function adminSendNewsletter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { subject, content } = req.body;
    if (!subject || !content) {
      throw new AppError("Tiêu đề và nội dung là bắt buộc", 400);
    }

    if (!env.smtpUser || !env.smtpPass) {
      throw new AppError("SMTP chưa được cấu hình", 500);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: env.smtpUser, pass: env.smtpPass },
    });

    const subscribers = await Subscriber.find({ isActive: true });
    if (subscribers.length === 0) {
      throw new AppError("Không có subscriber nào", 400);
    }

    const emails = subscribers.map((s) => s.email);

    await transporter.sendMail({
      from: `"Du Lịch Việt Nam" <${env.smtpUser}>`,
      bcc: emails,
      subject,
      html: content,
    });

    res.json({
      success: true,
      message: `Đã gửi newsletter cho ${emails.length} subscribers`,
    });
  } catch (err) {
    next(err);
  }
}
