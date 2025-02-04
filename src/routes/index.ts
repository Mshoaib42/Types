import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
const router = Router();

// Authentication routes [Login User, Register User]
router.use("/auth", authRoutes);

// User routes [Get All Users, Get User By Id, Delete User]
router.use("/users", userRoutes);

export default router;
