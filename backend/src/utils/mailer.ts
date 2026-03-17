import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter =
  env.smtpUser && env.smtpPass
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: env.smtpUser,
          pass: env.smtpPass,
        },
      })
    : null;

interface ContactMailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(data: ContactMailData) {
  if (!transporter || !env.contactEmail) {
    console.log("[Mail] SMTP chưa cấu hình, bỏ qua gửi email.");
    return;
  }

  await transporter.sendMail({
    from: `"Du Lịch Việt Nam" <${env.smtpUser}>`,
    to: env.contactEmail,
    subject: `[Liên hệ mới] ${data.subject}`,
    html: `
      <h2>Bạn có một liên hệ mới từ website</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px">
        <tr><td style="padding:8px;font-weight:bold">Họ tên:</td><td style="padding:8px">${data.name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Email:</td><td style="padding:8px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding:8px;font-weight:bold">Chủ đề:</td><td style="padding:8px">${data.subject}</td></tr>
      </table>
      <h3 style="margin-top:16px">Nội dung:</h3>
      <p style="white-space:pre-line;background:#f5f5f5;padding:12px;border-radius:8px">${data.message}</p>
    `,
  });

  console.log("[Mail] Đã gửi thông báo liên hệ tới", env.contactEmail);
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
) {
  if (!transporter) {
    console.log("[Mail] SMTP chưa cấu hình, bỏ qua gửi email reset.");
    return;
  }

  await transporter.sendMail({
    from: `"Du Lịch Việt Nam" <${env.smtpUser}>`,
    to: email,
    subject: "Đặt lại mật khẩu - Du Lịch Việt Nam",
    html: `
      <div style="max-width:500px;margin:0 auto;font-family:Arial,sans-serif">
        <h2 style="color:#2563eb">Đặt lại mật khẩu</h2>
        <p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
        <p>Nhấn vào nút bên dưới để đặt mật khẩu mới. Link có hiệu lực trong <strong>1 giờ</strong>.</p>
        <div style="text-align:center;margin:24px 0">
          <a href="${resetUrl}" style="display:inline-block;padding:12px 32px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">
            Đặt lại mật khẩu
          </a>
        </div>
        <p style="color:#6b7280;font-size:14px">Nếu bạn không yêu cầu, hãy bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="color:#9ca3af;font-size:12px">Du Lịch Việt Nam — Khám phá vẻ đẹp Việt Nam</p>
      </div>
    `,
  });

  console.log("[Mail] Đã gửi email reset mật khẩu tới", email);
}
