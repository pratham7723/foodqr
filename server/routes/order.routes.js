import express from "express";
import { 
  placeOrder, 
  getOrders, 
  updateOrderStatus, 
  cancelOrder 
} from "../controllers/order.controller.js";

const router = express.Router();

// Place a new order
router.post("/", placeOrder);

// Get all orders
router.get("/", getOrders);

// Update order status
router.patch("/:orderId", updateOrderStatus);

// Cancel order
router.delete("/:orderId", cancelOrder);

export default router;