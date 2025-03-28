import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Out of Stock"],
      default: "Available",
    },
    photo: {
      type: String,
      required: true,
    },
    arModel: {
      type: String,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      // required: true, // TODO: ENABLE BEFORE PRODUCTION
    },
  },
  {
    timestamps: true,
  }
);
const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);
export default Menu;
