import Order from '../models/order.model.js';
import Menu from "../models/Menu.modal.js";

// Helper function to get date ranges
const getDateRange = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  return { startDate, endDate };
};

// Daily Orders and Sales Report
export const getDailyReport = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const { startDate, endDate } = getDateRange(parseInt(days));

    const dailyData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$total" }
        }
      },
      {
        $sort: { "_id": 1 }
      },
      {
        $project: {
          day: "$_id",
          orders: 1,
          sales: 1,
          _id: 0
        }
      }
    ]);

    res.json(dailyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Most Ordered Items Report
export const getMostOrderedItems = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const mostOrdered = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          orders: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { orders: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          name: "$_id",
          orders: 1,
          totalRevenue: 1,
          _id: 0
        }
      }
    ]);

    res.json(mostOrdered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Summary Report
export const getSummaryReport = async (req, res) => {
  try {
    const currentPeriod = getDateRange(7); // Last 7 days
    const previousPeriod = getDateRange(14); // 14-7 days ago

    // Current period stats
    const currentStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: currentPeriod.startDate, $lte: currentPeriod.endDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" }
        }
      }
    ]);

    // Previous period stats
    const previousStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousPeriod.startDate, $lte: previousPeriod.endDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" }
        }
      }
    ]);

    const current = currentStats[0] || { totalOrders: 0, totalRevenue: 0 };
    const previous = previousStats[0] || { totalOrders: 0, totalRevenue: 0 };

    // Calculate growth rates
    const growthRateOrders = previous.totalOrders > 0 
      ? ((current.totalOrders - previous.totalOrders) / previous.totalOrders * 100).toFixed(2)
      : 100;
    
    const growthRateRevenue = previous.totalRevenue > 0 
      ? ((current.totalRevenue - previous.totalRevenue) / previous.totalRevenue * 100).toFixed(2)
      : 100;

    res.json({
      totalOrders: current.totalOrders,
      totalRevenue: current.totalRevenue,
      growthRateOrders: parseFloat(growthRateOrders),
      growthRateRevenue: parseFloat(growthRateRevenue)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};