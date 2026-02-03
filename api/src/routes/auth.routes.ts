/**
 * Auth Routes
 */

import { AuthController } from "@/controllers";
import { Router } from "express";

const router = Router();

// POST /api/v1/auth/login - Login user
router.post("/login", AuthController.login);

// POST /api/v1/auth/refresh - Refresh access token
router.post("/refresh", AuthController.refresh);

export default router;
