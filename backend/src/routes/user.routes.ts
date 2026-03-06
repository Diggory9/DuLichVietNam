import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getFavorites,
  toggleFavorite,
  syncFavorites,
  getPublicProfile,
  getMyBadges,
} from "../controllers/user.controller";
import { auth } from "../middleware/auth";

const router = Router();

// Public profile (must be before /me/* routes)
router.get("/:username/public", getPublicProfile);

// Authenticated routes
router.get("/me/profile", auth, getProfile);
router.put("/me/profile", auth, updateProfile);
router.get("/me/favorites", auth, getFavorites);
router.get("/me/badges", auth, getMyBadges);
router.post("/me/favorites/sync", auth, syncFavorites);
router.post("/me/favorites/:slug", auth, toggleFavorite);

export default router;
