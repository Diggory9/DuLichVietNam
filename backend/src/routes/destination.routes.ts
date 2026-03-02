import { Router } from "express";
import {
  getAllDestinations,
  getFeaturedDestinations,
  getDestinationBySlug,
  getRelatedDestinations,
  getDestinationsByProvince,
  createDestination,
  updateDestination,
  deleteDestination,
  searchDestinations,
  quickSearch,
} from "../controllers/destination.controller";
import { auth } from "../middleware/auth";

const router = Router();

// Public
router.get("/", getAllDestinations);
router.get("/featured", getFeaturedDestinations);
router.get("/search", searchDestinations);
router.get("/quick-search", quickSearch);
router.get("/by-province/:slug", getDestinationsByProvince);
router.get("/:slug", getDestinationBySlug);
router.get("/:slug/related", getRelatedDestinations);

// Admin (protected)
router.post("/", auth, createDestination);
router.put("/:slug", auth, updateDestination);
router.delete("/:slug", auth, deleteDestination);

export default router;
