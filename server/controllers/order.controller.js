import Order from "../models/order.model.js";

// Place a new order
export const placeOrder = async (req, res) => {
  try {
    console.log("📌 Request Query:", req.query); // Debugging

    const { customerName, phoneNumber, items, total } = req.body;
    const { table } = req.query; // Get table number from URL query

    if (!customerName || !phoneNumber || !items || items.length === 0 || !total || !table) {
      return res.status(400).json({ message: "❌ All fields are required, and cart cannot be empty" });
    }

    const tableNumber = parseInt(table, 10); // Convert to number

    const newOrder = new Order({ customerName, phoneNumber, items, total, tableNumber });
    await newOrder.save();

    res.status(201).json({ message: "✅ Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ message: "❌ Error placing order", error: error.message });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Latest orders first
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "❌ Error fetching orders", error: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: "❌ Order not found" });
    }

    res.status(200).json({ message: "✅ Order status updated", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "❌ Error updating order status", error: error.message });
  }
};

// Cancel an order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOneAndDelete({ orderId });

    if (!order) {
      return res.status(404).json({ message: "❌ Order not found" });
    }

    res.status(200).json({ message: `✅ Order #${orderId} cancelled successfully!` });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "❌ Failed to cancel order", error: error.message });
  }
};
