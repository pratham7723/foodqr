import { config } from "dotenv";

// Load environment variables from the appropriate .env file
config({ 
  path: `.env.${process.env.NODE_ENV || "development"}.local` 
});

// Add JWT_SECRET to your environment variables
export const {
  NODE_ENV = "development",
  MONGO_URI = "mongodb://127.0.0.1:27017/restaurantDB",
  CLIENT_URL = "http://localhost:5173",
  SERVER_URL = "http://localhost:3000",
  PORT = 3000,
  IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT,
  JWT_SECRET = "your-strong-default-secret-change-this", // Add this line
} = process.env;