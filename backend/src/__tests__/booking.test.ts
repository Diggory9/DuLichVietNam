import request from "supertest";
import app from "../app";
import { User } from "../models/User";
import { Hotel } from "../models/Hotel";
import { Tour } from "../models/Tour";
import { Booking } from "../models/Booking";
import { RoomInventory } from "../models/RoomInventory";
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

async function createUserAndLogin(
  role: "user" | "admin" = "user"
): Promise<string> {
  const username = role === "admin" ? "adminuser" : "testuser";
  await User.create({
    username,
    email: `${username}@example.com`,
    password: "password123",
    role,
  });

  const res = await request(app).post("/api/auth/login").send({
    username,
    password: "password123",
  });

  return res.body.data.token;
}

const sampleHotel = {
  slug: "hotel-test",
  name: "Hotel Test",
  nameVi: "Khách sạn Test",
  provinceSlug: "ha-noi",
  address: "123 Test Street",
  stars: 4,
  description: "A test hotel",
  longDescription: "A test hotel with great rooms",
  images: [{ src: "https://example.com/hotel.jpg", alt: "Hotel" }],
  priceRange: { min: 500000, max: 2000000 },
  amenities: ["wifi", "pool"],
  rooms: [
    {
      name: "Standard Room",
      type: "standard" as const,
      price: 500000,
      maxGuests: 2,
      totalRooms: 3,
      amenities: ["wifi"],
      images: ["https://example.com/room.jpg"],
      available: true,
    },
  ],
};

const sampleTour = {
  slug: "tour-test",
  name: "Tour Test",
  nameVi: "Tour Test",
  destinationSlugs: ["ho-guom"],
  provinceSlug: "ha-noi",
  category: "van-hoa" as const,
  description: "A test tour",
  longDescription: "A detailed test tour",
  images: [{ src: "https://example.com/tour.jpg", alt: "Tour" }],
  duration: { days: 2, nights: 1 },
  price: 1500000,
  discountPrice: 1200000,
  maxGroupSize: 20,
  schedule: [
    {
      dayNumber: 1,
      title: "Day 1",
      description: "First day",
      destinationSlugs: ["ho-guom"],
    },
  ],
  includes: ["Guide"],
  excludes: ["Lunch"],
  highlights: ["Scenic views"],
};

describe("Bookings API", () => {
  describe("POST /api/bookings", () => {
    it("should create a hotel booking", async () => {
      const token = await createUserAndLogin();
      await Hotel.create(sampleHotel);

      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "hotel",
          hotelSlug: "hotel-test",
          roomName: "Standard Room",
          checkIn: "2026-06-01",
          checkOut: "2026-06-03",
          guests: 2,
          contactInfo: {
            fullName: "Test User",
            email: "test@example.com",
            phone: "0912345678",
          },
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.bookingCode).toBeDefined();
      expect(res.body.data.type).toBe("hotel");
      expect(res.body.data.totalPrice).toBe(1000000); // 500000 * 2 nights
    });

    it("should create a tour booking", async () => {
      const token = await createUserAndLogin();
      await Tour.create(sampleTour);

      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "tour",
          tourSlug: "tour-test",
          tourDate: "2026-06-01",
          guests: 3,
          contactInfo: {
            fullName: "Test User",
            email: "test@example.com",
            phone: "0912345678",
          },
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.type).toBe("tour");
      expect(res.body.data.totalPrice).toBe(3600000); // 1200000 (discount) * 3 guests
    });

    it("should reject booking without authentication", async () => {
      const res = await request(app).post("/api/bookings").send({
        type: "hotel",
        hotelSlug: "hotel-test",
      });

      expect(res.status).toBe(401);
    });

    it("should reject invalid booking type", async () => {
      const token = await createUserAndLogin();

      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "invalid",
          contactInfo: {
            fullName: "Test",
            email: "test@example.com",
            phone: "0912345678",
          },
        });

      expect(res.status).toBe(400);
    });

    it("should reject hotel booking for non-existent hotel", async () => {
      const token = await createUserAndLogin();

      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "hotel",
          hotelSlug: "non-existent",
          roomName: "Standard Room",
          checkIn: "2026-06-01",
          checkOut: "2026-06-03",
          guests: 2,
          contactInfo: {
            fullName: "Test",
            email: "test@example.com",
            phone: "0912345678",
          },
        });

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/bookings/my", () => {
    it("should return user bookings", async () => {
      const token = await createUserAndLogin();
      await Tour.create(sampleTour);

      // Create a booking first
      await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "tour",
          tourSlug: "tour-test",
          tourDate: "2026-06-01",
          guests: 1,
          contactInfo: {
            fullName: "Test User",
            email: "test@example.com",
            phone: "0912345678",
          },
        });

      const res = await request(app)
        .get("/api/bookings/my")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
    });

    it("should reject without authentication", async () => {
      const res = await request(app).get("/api/bookings/my");
      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /api/bookings/my/:code/cancel", () => {
    it("should cancel a booking", async () => {
      const token = await createUserAndLogin();
      await Tour.create(sampleTour);

      const createRes = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "tour",
          tourSlug: "tour-test",
          tourDate: "2026-06-01",
          guests: 1,
          contactInfo: {
            fullName: "Test User",
            email: "test@example.com",
            phone: "0912345678",
          },
        });

      const bookingCode = createRes.body.data.bookingCode;

      const res = await request(app)
        .patch(`/api/bookings/my/${bookingCode}/cancel`)
        .set("Authorization", `Bearer ${token}`)
        .send({ cancellationReason: "Changed plans" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("cancelled");
    });

    it("should release room inventory on hotel booking cancel", async () => {
      const token = await createUserAndLogin();
      await Hotel.create(sampleHotel);

      const createRes = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "hotel",
          hotelSlug: "hotel-test",
          roomName: "Standard Room",
          checkIn: "2026-07-01",
          checkOut: "2026-07-02",
          guests: 2,
          contactInfo: {
            fullName: "Test User",
            email: "test@example.com",
            phone: "0912345678",
          },
        });

      const bookingCode = createRes.body.data.bookingCode;

      // Check inventory was reserved
      let inventory = await RoomInventory.findOne({
        hotelSlug: "hotel-test",
        roomName: "Standard Room",
      });
      expect(inventory?.bookedRooms).toBe(1);

      // Cancel
      await request(app)
        .patch(`/api/bookings/my/${bookingCode}/cancel`)
        .set("Authorization", `Bearer ${token}`);

      // Check inventory was released
      inventory = await RoomInventory.findOne({
        hotelSlug: "hotel-test",
        roomName: "Standard Room",
      });
      expect(inventory?.bookedRooms).toBe(0);
    });
  });

  describe("Admin endpoints", () => {
    it("GET /api/bookings/admin/all should return all bookings for admin", async () => {
      const adminToken = await createUserAndLogin("admin");

      const res = await request(app)
        .get("/api/bookings/admin/all")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("GET /api/bookings/admin/all should reject non-admin", async () => {
      const userToken = await createUserAndLogin("user");

      const res = await request(app)
        .get("/api/bookings/admin/all")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it("GET /api/bookings/admin/stats should return stats for admin", async () => {
      const adminToken = await createUserAndLogin("admin");

      const res = await request(app)
        .get("/api/bookings/admin/stats")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("total");
      expect(res.body.data).toHaveProperty("pending");
      expect(res.body.data).toHaveProperty("confirmed");
      expect(res.body.data).toHaveProperty("cancelled");
      expect(res.body.data).toHaveProperty("revenue");
    });
  });
});
