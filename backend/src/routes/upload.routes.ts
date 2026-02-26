import { Router } from "express";
import { upload } from "../middleware/upload";
import { uploadSingle, uploadMultiple } from "../controllers/upload.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/single", auth, upload.single("image"), uploadSingle);
router.post("/multiple", auth, upload.array("images", 10), uploadMultiple);

export default router;
