import { Router } from "express";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  getLatestPosts,
  adminGetAllPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller";
import { auth } from "../middleware/auth";

const router = Router();

// Public
router.get("/", getAllPosts);
router.get("/latest", getLatestPosts);

// Admin (protected) - must be before /:slug
router.get("/admin/all", auth, adminGetAllPosts);

// Public (slug-based)
router.get("/:slug", getPostBySlug);
router.get("/:slug/related", getRelatedPosts);

// Admin CRUD (protected)
router.post("/", auth, createPost);
router.put("/:slug", auth, updatePost);
router.delete("/:slug", auth, deletePost);

export default router;
