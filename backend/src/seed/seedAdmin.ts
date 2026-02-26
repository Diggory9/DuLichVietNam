import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { User } from "../models/User";

async function seedAdmin() {
  await connectDB();

  const existing = await User.findOne({ username: "admin" });
  if (existing) {
    console.log("Admin user already exists");
    await mongoose.connection.close();
    process.exit(0);
  }

  await User.create({
    username: "admin",
    email: "admin@dulichvietnam.com",
    password: "admin123456",
    role: "admin",
  });

  console.log("Admin user created:");
  console.log("  Username: admin");
  console.log("  Email: admin@dulichvietnam.com");
  console.log("  Password: admin123456");
  console.log("  (Change this password after first login!)");

  await mongoose.connection.close();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Seed admin failed:", err);
  process.exit(1);
});
