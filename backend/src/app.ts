import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import textRoutes from "./routes/textRoutes";
import analysisRoutes from "./routes/analysisRoutes";

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// JSON body parser
app.use(express.json());

// Route registrations
app.use("/api/texts", textRoutes);
app.use("/api/analysis", analysisRoutes);

// DB connections
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

export default app;
