import rateLimit from "express-rate-limit";

const isTest = process.env.NODE_ENV === "test";

// Global rate limiter: 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  skip: () => isTest,
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter: 10 requests per 15 minutes per IP
export const authLimiter = rateLimit({
  skip: () => isTest,
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload rate limiter: 20 requests per 15 minutes per IP
export const uploadLimiter = rateLimit({
  skip: () => isTest,
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Quá nhiều lần tải ảnh, vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
