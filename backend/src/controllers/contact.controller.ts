import { Request, Response, NextFunction } from "express";
import { Contact } from "../models/Contact";
import { AppError } from "../middleware/errorHandler";
import { sendContactNotification } from "../utils/mailer";

export async function submitContact(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      throw new AppError("Vui lòng điền đầy đủ thông tin", 400);
    }
    const contact = await Contact.create({ name, email, subject, message });

    // Gửi email thông báo (không block response nếu lỗi)
    sendContactNotification({ name, email, subject, message }).catch((err) =>
      console.error("[Mail] Gửi email thất bại:", err.message)
    );

    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
}

export async function adminGetAllContacts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.read === "true") filter.read = true;
    if (req.query.read === "false") filter.read = false;

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    next(err);
  }
}

export async function markContactRead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!contact) throw new AppError("Không tìm thấy liên hệ", 404);
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
}

export async function markContactUnread(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: false },
      { new: true }
    );
    if (!contact) throw new AppError("Không tìm thấy liên hệ", 404);
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
}

export async function deleteContact(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) throw new AppError("Không tìm thấy liên hệ", 404);
    res.json({ success: true, message: "Đã xoá liên hệ" });
  } catch (err) {
    next(err);
  }
}
