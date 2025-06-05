import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import textRoutes from "./routes/textRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/texts", textRoutes);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

export default app;
