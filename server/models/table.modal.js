import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  tableNo: {
    type: Number,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["Available", "Booked", "Reserved"],
    default: "Available",
  },
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },
  menuItems: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  capacity: {
    type: Number,
    required: true,
    default: 4
  }
}, { timestamps: true });

const Table = mongoose.model("Table", TableSchema);

export default Table;