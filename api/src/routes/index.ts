import { Router } from "express";
import accountRoutes from "./account.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const router = Router();

/**
 * API Routes
 * Prefix all routes with /api
 */

// Account routes (Chart of Accounts)
router.use("/accounts", accountRoutes);

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
