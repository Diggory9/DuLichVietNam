import { Router } from "express";
import {
  submitContact,
  adminGetAllContacts,
  markContactRead,
  markContactUnread,
  deleteContact,
} from "../controllers/contact.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Public
router.post("/", submitContact);

// Admin (protected)
router.get("/admin/all", auth, requireAdmin, adminGetAllContacts);
router.patch("/:id/read", auth, requireAdmin, markContactRead);
router.patch("/:id/unread", auth, requireAdmin, markContactUnread);
router.delete("/:id", auth, requireAdmin, deleteContact);

export default router;
