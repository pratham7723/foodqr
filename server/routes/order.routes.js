import express from "express";
import Order from "../models/order.model.js"; // Make sure to import your Order model
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

// GET /api/v1/orders/stats
router.get('/stats', async (req, res) => {
  try {
    // 1. Get raw counts first
    const totalOrders = await Order.countDocuments();
    
    if (totalOrders === 0) {
      return res.json({
        totalOrders: 0,
        totalRevenue: 0,
        activeTables: 0,
        availableTables: 4 // Your total table count
      });
    }

    // 2. Calculate total revenue (works even if 'total' field is named differently)
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $ifNull: ["$total", 0] } }
        }
      }
    ]);

    // 3. Count active tables (more reliable method)
    const activeTablesResult = await Order.aggregate([
      { 
        $match: { 
          status: { 
            $exists: true,
            $nin: ["completed", "cancelled", null] 
          },
          tableNumber: { $exists: true, $ne: null }
        } 
      },
      { $group: { _id: "$tableNumber" } },
      { $count: "activeTables" }
    ]);

    // 4. Get today's revenue
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart },
          total: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          amount: { $sum: "$total" }
        }
      }
    ]);

    res.json({
      totalOrders,
      totalRevenue: revenueResult[0]?.totalRevenue || 0,
      activeTables: activeTablesResult[0]?.activeTables || 0,
      availableTables: 20 - (activeTablesResult[0]?.activeTables || 0),
      todaysRevenue: todayRevenueResult[0]?.amount || 0,
      lastUpdated: new Date(),
      currency: "INR"  // Add this field
    });

  } catch (err) {
    console.error("STATS_ERROR:", err);
    res.status(500).json({ 
      error: "Failed to generate stats",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Add this temporary route to your orderRoutes.js
router.get('/debug', async (req, res) => {
  try {
    // Get 3 sample orders
    const sampleOrders = await Order.find().limit(3).lean();
    
    // Check field existence
    const fieldReport = sampleOrders.map(order => ({
      id: order._id,
      hasTotal: 'total' in order,
      totalValue: order.total,
      hasStatus: 'status' in order,
      statusValue: order.status,
      hasTable: 'tableNumber' in order,
      tableValue: order.tableNumber,
      createdAt: order.createdAt
    }));

    res.json({
      totalOrders: await Order.countDocuments(),
      sampleData: fieldReport,
      allStatusValues: await Order.distinct('status')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;