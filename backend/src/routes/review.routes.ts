import { Router } from "express";
import {
  getReviewsByDestination,
  createReview,
  adminGetAllReviews,
  deleteReview,
} from "../controllers/review.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Public
router.get("/destination/:destinationSlug", getReviewsByDestination);
router.post("/", createReview);

// Admin (protected)
router.get("/admin/all", auth, requireAdmin, adminGetAllReviews);
router.delete("/:id", auth, requireAdmin, deleteReview);

export default router;
