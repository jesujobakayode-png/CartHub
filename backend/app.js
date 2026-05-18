import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "CampusBite API is running",
    routes: {
      products: "/api/products",
      health: "/api/health"
    }
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "CampusBite API is running",
    routes: {
      products: "/api/products",
      health: "/api/health"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

const requireDB = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    res.status(500).json({
      message: "Database connection failed"
    });
  }
};

app.use("/api/products", requireDB, productRoutes);

export default app;
