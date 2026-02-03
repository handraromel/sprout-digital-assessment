/**
 * User Routes
 */

import { UserController } from "@/controllers";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

// /api/v1/users - Create a new user (public)
router.post("/", UserController.createUser);

// /api/v1/users - Get all users with pagination (protected)
router.get("/", authMiddleware, UserController.getAllUsers);

// /api/v1/users/:id - Get user by ID (protected)
router.get("/:id", authMiddleware, UserController.getUserById);

// /api/v1/users/:id - Update user (protected)
router.put("/:id", authMiddleware, UserController.updateUser);

// /api/v1/users/:id - Delete user (protected)
router.delete("/:id", authMiddleware, UserController.deleteUser);

// /api/v1/users/:id/activate - Activate user (protected)
router.patch("/:id/activate", authMiddleware, UserController.activateUser);

// /api/v1/users/:id/deactivate - Deactivate user (protected)
router.patch("/:id/deactivate", authMiddleware, UserController.deactivateUser);

export default router;
