import { Router } from "express";
import {
  getAllHotels,
  getFeaturedHotels,
  searchHotels,
  getHotelsByProvince,
  getHotelsByDestination,
  getHotelBySlug,
  createHotel,
  updateHotel,
  deleteHotel,
} from "../controllers/hotel.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Public
router.get("/", getAllHotels);
router.get("/featured", getFeaturedHotels);
router.get("/search", searchHotels);
router.get("/by-province/:slug", getHotelsByProvince);
router.get("/by-destination/:slug", getHotelsByDestination);
router.get("/:slug", getHotelBySlug);

// Admin
router.post("/", auth, requireAdmin, createHotel);
router.put("/:slug", auth, requireAdmin, updateHotel);
router.delete("/:slug", auth, requireAdmin, deleteHotel);

export default router;
