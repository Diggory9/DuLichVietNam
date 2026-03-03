import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getFavorites,
  toggleFavorite,
  syncFavorites,
} from "../controllers/user.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/me/profile", auth, getProfile);
router.put("/me/profile", auth, updateProfile);
router.get("/me/favorites", auth, getFavorites);
router.post("/me/favorites/sync", auth, syncFavorites);
router.post("/me/favorites/:slug", auth, toggleFavorite);

export default router;
