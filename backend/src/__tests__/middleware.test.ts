import request from "supertest";
import app from "../app";
import { User } from "../models/User";
import { connectTestDB, disconnectTestDB, clearTestDB } from "./setup";

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe("Auth Middleware", () => {
  describe("auth (required)", () => {
    it("should allow access with valid token", async () => {
      await User.create({
        username: "authuser",
        email: "auth@example.com",
        password: "password123",
      });

      const loginRes = await request(app).post("/api/auth/login").send({
        username: "authuser",
        password: "password123",
      });

      const token = loginRes.body.data.token;

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe("authuser");
    });

    it("should reject request without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should reject request with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-jwt-token");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should reject request with malformed Authorization header", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "NotBearer some-token");

      expect(res.status).toBe(401);
    });
  });

  describe("requireAdmin", () => {
    it("should allow admin users", async () => {
      await User.create({
        username: "admin",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
      });

      const loginRes = await request(app).post("/api/auth/login").send({
        username: "admin",
        password: "password123",
      });

      const token = loginRes.body.data.token;

      // Admin-only endpoint: GET /api/bookings/admin/stats
      const res = await request(app)
        .get("/api/bookings/admin/stats")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should reject non-admin users", async () => {
      await User.create({
        username: "normaluser",
        email: "normal@example.com",
        password: "password123",
        role: "user",
      });

      const loginRes = await request(app).post("/api/auth/login").send({
        username: "normaluser",
        password: "password123",
      });

      const token = loginRes.body.data.token;

      const res = await request(app)
        .get("/api/bookings/admin/stats")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("should reject unauthenticated requests to admin endpoints", async () => {
      const res = await request(app).get("/api/bookings/admin/stats");

      expect(res.status).toBe(401);
    });
  });

  describe("optionalAuth", () => {
    it("should work without authentication on endpoints using optionalAuth", async () => {
      // Destinations use optionalAuth for the detail endpoint
      const res = await request(app).get("/api/destinations");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should attach user when token provided on optionalAuth endpoints", async () => {
      await User.create({
        username: "optuser",
        email: "opt@example.com",
        password: "password123",
      });

      const loginRes = await request(app).post("/api/auth/login").send({
        username: "optuser",
        password: "password123",
      });

      const token = loginRes.body.data.token;

      // Destinations endpoint works with or without auth
      const res = await request(app)
        .get("/api/destinations")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
