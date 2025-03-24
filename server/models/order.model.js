import mongoose from "mongoose";

// Counter Schema for auto-increment
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    orderId: { type: Number, unique: true },
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    tableNumber: { type: Number, required: true },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        _id: false
      }
    ],
    total: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'preparing', 'completed', 'cancelled'],
      default: 'pending' 
    },
    specialInstructions: { type: String, default: '' }
  },
  { timestamps: true }
);

// Auto-increment Order ID
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "orderId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.orderId = counter.seq;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;