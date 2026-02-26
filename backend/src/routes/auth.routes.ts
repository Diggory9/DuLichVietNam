import { Router } from "express";
import { login, register, getMe } from "../controllers/auth.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.post("/register", auth, register);
router.get("/me", auth, getMe);

export default router;
