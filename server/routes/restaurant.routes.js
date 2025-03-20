import express from "express";
import { Router } from "express";

import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurant.controller.js";

const restaurantRouter = Router();

// Routes for restaurants
restaurantRouter.get("/", getRestaurants); // Get all restaurants
restaurantRouter.get("/:id", getRestaurantById); // Get a single restaurant by ID
restaurantRouter.post("/", createRestaurant); // Create a new restaurant
restaurantRouter.put("/:id", updateRestaurant); // Update an existing restaurant
restaurantRouter.delete("/:id", deleteRestaurant); // Delete a restaurant

export default restaurantRouter;
