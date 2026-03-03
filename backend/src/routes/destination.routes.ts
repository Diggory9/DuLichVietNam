import { Router } from "express";
import {
  getAllDestinations,
  getFeaturedDestinations,
  getDestinationBySlug,
  getRelatedDestinations,
  getDestinationsByProvince,
  getDestinationsForMap,
  createDestination,
  updateDestination,
  deleteDestination,
  searchDestinations,
  quickSearch,
} from "../controllers/destination.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Public
router.get("/", getAllDestinations);
router.get("/featured", getFeaturedDestinations);
router.get("/search", searchDestinations);
router.get("/quick-search", quickSearch);
router.get("/map", getDestinationsForMap);
router.get("/by-province/:slug", getDestinationsByProvince);
router.get("/:slug", getDestinationBySlug);
router.get("/:slug/related", getRelatedDestinations);

// Admin (protected)
router.post("/", auth, requireAdmin, createDestination);
router.put("/:slug", auth, requireAdmin, updateDestination);
router.delete("/:slug", auth, requireAdmin, deleteDestination);

export default router;
