import { Router } from "express";
import {
  getMyItineraries,
  getItineraryBySlug,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  togglePublic,
} from "../controllers/itinerary.controller";
import { auth, optionalAuth } from "../middleware/auth";

const router = Router();

// Auth required
router.get("/", auth, getMyItineraries);
router.post("/", auth, createItinerary);

// Public or auth (controller checks access)
router.get("/:slug", optionalAuth, getItineraryBySlug);

// Auth + owner
router.put("/:slug", auth, updateItinerary);
router.delete("/:slug", auth, deleteItinerary);
router.patch("/:slug/toggle-public", auth, togglePublic);

export default router;
