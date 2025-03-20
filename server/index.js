import express from "express";
import { CLIENT_URL, PORT } from "./config/env.js";
import connectDB from "./database/db.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Importing Routes
import imagekitRouter from "./routes/imagekit.routes.js";
import restaurantRouter from "./routes/restaurant.routes.js";
import userRouter from "./routes/user.routes.js";
import menuRoutesr from "./routes/menu.routes.js";
import tableRoutesr from "./routes/table.routes.js";

const app = express();
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/v1/images", imagekitRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/menus", menuRoutesr);
app.use("/api/v1/tables", tableRoutesr);

// ERROR HANDLER
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("⚙️QRCode Backend Server");
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});
