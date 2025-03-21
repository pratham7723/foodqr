import express from "express";
import { placeOrder, getOrders, updateOrderStatus, cancelOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", placeOrder);  // Place an order
router.get("/", getOrders);    // Get all orders
router.put("/:orderId", updateOrderStatus);  // Update order status
router.delete("/:orderId", cancelOrder);  // Cancel order

export default router;
