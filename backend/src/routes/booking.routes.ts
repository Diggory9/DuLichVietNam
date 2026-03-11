import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getBookingByCode,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
} from "../controllers/booking.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// User
router.post("/", auth, createBooking);
router.get("/my", auth, getMyBookings);
router.get("/my/:code", auth, getBookingByCode);
router.patch("/my/:code/cancel", auth, cancelBooking);

// Admin
router.get("/admin/all", auth, requireAdmin, getAllBookings);
router.patch("/admin/:id/status", auth, requireAdmin, updateBookingStatus);
router.get("/admin/stats", auth, requireAdmin, getBookingStats);

export default router;
