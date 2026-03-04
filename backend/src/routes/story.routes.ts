import { Router } from "express";
import {
  getApprovedStories,
  getStoryBySlug,
  getCommunityGallery,
  createStory,
  getUserStories,
  updateStory,
  deleteStory,
  likeStory,
  adminGetStories,
  adminUpdateStatus,
} from "../controllers/story.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Public
router.get("/", getApprovedStories);
router.get("/gallery", getCommunityGallery);

// Auth - specific paths before :slug
router.post("/", auth, createStory);
router.get("/my", auth, getUserStories);

// Public (slug routes after specific ones)
router.get("/:slug", getStoryBySlug);

// Auth
router.put("/:slug", auth, updateStory);
router.delete("/:slug", auth, deleteStory);
router.post("/:slug/like", auth, likeStory);

export default router;

// Admin routes (separate, mounted at /api/admin/stories)
export const adminStoryRouter = Router();
adminStoryRouter.get("/", auth, requireAdmin, adminGetStories);
adminStoryRouter.patch("/:id/status", auth, requireAdmin, adminUpdateStatus);
