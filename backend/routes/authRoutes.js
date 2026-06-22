import express from "express";
import {
  getProfile,
  loginUser,
  registerUser,
  updateProfile,
  listVendors,
  getVendorById,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/vendors", listVendors);
router.get("/vendor/:id", getVendorById);

export default router;
