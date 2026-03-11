import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { corsOptions } from "./config/cors";
import { errorHandler } from "./middleware/errorHandler";
import { env } from "./config/env";

// Import routes
import provinceRoutes from "./routes/province.routes";
import destinationRoutes from "./routes/destination.routes";
import statsRoutes from "./routes/stats.routes";
import siteConfigRoutes from "./routes/siteConfig.routes";
import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";
import postRoutes from "./routes/post.routes";
import contactRoutes from "./routes/contact.routes";
import commentRoutes from "./routes/comment.routes";
import reviewRoutes from "./routes/review.routes";
import userRoutes from "./routes/user.routes";
import itineraryRoutes from "./routes/itinerary.routes";
import newsletterRoutes from "./routes/newsletter.routes";
import notificationRoutes from "./routes/notification.routes";
import adminUserRoutes from "./routes/admin-user.routes";
import storyRoutes, { adminStoryRouter } from "./routes/story.routes";
import hotelRoutes from "./routes/hotel.routes";
import tourRoutes from "./routes/tour.routes";
import bookingRoutes from "./routes/booking.routes";
import paymentRoutes from "./routes/payment.routes";
import roomInventoryRoutes from "./routes/room-inventory.routes";

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors(corsOptions));
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/provinces", provinceRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/site-config", siteConfigRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/admin/stories", adminStoryRouter);
app.use("/api/hotels", hotelRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/room-inventory", roomInventoryRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

// Error handler
app.use(errorHandler);

export default app;
