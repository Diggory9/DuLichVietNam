import { Router } from "express";
import {
  subscribe,
  unsubscribe,
  adminGetSubscribers,
  adminSendNewsletter,
} from "../controllers/subscriber.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Public
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

// Admin
router.get("/admin/all", auth, requireAdmin, adminGetSubscribers);
router.post("/admin/send", auth, requireAdmin, adminSendNewsletter);

export default router;
