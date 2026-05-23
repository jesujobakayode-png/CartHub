import express from "express";

import {
  getProducts,
  getProduct,
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { vendorOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();


// GET ALL PRODUCTS
router.get("/", getProducts);


// GET PRODUCTS FOR LOGGED-IN VENDOR
router.get(
  "/vendor/my-products",
  protect,
  vendorOnly,
  getVendorProducts
);


// GET SINGLE PRODUCT
router.get("/:id", getProduct);


// ONLY VENDOR CAN CREATE
router.post(
  "/",
  protect,
  vendorOnly,
  createProduct
);

// ONLY VENDOR CAN UPDATE
router.put(
  "/:id",
  protect,
  vendorOnly,
  updateProduct
);


// ONLY VENDOR CAN DELETE
router.delete(
  "/:id",
  protect,
  vendorOnly,
  deleteProduct
);

export default router;
