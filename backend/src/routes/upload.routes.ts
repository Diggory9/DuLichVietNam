import { Router } from "express";
import { upload } from "../middleware/upload";
import { uploadSingle, uploadMultiple } from "../controllers/upload.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.post("/single", auth, requireAdmin, upload.single("image"), uploadSingle);
router.post("/multiple", auth, requireAdmin, upload.array("images", 10), uploadMultiple);

export default router;
