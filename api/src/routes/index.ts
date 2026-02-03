import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const router = Router();

/**
 * API Routes
 * Prefix all routes with /api
 */

// Auth routes
router.use("/auth", authRoutes);

// User routes
router.use("/users", userRoutes);

/**
 * Health check endpoint
 */
router.get("/health", (req, res) => {
  res.json({
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
