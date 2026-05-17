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

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
