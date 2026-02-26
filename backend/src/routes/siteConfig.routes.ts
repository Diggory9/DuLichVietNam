import { Router } from "express";
import { getSiteConfig, updateSiteConfig } from "../controllers/siteConfig.controller";
import { auth } from "../middleware/auth";

const router = Router();

// Public
router.get("/", getSiteConfig);

// Admin (protected)
router.put("/", auth, updateSiteConfig);

export default router;
