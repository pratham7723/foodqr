import { Router } from "express";
import { auth } from "../controllers/imagekit.controller.js";

const imagekitRouter = Router();

imagekitRouter.get("/auth", auth);

export default imagekitRouter;
