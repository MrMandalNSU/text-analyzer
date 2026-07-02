import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import textRoutes from "./routes/textRoutes";
import analysisRoutes from "./routes/analysisRoutes";

dotenv.config();

const app = express();
const requiredEnv = (key: string): string => {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`${key} is required.`);
  }

  return value;
};

const apiRoutePrefix = requiredEnv("API_ROUTE_PREFIX").replace(/\/$/, "");
const allowedCorsOrigins = requiredEnv("CORS_ORIGINS")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedCorsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

// CORS
app.use(cors(corsOptions));

// JSON body parser
app.use(express.json());

// Route registrations
app.use(`${apiRoutePrefix}/texts`, textRoutes);
app.use(`${apiRoutePrefix}/analysis`, analysisRoutes);

// DB connections
mongoose
  .connect(requiredEnv("MONGO_URI"))
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

export default app;
