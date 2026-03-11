import { Router } from "express";
import {
  getReviewsByDestination,
  getReviewsByTarget,
  createReview,
  createAuthenticatedReview,
  adminGetAllReviews,
  deleteReview,
} from "../controllers/review.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Public
router.get("/destination/:destinationSlug", getReviewsByDestination);
router.get("/:targetType/:targetSlug", getReviewsByTarget);
router.post("/", createReview);

// Authenticated user review
router.post("/authenticated", auth, createAuthenticatedReview);

// Admin (protected)
router.get("/admin/all", auth, requireAdmin, adminGetAllReviews);
router.delete("/:id", auth, requireAdmin, deleteReview);

export default router;
