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

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.username).toBe("testuser");
      expect(res.body.data.user.role).toBe("user");
    });

    it("should reject duplicate username", async () => {
      await User.create({
        username: "existing",
        email: "existing@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/register").send({
        username: "existing",
        email: "new@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject short password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "12345",
      });

      expect(res.status).toBe(400);
    });

    it("should reject missing fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "testuser" });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await User.create({
        username: "loginuser",
        email: "login@example.com",
        password: "password123",
      });
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        username: "loginuser",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.username).toBe("loginuser");
    });

    it("should reject wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        username: "loginuser",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should reject non-existent user", async () => {
      const res = await request(app).post("/api/auth/login").send({
        username: "nonexistent",
        password: "password123",
      });

      expect(res.status).toBe(401);
    });

    it("should reject missing fields", async () => {
      const res = await request(app).post("/api/auth/login").send({});

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return user when authenticated", async () => {
      const registerRes = await request(app).post("/api/auth/register").send({
        username: "meuser",
        email: "me@example.com",
        password: "password123",
      });

      const token = registerRes.body.data.token;

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe("meuser");
    });

    it("should reject without token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });

    it("should reject invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    beforeEach(async () => {
      await User.create({
        username: "forgotuser",
        email: "forgot@example.com",
        password: "password123",
      });
    });

    it("should return success for existing email", async () => {
      const res = await request(app).post("/api/auth/forgot-password").send({
        email: "forgot@example.com",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify token was saved
      const user = await User.findOne({ email: "forgot@example.com" });
      expect(user?.resetPasswordToken).toBeDefined();
      expect(user?.resetPasswordExpires).toBeDefined();
    });

    it("should return success for non-existent email (no enumeration)", async () => {
      const res = await request(app).post("/api/auth/forgot-password").send({
        email: "nonexistent@example.com",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should reject missing email", async () => {
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/reset-password/:token", () => {
    it("should reset password with valid token", async () => {
      await User.create({
        username: "resetuser",
        email: "reset@example.com",
        password: "oldpassword123",
      });

      // Create token manually
      const crypto = await import("crypto");
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      await User.findOneAndUpdate(
        { email: "reset@example.com" },
        {
          resetPasswordToken: hashedToken,
          resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000),
        }
      );

      const res = await request(app)
        .post(`/api/auth/reset-password/${rawToken}`)
        .send({ password: "newpassword123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();

      // Verify login with new password works
      const loginRes = await request(app).post("/api/auth/login").send({
        username: "resetuser",
        password: "newpassword123",
      });

      expect(loginRes.status).toBe(200);
    });

    it("should reject expired token", async () => {
      const crypto = await import("crypto");
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      await User.create({
        username: "expireduser",
        email: "expired@example.com",
        password: "password123",
      });

      await User.findOneAndUpdate(
        { email: "expired@example.com" },
        {
          resetPasswordToken: hashedToken,
          resetPasswordExpires: new Date(Date.now() - 1000),
        }
      );

      const res = await request(app)
        .post(`/api/auth/reset-password/${rawToken}`)
        .send({ password: "newpassword123" });

      expect(res.status).toBe(400);
    });

    it("should reject invalid token", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password/invalid-token")
        .send({ password: "newpassword123" });

      expect(res.status).toBe(400);
    });

    it("should reject short password", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password/sometoken")
        .send({ password: "123" });

      expect(res.status).toBe(400);
    });
  });
});
