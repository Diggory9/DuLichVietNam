import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { connectDB } from "../config/db";
import { Province } from "../models/Province";
import { Destination } from "../models/Destination";
import { SiteConfig } from "../models/SiteConfig";

async function seed() {
  await connectDB();

  const dataDir = path.join(__dirname, "../../../src/data");

  // Read JSON files
  const provinces = JSON.parse(
    fs.readFileSync(path.join(dataDir, "provinces.json"), "utf-8")
  );
  const destinations = JSON.parse(
    fs.readFileSync(path.join(dataDir, "destinations.json"), "utf-8")
  );
  const siteConfig = JSON.parse(
    fs.readFileSync(path.join(dataDir, "site.json"), "utf-8")
  );

  // Clear existing data
  await Province.deleteMany({});
  await Destination.deleteMany({});
  await SiteConfig.deleteMany({});

  // Insert provinces
  const insertedProvinces = await Province.insertMany(provinces);
  console.log(`Inserted ${insertedProvinces.length} provinces`);

  // Insert destinations
  const insertedDestinations = await Destination.insertMany(destinations);
  console.log(`Inserted ${insertedDestinations.length} destinations`);

  // Insert site config
  await SiteConfig.create(siteConfig);
  console.log("Inserted site config");

  console.log("Seed completed successfully!");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
