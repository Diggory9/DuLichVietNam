import { Router } from "express";
import { checkAvailability, setInventory, getInventoryCalendar } from "../controllers/room-inventory.controller";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/check", checkAvailability);
router.put("/set", auth, requireAdmin, setInventory);
router.get("/calendar", auth, requireAdmin, getInventoryCalendar);

export default router;
