// This file exports helpers for test files to use
import mongoose from "mongoose";

export async function connectTestDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set by globalSetup");
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
}

export async function disconnectTestDB() {
  await mongoose.connection.close();
}

export async function clearTestDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}
