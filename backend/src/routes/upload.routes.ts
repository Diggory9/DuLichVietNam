import { Router } from "express";
import { upload } from "../middleware/upload";
import { uploadSingle, uploadMultiple } from "../controllers/upload.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";
import { uploadLimiter } from "../middleware/rateLimiter";

const router = Router();

// Admin upload
router.post("/single", uploadLimiter, auth, requireAdmin, upload.single("image"), uploadSingle);
router.post("/multiple", uploadLimiter, auth, requireAdmin, upload.array("images", 10), uploadMultiple);

// User upload (auth only, no admin required)
router.post("/user/multiple", uploadLimiter, auth, upload.array("images", 10), uploadMultiple);

export default router;
