/**
 * Journal Entry Routes
 * Jurnal Umum (General Journal) API endpoints
 */

import { JournalController } from "@/controllers";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

// GET /api/v1/journals - Get all journal entries with filtering (protected)
router.get("/", authMiddleware, JournalController.getAllJournalEntries);

// GET /api/v1/journals/:id - Get journal entry by ID (protected)
router.get("/:id", authMiddleware, JournalController.getJournalEntryById);

// POST /api/v1/journals - Create a new journal entry (protected)
router.post("/", authMiddleware, JournalController.createJournalEntry);

// PUT /api/v1/journals/:id - Update journal entry (protected)
router.put("/:id", authMiddleware, JournalController.updateJournalEntry);

// DELETE /api/v1/journals/:id - Delete journal entry (protected)
router.delete("/:id", authMiddleware, JournalController.deleteJournalEntry);

// PATCH /api/v1/journals/:id/post - Post journal entry (protected)
router.patch("/:id/post", authMiddleware, JournalController.postJournalEntry);

// PATCH /api/v1/journals/:id/reverse - Reverse journal entry (protected)
router.patch(
  "/:id/reverse",
  authMiddleware,
  JournalController.reverseJournalEntry,
);

export default router;
