import express from "express";

import {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

import { vendorOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();


// BUYER CREATE ORDER
router.post(
  "/",
  protect,
  createOrder
);


// BUYER VIEW OWN ORDERS
router.get(
  "/my-orders",
  protect,
  getMyOrders
);


// VENDOR VIEW ALL ORDERS
router.get(
  "/",
  protect,
  vendorOnly,
  getOrders
);


// VENDOR UPDATE ORDER STATUS
router.put(
  "/:id",
  protect,
  vendorOnly,
  updateOrderStatus
);

export default router;