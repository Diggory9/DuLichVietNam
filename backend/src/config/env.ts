import dotenv from "dotenv";
import path from "path";

// Load .env file in development (in production, env vars are set by the platform)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const env = {
  port: parseInt(process.env.PORT || "5000", 10),
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/dulichvietnam",
  jwtSecret: process.env.JWT_SECRET || "fallback-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin:
    process.env.CORS_ORIGIN ||
    "http://localhost:3000,http://localhost:3001",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
  uploadsDir: path.join(process.cwd(), "uploads"),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  contactEmail: process.env.CONTACT_EMAIL || "",
  vnpayTmnCode: process.env.VNPAY_TMN_CODE || "CGXZLS0Z",
  vnpayHashSecret: process.env.VNPAY_HASH_SECRET || "XNBCJFAKAZQSGTARRLGCHVZWCIOIGSHN",
  vnpayUrl: process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnpayReturnUrl:
    process.env.VNPAY_RETURN_URL ||
    `${process.env.FRONTEND_URL || "http://localhost:3000"}/thanh-toan/ket-qua`,
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleCallbackUrl:
    process.env.GOOGLE_CALLBACK_URL ||
    `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/google/callback`,
};
