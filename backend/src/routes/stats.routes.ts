import { Router } from "express";
import { getStats, getDetailedStats } from "../controllers/stats.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", getStats);
router.get("/detailed", auth, requireAdmin, getDetailedStats);

export default router;
