import { Router } from "express";
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", auth, getMyNotifications);
router.get("/unread-count", auth, getUnreadCount);
router.patch("/read-all", auth, markAllAsRead);
router.patch("/:id/read", auth, markAsRead);

export default router;
