import { config } from "dotenv";

// Load environment variables from the appropriate .env file
config({ 
  path: `.env.${process.env.NODE_ENV || "development"}.local` 
});

// Add JWT_SECRET to your environment variables
export const {
  NODE_ENV = "development",
  MONGO_URI,
  CLIENT_URL,
  SERVER_URL,
  PORT,
  IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT,
  JWT_SECRET,
} = process.env;