import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Table from "../models/table.modal.js";

/**
 * @desc    Place a new order
 * @route   POST /api/v1/orders
 * @access  Public
 * @param   {Object} req - Request object
 * @param   {Object} res - Response object
 * @returns {Object} JSON response with order details or error message
 */
export const placeOrder = async (req, res) => {
  try {
    console.log("📌 Request Body:", req.body);
    console.log("📌 Request Query:", req.query);

    const { customerName, phoneNumber, items, specialInstructions } = req.body;
    const { table } = req.query;

    // Validate required fields
    if (!customerName || !phoneNumber || !items || items.length === 0 || !table) {
      return res.status(400).json({
        success: false,
        message: "❌ Missing required fields: customerName, phoneNumber, items, or table",
      });
    }

    const tableNumber = parseInt(table, 10);
    if (isNaN(tableNumber)) {
      return res.status(400).json({
        success: false,
        message: "❌ Table number must be a valid number",
      });
    }

    // Check table availability first
    const existingTable = await Table.findOne({ tableNo: tableNumber });
    if (!existingTable) {
      return res.status(400).json({
        success: false,
        message: `❌ Table ${tableNumber} doesn't exist`,
      });
    }

    if (existingTable.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: `❌ Table ${tableNumber} is already ${existingTable.status}`,
      });
    }

    // Calculate total
    const total = req.body.total || items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create the order
    const newOrder = new Order({
      customerName,
      phoneNumber,
      items,
      total,
      tableNumber,
      specialInstructions: specialInstructions || "",
      status: "pending",
    });

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Save the order
      await newOrder.save({ session });

      // Update table status
      await Table.findOneAndUpdate(
        { tableNo: tableNumber },
        { 
          status: "Booked",
          $push: {
            menuItems: items.map(item => ({
              menuItem: item._id,
              quantity: item.quantity
            }))
          }
        },
        { new: true, session }
      );

      await session.commitTransaction();
      
      res.status(201).json({
        success: true,
        message: "✅ Order placed successfully",
        order: {
          orderId: newOrder.orderId,
          customerName: newOrder.customerName,
          tableNumber: newOrder.tableNumber,
          items: newOrder.items,
          total: newOrder.total,
          status: newOrder.status,
          createdAt: newOrder.createdAt,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "❌ Internal server error while placing order",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all orders with filtering options
 * @route   GET /api/v1/orders
 * @access  Public
 * @param   {Object} req - Request object
 * @param   {Object} res - Response object
 * @returns {Object} JSON response with orders array or error message
 */
export const getOrders = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { status, table, sortBy, limit } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (table) filter.tableNumber = parseInt(table);

    // Build query
    let query = Order.find(filter);

    // Sorting (default: newest first)
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };
    query = query.sort(sortOptions[sortBy] || sortOptions.newest);

    // Limiting results
    if (limit) query = query.limit(parseInt(limit));

    const orders = await query.exec();

    // Format response
    const formattedOrders = orders.map(order => ({
      orderId: order.orderId,
      customerName: order.customerName,
      tableNumber: order.tableNumber,
      status: order.status,
      items: order.items,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    res.status(200).json({
      success: true,
      count: orders.length,
      data: formattedOrders,
    });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "❌ Internal server error while fetching orders",
      error: error.message,
    });
  }
};

/**
 * @desc    Update order status with validation
 * @route   PATCH /api/v1/orders/:orderId
 * @access  Public
 * @param   {Object} req - Request object
 * @param   {Object} res - Response object
 * @returns {Object} JSON response with updated order or error message
 */
// Update order status with proper validation
// Add this normalization at the top of your updateOrderStatus function
export const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    let { status } = req.body;
    status = status.toLowerCase();

    const validStatuses = ["pending", "preparing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      });
    }

    const order = await Order.findOne({ orderId }).session(session);
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }

    // If changing to completed or cancelled, free up the table
    if (["completed", "cancelled"].includes(status)) {
      await Table.findOneAndUpdate(
        { tableNo: order.tableNumber },
        { 
          status: "Available",
          $pull: { menuItems: {} } // Clear all menu items
        },
        { session }
      );
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Cancel an order with validation
 * @route   DELETE /api/v1/orders/:orderId
 * @access  Public
 * @param   {Object} req - Request object
 * @param   {Object} res - Response object
 * @returns {Object} JSON response with success message or error
 */
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find order first to check current status
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "❌ Order not found",
      });
    }

    // Check if order can be cancelled
    if (order.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "❌ Completed orders cannot be cancelled",
      });
    }

    // Update status to cancelled instead of deleting
    const cancelledOrder = await Order.findOneAndUpdate(
      { orderId },
      { status: "cancelled" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `✅ Order #${orderId} cancelled successfully`,
      data: {
        orderId: cancelledOrder.orderId,
        previousStatus: order.status,
        cancelledAt: cancelledOrder.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "❌ Internal server error while cancelling order",
      error: error.message,
    });
  }
};