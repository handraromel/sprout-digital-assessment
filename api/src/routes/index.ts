import { Router } from "express";
import accountRoutes from "./account.routes";
import authRoutes from "./auth.routes";
import invoiceRoutes from "./invoice.routes";
import journalRoutes from "./journal.routes";
import paymentRoutes from "./payment.routes";
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

// Journal routes (Jurnal Umum)
router.use("/journals", journalRoutes);

// Invoice routes (Penagihan / A/R Management)
router.use("/invoices", invoiceRoutes);

// Payment routes (Pembayaran Pelanggan)
router.use("/payments", paymentRoutes);

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
