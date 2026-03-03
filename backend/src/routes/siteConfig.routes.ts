import { Router } from "express";
import { getSiteConfig, updateSiteConfig } from "../controllers/siteConfig.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Public
router.get("/", getSiteConfig);

// Admin (protected)
router.put("/", auth, requireAdmin, updateSiteConfig);

export default router;
