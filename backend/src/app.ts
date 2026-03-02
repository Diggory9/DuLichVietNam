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

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

// Error handler
app.use(errorHandler);

export default app;
