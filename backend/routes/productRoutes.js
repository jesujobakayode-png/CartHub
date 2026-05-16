import express from "express";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();


// GET ALL PRODUCTS
router.get("/", getProducts);


// CREATE PRODUCT
router.post("/", createProduct);


// UPDATE PRODUCT
router.put("/:id", updateProduct);


// DELETE PRODUCT
router.delete("/:id", deleteProduct);


export default router;