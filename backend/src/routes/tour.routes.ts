import { Router } from "express";
import {
  getAllTours,
  getFeaturedTours,
  searchTours,
  getToursByProvince,
  getToursByDestination,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
} from "../controllers/tour.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Public
router.get("/", getAllTours);
router.get("/featured", getFeaturedTours);
router.get("/search", searchTours);
router.get("/by-province/:slug", getToursByProvince);
router.get("/by-destination/:slug", getToursByDestination);
router.get("/:slug", getTourBySlug);

// Admin
router.post("/", auth, requireAdmin, createTour);
router.put("/:slug", auth, requireAdmin, updateTour);
router.delete("/:slug", auth, requireAdmin, deleteTour);

export default router;
