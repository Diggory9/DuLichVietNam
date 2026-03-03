import { Router } from "express";
import { login, register, adminRegister, getMe } from "../controllers/auth.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/admin/register", auth, requireAdmin, adminRegister);
router.get("/me", auth, getMe);

export default router;
