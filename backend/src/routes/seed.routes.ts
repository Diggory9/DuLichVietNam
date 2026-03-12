import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Province } from "../models/Province";
import { Destination } from "../models/Destination";
import { SiteConfig } from "../models/SiteConfig";
import { auth } from "../middleware/auth";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// POST /api/admin/seed - Re-seed provinces, destinations, and site config
// Requires admin authentication
router.post("/", auth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const dataDir = path.join(__dirname, "../../../src/data");

    const provinces = JSON.parse(
      fs.readFileSync(path.join(dataDir, "provinces.json"), "utf-8")
    );
    const destinations = JSON.parse(
      fs.readFileSync(path.join(dataDir, "destinations.json"), "utf-8")
    );
    const siteConfig = JSON.parse(
      fs.readFileSync(path.join(dataDir, "site.json"), "utf-8")
    );

    // Clear and re-insert
    await Province.deleteMany({});
    await Destination.deleteMany({});
    await SiteConfig.deleteMany({});

    const insertedProvinces = await Province.insertMany(provinces);
    const insertedDestinations = await Destination.insertMany(destinations);
    await SiteConfig.create(siteConfig);

    res.json({
      success: true,
      message: "Seed completed successfully",
      data: {
        provinces: insertedProvinces.length,
        destinations: insertedDestinations.length,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Seed failed";
    res.status(500).json({ success: false, message });
  }
});

export default router;
