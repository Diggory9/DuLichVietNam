import { Router } from "express";
import {
  login,
  register,
  adminRegister,
  getMe,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback,
} from "../controllers/auth.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/login", authLimiter, login);
router.post("/register", authLimiter, register);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/admin/register", auth, requireAdmin, adminRegister);
router.get("/me", auth, getMe);

// Google OAuth
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

export default router;
