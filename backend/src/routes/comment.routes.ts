import { Router } from "express";
import {
  getCommentsByPost,
  createComment,
  adminGetAllComments,
  deleteComment,
  bulkDeleteComments,
} from "../controllers/comment.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Public
router.get("/post/:postSlug", getCommentsByPost);
router.post("/", createComment);

// Admin (protected)
router.get("/admin/all", auth, requireAdmin, adminGetAllComments);
router.delete("/admin/bulk", auth, requireAdmin, bulkDeleteComments);
router.delete("/:id", auth, requireAdmin, deleteComment);

export default router;
