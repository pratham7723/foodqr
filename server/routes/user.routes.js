import express from "express";
import { Router } from "express";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const userRouter = Router();

// Routes for users
userRouter.get("/", getUsers); // Get all users
userRouter.get("/:id", getUserById); // Get a single user by ID
userRouter.post("/", createUser); // Create a new user
userRouter.put("/:id", updateUser); // Update an existing user
userRouter.delete("/:id", deleteUser); // Delete a user

export default userRouter;
