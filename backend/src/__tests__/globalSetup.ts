import { MongoMemoryServer } from "mongodb-memory-server";

export default async function globalSetup() {
  const mongod = await MongoMemoryServer.create({
    instance: {
      launchTimeout: 120000,
    },
  });
  const uri = mongod.getUri();

  // Store URI and instance for globalTeardown
  (globalThis as any).__MONGOD__ = mongod;
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = "test-secret-key";
  process.env.NODE_ENV = "test";
}
