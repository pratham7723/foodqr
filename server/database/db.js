import mongoose from "mongoose";

import { MONGO_URI, NODE_ENV } from "../config/env.js";

if (!MONGO_URI) {
  throw new Error(
    "MONGO_URI is not defined, please define it in .env.<development|production>.local file"
  );
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB ${NODE_ENV} mode`);
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};

export default connectDB;
