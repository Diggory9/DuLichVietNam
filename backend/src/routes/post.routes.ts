import { Router } from "express";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  getAdjacentPosts,
  getLatestPosts,
  adminGetAllPosts,
  createPost,
  updatePost,
  deletePost,
  bulkUpdatePosts,
} from "../controllers/post.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Public
router.get("/", getAllPosts);
router.get("/latest", getLatestPosts);

// Admin (protected) - must be before /:slug
router.get("/admin/all", auth, requireAdmin, adminGetAllPosts);
router.patch("/admin/bulk", auth, requireAdmin, bulkUpdatePosts);

// Public (slug-based)
router.get("/:slug", getPostBySlug);
router.get("/:slug/related", getRelatedPosts);
router.get("/:slug/adjacent", getAdjacentPosts);

// Admin CRUD (protected)
router.post("/", auth, requireAdmin, createPost);
router.put("/:slug", auth, requireAdmin, updatePost);
router.delete("/:slug", auth, requireAdmin, deletePost);

export default router;
