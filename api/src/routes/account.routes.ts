/**
 * Account Routes
 * Chart of Accounts API endpoints
 */

import { AccountController } from "@/controllers";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

// GET /api/v1/accounts/tree - Get accounts as hierarchical tree (protected)
router.get("/tree", authMiddleware, AccountController.getAccountTree);

// GET /api/v1/accounts - Get all accounts with filtering (protected)
router.get("/", authMiddleware, AccountController.getAllAccounts);

// GET /api/v1/accounts/:id - Get account by ID (protected)
router.get("/:id", authMiddleware, AccountController.getAccountById);

// POST /api/v1/accounts - Create a new account (protected)
router.post("/", authMiddleware, AccountController.createAccount);

// PUT /api/v1/accounts/:id - Update account (protected)
router.put("/:id", authMiddleware, AccountController.updateAccount);

// DELETE /api/v1/accounts/:id - Delete account (protected)
router.delete("/:id", authMiddleware, AccountController.deleteAccount);

export default router;
