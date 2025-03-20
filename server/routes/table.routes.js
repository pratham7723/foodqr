import express from "express";
import { Router } from "express";

import {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} from "../controllers/table.controller.js";

const tableRouter = Router();

// Routes for tables
tableRouter.get("/", getTables); // Get all tables
tableRouter.get("/:id", getTableById); // Get a single table by ID
tableRouter.post("/", createTable); // Create a new table
tableRouter.put("/:id", updateTable); // Update an existing table
tableRouter.delete("/:id", deleteTable); // Delete a table

export default tableRouter;
