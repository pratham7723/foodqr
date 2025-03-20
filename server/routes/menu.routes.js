import express from "express";
import { Router } from "express";

import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menu.controller.js";

const menuRouter = Router();

// Routes for menu items
menuRouter.get("/", getMenuItems); // Get all menu items
menuRouter.get("/:id", getMenuItemById); // Get a single menu item by ID
menuRouter.post("/", createMenuItem); // Create a new menu item
menuRouter.put("/:id", updateMenuItem); // Update an existing menu item
menuRouter.delete("/:id", deleteMenuItem); // Delete a menu item

export default menuRouter;
