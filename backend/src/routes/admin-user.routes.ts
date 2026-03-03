import { Router } from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/admin-user.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/", auth, requireAdmin, getAllUsers);
router.patch("/:id/role", auth, requireAdmin, updateUserRole);
router.delete("/:id", auth, requireAdmin, deleteUser);

export default router;
