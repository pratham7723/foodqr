import express from "express";
import { Router } from "express";

import {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  checkTableAvailability,
  releaseTable,
} from "../controllers/table.controller.js";

const tableRouter = Router();

// Routes for tables
tableRouter.get("/", getTables); // Get all tables
tableRouter.get("/:id", getTableById); // Get a single table by ID
tableRouter.post("/", createTable); // Create a new table
tableRouter.put("/:id", updateTable); // Update an existing table
tableRouter.delete("/:id", deleteTable); // Delete a table
tableRouter.get("/check/:tableNo", checkTableAvailability);
tableRouter.patch("/:id/release", releaseTable); // Release a table

export default tableRouter;
