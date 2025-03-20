import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    // required: true, // TODO: ENABLE BEFORE PRODUCTION
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
});

const Table = mongoose.model("Table", TableSchema);

export default Table;
