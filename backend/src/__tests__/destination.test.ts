import request from "supertest";
import app from "../app";
import { Destination } from "../models/Destination";
import { Province } from "../models/Province";
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

const sampleProvince = {
  slug: "ha-noi",
  name: "Ha Noi",
  nameVi: "Hà Nội",
  region: "mien-bac",
  description: "Thủ đô Hà Nội",
  longDescription: "Hà Nội là thủ đô của Việt Nam với lịch sử hơn 1000 năm.",
  heroImage: "https://example.com/hanoi.jpg",
  thumbnail: "https://example.com/hanoi-thumb.jpg",
};

const sampleDestination = {
  slug: "ho-guom",
  name: "Ho Guom",
  nameVi: "Hồ Gươm",
  provinceSlug: "ha-noi",
  category: "lich-su",
  description: "Hồ Gươm nằm giữa lòng Hà Nội",
  longDescription: "Chi tiết về Hồ Gươm",
  images: [{ src: "https://example.com/image.jpg", alt: "Hồ Gươm" }],
  coordinates: { lat: 21.0285, lng: 105.8542 },
  featured: true,
  order: 1,
};

describe("Destinations API", () => {
  beforeEach(async () => {
    await Province.create(sampleProvince);
    await Destination.create(sampleDestination);
  });

  describe("GET /api/destinations", () => {
    it("should return destinations list", async () => {
      const res = await request(app).get("/api/destinations");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("should support pagination params", async () => {
      for (let i = 0; i < 5; i++) {
        await Destination.create({
          ...sampleDestination,
          slug: `dest-${i}`,
          name: `Dest ${i}`,
        });
      }

      const res = await request(app)
        .get("/api/destinations")
        .query({ page: 1, limit: 3 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/destinations/:slug", () => {
    it("should return destination by slug", async () => {
      const res = await request(app).get("/api/destinations/ho-guom");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe("ho-guom");
    });

    it("should return 404 for non-existent slug", async () => {
      const res = await request(app).get("/api/destinations/non-existent");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/destinations/featured", () => {
    it("should return featured destinations", async () => {
      const res = await request(app).get("/api/destinations/featured");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/destinations/search", () => {
    it("should search by keyword", async () => {
      const res = await request(app)
        .get("/api/destinations/search")
        .query({ q: "Gươm" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should filter by category", async () => {
      const res = await request(app)
        .get("/api/destinations/search")
        .query({ category: "lich-su" });

      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/destinations/by-province/:slug", () => {
    it("should return destinations by province", async () => {
      const res = await request(app).get(
        "/api/destinations/by-province/ha-noi"
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Admin CRUD", () => {
    let adminToken: string;

    beforeEach(async () => {
      await User.create({
        username: "admin",
        email: "admin@test.com",
        password: "admin123456",
        role: "admin",
      });

      const loginRes = await request(app).post("/api/auth/login").send({
        username: "admin",
        password: "admin123456",
      });

      adminToken = loginRes.body.data.token;
    });

    it("should create a destination (admin)", async () => {
      const res = await request(app)
        .post("/api/destinations")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          slug: "van-mieu",
          name: "Van Mieu",
          nameVi: "Văn Miếu",
          provinceSlug: "ha-noi",
          category: "lich-su",
          description: "Văn Miếu Quốc Tử Giám",
          longDescription: "Chi tiết về Văn Miếu",
          images: [{ src: "https://example.com/vm.jpg", alt: "Văn Miếu" }],
        });

      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe("van-mieu");
    });

    it("should reject create without admin role", async () => {
      const userRes = await request(app).post("/api/auth/register").send({
        username: "normaluser",
        email: "normal@test.com",
        password: "password123",
      });

      const res = await request(app)
        .post("/api/destinations")
        .set("Authorization", `Bearer ${userRes.body.data.token}`)
        .send({ slug: "test", name: "Test" });

      expect(res.status).toBe(403);
    });
  });
});
