import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { Booking } from "../models/Booking";
import { AppError } from "../middleware/errorHandler";
import { env } from "../config/env";

function sortObject(obj: Record<string, string>): Record<string, string> {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

export async function createPaymentUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { bookingCode } = req.body;
    if (!bookingCode) throw new AppError("Thiếu mã đặt chỗ", 400);

    const booking = await Booking.findOne({ bookingCode, userId: req.user!._id });
    if (!booking) throw new AppError("Không tìm thấy đặt chỗ", 404);
    if (booking.paymentStatus === "paid") throw new AppError("Đặt chỗ đã được thanh toán", 400);

    const date = new Date();
    const createDate = date.toISOString().replace(/[-:T]/g, "").slice(0, 14); // YYYYMMDDHHmmss
    const orderId = createDate + booking.bookingCode.replace(/[^A-Z0-9]/gi, "").slice(-6);

    const ipAddr = req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "127.0.0.1";

    let vnpParams: Record<string, string> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: env.vnpayTmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan dat cho ${booking.bookingCode}`,
      vnp_OrderType: "other",
      vnp_Amount: String(booking.totalPrice * 100),
      vnp_ReturnUrl: env.vnpayReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    vnpParams = sortObject(vnpParams);

    const signData = new URLSearchParams(vnpParams).toString();
    const hmac = crypto.createHmac("sha512", env.vnpayHashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnpParams.vnp_SecureHash = signed;

    const paymentUrl = `${env.vnpayUrl}?${new URLSearchParams(vnpParams).toString()}`;

    // Update booking
    booking.paymentStatus = "pending";
    booking.paymentMethod = "vnpay";
    await booking.save();

    res.json({ success: true, data: { paymentUrl } });
  } catch (err) {
    next(err);
  }
}

export async function vnpayReturn(req: Request, res: Response, next: NextFunction) {
  try {
    const vnpParams = { ...req.query } as Record<string, string>;
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const sorted = sortObject(vnpParams);
    const signData = new URLSearchParams(sorted).toString();
    const hmac = crypto.createHmac("sha512", env.vnpayHashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const isValid = secureHash === signed;
    const responseCode = vnpParams.vnp_ResponseCode;

    res.json({
      success: true,
      data: {
        isValid,
        responseCode,
        message: responseCode === "00" ? "Thanh toán thành công" : "Thanh toán thất bại",
        transactionId: vnpParams.vnp_TransactionNo,
        orderInfo: vnpParams.vnp_OrderInfo,
        amount: parseInt(vnpParams.vnp_Amount) / 100,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function vnpayIPN(req: Request, res: Response) {
  try {
    const vnpParams = { ...req.query } as Record<string, string>;
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const sorted = sortObject(vnpParams);
    const signData = new URLSearchParams(sorted).toString();
    const hmac = crypto.createHmac("sha512", env.vnpayHashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      return res.status(200).json({ RspCode: "97", Message: "Invalid Checksum" });
    }

    const orderInfo = vnpParams.vnp_OrderInfo || "";
    // Extract booking code from orderInfo: "Thanh toan dat cho BK-XXXXXXXX-XXXX"
    const bookingCodeMatch = orderInfo.match(/BK-[A-Z0-9-]+/);
    if (!bookingCodeMatch) {
      return res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }

    const booking = await Booking.findOne({ bookingCode: bookingCodeMatch[0] });
    if (!booking) {
      return res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(200).json({ RspCode: "02", Message: "Already confirmed" });
    }

    const responseCode = vnpParams.vnp_ResponseCode;
    if (responseCode === "00") {
      booking.paymentStatus = "paid";
      booking.paymentTransactionId = vnpParams.vnp_TransactionNo;
      booking.paymentDate = new Date();
      booking.status = "confirmed";
      await booking.save();
      return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
    } else {
      booking.paymentStatus = "unpaid";
      await booking.save();
      return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
    }
  } catch {
    return res.status(200).json({ RspCode: "99", Message: "Unknown error" });
  }
}
