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
