import express from "express";
import { CLIENT_URL, PORT } from "./config/env.js";
import connectDB from "./database/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";


// Importing Routes
import imagekitRouter from "./routes/imagekit.routes.js";
import restaurantRouter from "./routes/restaurant.routes.js";
import userRouter from "./routes/user.routes.js";
import menuRouter from "./routes/menu.routes.js";
import tableRouter from "./routes/table.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reportRoutes from './routes/report.routes.js';
import authRouter from "./routes/auth.routes.js";

const app = express();

// Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRouter); 
app.use("/api/v1/images", imagekitRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/menus", menuRouter);
app.use("/api/v1/tables", tableRouter);
app.use("/api/v1/orders", orderRoutes);
app.use('/api/v1/reports', reportRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("⚙️ QRCode Backend Server is Running");
});

// Connect to DB & Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectDB();
});
