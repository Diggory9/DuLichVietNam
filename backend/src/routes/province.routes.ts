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

const router = Router();

// Public
router.get("/", getAllProvinces);
router.get("/featured", getFeaturedProvinces);
router.get("/:slug", getProvinceBySlug);

// Admin (protected)
router.post("/", auth, createProvince);
router.put("/:slug", auth, updateProvince);
router.delete("/:slug", auth, deleteProvince);

export default router;
