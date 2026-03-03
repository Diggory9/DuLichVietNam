import { Router } from "express";
import {
  getAllProvinces,
  getFeaturedProvinces,
  getProvinceBySlug,
  createProvince,
  updateProvince,
  deleteProvince,
} from "../controllers/province.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Public
router.get("/", getAllProvinces);
router.get("/featured", getFeaturedProvinces);
router.get("/:slug", getProvinceBySlug);

// Admin (protected)
router.post("/", auth, requireAdmin, createProvince);
router.put("/:slug", auth, requireAdmin, updateProvince);
router.delete("/:slug", auth, requireAdmin, deleteProvince);

export default router;
