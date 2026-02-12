/**
 * Journal Entry Controller
 * Handles Jurnal Umum (General Journal) HTTP requests
 */

import { HTTP_STATUS, JOURNAL_CONFIG } from "@/constants";
import { JOURNAL_MESSAGES } from "@/messages";
import { JournalService } from "@/services";
import { JournalStatus, TokenPayload } from "@/types";
import { Decimal } from "@prisma/client/runtime/client";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: TokenPayload;
}

export class JournalController {
  /**
   * Create a new journal entry
   */
  static async createJournalEntry(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { date, description, invoiceReference, status, lines } = req.body;

      if (!date || !description) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: JOURNAL_MESSAGES.MISSING_REQUIRED_FIELDS,
        });
        return;
      }

      if (
        !lines ||
        !Array.isArray(lines) ||
        lines.length < JOURNAL_CONFIG.LINES.MINIMUM
      ) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: JOURNAL_MESSAGES.MINIMUM_LINES_REQUIRED,
        });
        return;
      }

      let totalDebit = new Decimal(0);
      let totalCredit = new Decimal(0);

      for (const line of lines) {
        const debit = new Decimal(line.debit || 0);
        const credit = new Decimal(line.credit || 0);

        if (debit.isNegative() || credit.isNegative()) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: JOURNAL_MESSAGES.AMOUNTS_MUST_BE_POSITIVE,
          });
          return;
        }

        if (debit.isZero() && credit.isZero()) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: JOURNAL_MESSAGES.LINE_MUST_HAVE_AMOUNT,
          });
          return;
        }

        totalDebit = totalDebit.add(debit);
        totalCredit = totalCredit.add(credit);
      }

      if (!totalDebit.equals(totalCredit)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: JOURNAL_MESSAGES.DEBIT_CREDIT_NOT_BALANCED,
        });
        return;
      }

      const accountIds = lines.map(
        (line: { accountId: string }) => line.accountId,
      );
      const accountsValid = await JournalService.validateAccounts(accountIds);
      if (!accountsValid) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: JOURNAL_MESSAGES.ACCOUNT_NOT_FOUND,
        });
        return;
      }

      if (status && !Object.values(JournalStatus).includes(status)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: JOURNAL_MESSAGES.INVALID_STATUS,
        });
        return;
      }

      const entry = await JournalService.createJournalEntry({
        date,
        description,
        invoiceReference,
        status,
        lines,
        createdById: req.user?.id,
      });

      res.status(HTTP_STATUS.CREATED).json({
        message: JOURNAL_MESSAGES.CREATE_SUCCESS,
        data: JournalService.toResponseWithLines(entry),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: JOURNAL_MESSAGES.CREATE_FAILED,
      });
    }
  }

  /**
   * Get journal entry by ID
   */
  static async getJournalEntryById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const entry = await JournalService.getJournalEntryById(id);
      if (!entry) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: JOURNAL_MESSAGES.JOURNAL_NOT_FOUND,
        });
        return;
      }

      res.json({
        message: JOURNAL_MESSAGES.RETRIEVE_SUCCESS,
        data: JournalService.toResponseWithLines(entry),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: JOURNAL_MESSAGES.RETRIEVE_FAILED,
      });
    }
  }

  /**
   * Get all journal entries with optional filtering
   */
  static async getAllJournalEntries(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { search, status, startDate, endDate, page, limit } = req.query;

      const params = {
        search: search as string | undefined,
        status: status as JournalStatus | undefined,
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const [entries, total] = await Promise.all([
        JournalService.getAllJournalEntries(params),
        JournalService.getJournalEntryCount(params),
      ]);

      res.json({
        message: JOURNAL_MESSAGES.RETRIEVE_ALL_SUCCESS,
        pagination: {
          page: params.page ?? 1,
          limit: params.limit ?? 50,
          total,
        },
        data: entries.map((entry) => JournalService.toResponse(entry)),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: JOURNAL_MESSAGES.RETRIEVE_ALL_FAILED,
      });
    }
  }

  /**
   * Update journal entry (only DRAFT status)
   */
  static async updateJournalEntry(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const { date, description, invoiceReference, lines } = req.body;

      const entry = await JournalService.getJournalEntryById(id);
      if (!entry) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: JOURNAL_MESSAGES.JOURNAL_NOT_FOUND,
        });
        return;
      }

      if (entry.status !== JournalStatus.DRAFT) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          error: JOURNAL_MESSAGES.CANNOT_EDIT_POSTED,
        });
        return;
      }

      if (lines) {
        if (
          !Array.isArray(lines) ||
          lines.length < JOURNAL_CONFIG.LINES.MINIMUM
        ) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: JOURNAL_MESSAGES.MINIMUM_LINES_REQUIRED,
          });
          return;
        }

        let totalDebit = new Decimal(0);
        let totalCredit = new Decimal(0);

        for (const line of lines) {
          const debit = new Decimal(line.debit || 0);
          const credit = new Decimal(line.credit || 0);

          if (debit.isNegative() || credit.isNegative()) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
              error: JOURNAL_MESSAGES.AMOUNTS_MUST_BE_POSITIVE,
            });
            return;
          }

          if (debit.isZero() && credit.isZero()) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
              error: JOURNAL_MESSAGES.LINE_MUST_HAVE_AMOUNT,
            });
            return;
          }

          totalDebit = totalDebit.add(debit);
          totalCredit = totalCredit.add(credit);
        }

        if (!totalDebit.equals(totalCredit)) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: JOURNAL_MESSAGES.DEBIT_CREDIT_NOT_BALANCED,
          });
          return;
        }

        const accountIds = lines.map(
          (line: { accountId: string }) => line.accountId,
        );
        const accountsValid = await JournalService.validateAccounts(accountIds);
        if (!accountsValid) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: JOURNAL_MESSAGES.ACCOUNT_NOT_FOUND,
          });
          return;
        }
      }

      const updatedEntry = await JournalService.updateJournalEntry(id, {
        date,
        description,
        invoiceReference,
        lines,
      });

      res.json({
        message: JOURNAL_MESSAGES.UPDATE_SUCCESS,
        data: JournalService.toResponseWithLines(updatedEntry),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: JOURNAL_MESSAGES.UPDATE_FAILED,
      });
    }
  }

  /**
   * Delete journal entry (only DRAFT status)
   */
  static async deleteJournalEntry(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const entry = await JournalService.getJournalEntryById(id);
      if (!entry) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: JOURNAL_MESSAGES.JOURNAL_NOT_FOUND,
        });
        return;
      }

      if (entry.status !== JournalStatus.DRAFT) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          error: JOURNAL_MESSAGES.CANNOT_DELETE_POSTED,
        });
        return;
      }

      await JournalService.deleteJournalEntry(id);

      res.json({
        message: JOURNAL_MESSAGES.DELETE_SUCCESS,
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: JOURNAL_MESSAGES.DELETE_FAILED,
      });
    }
  }

  /**
   * Post journal entry (change DRAFT to POSTED)
   */
  static async postJournalEntry(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const entry = await JournalService.getJournalEntryById(id);
      if (!entry) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: JOURNAL_MESSAGES.JOURNAL_NOT_FOUND,
        });
        return;
      }

      if (entry.status !== JournalStatus.DRAFT) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: JOURNAL_MESSAGES.CANNOT_EDIT_POSTED,
        });
        return;
      }

      const postedEntry = await JournalService.postJournalEntry(id);

      res.json({
        message: JOURNAL_MESSAGES.POST_SUCCESS,
        data: JournalService.toResponse(postedEntry),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: JOURNAL_MESSAGES.POST_FAILED,
      });
    }
  }

  /**
   * Reverse journal entry (create new entry with swapped amounts)
   */
  static async reverseJournalEntry(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const { reason } = req.body;

      if (!reason) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: JOURNAL_MESSAGES.REVERSAL_REASON_REQUIRED,
        });
        return;
      }

      const entry = await JournalService.getJournalEntryById(id);
      if (!entry) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: JOURNAL_MESSAGES.JOURNAL_NOT_FOUND,
        });
        return;
      }

      if (entry.status !== JournalStatus.POSTED) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: JOURNAL_MESSAGES.CANNOT_REVERSE_NON_POSTED,
        });
        return;
      }

      if (entry.reversedBy) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: JOURNAL_MESSAGES.ALREADY_REVERSED,
        });
        return;
      }

      const reversedEntry = await JournalService.reverseJournalEntry(
        id,
        reason,
      );

      res.json({
        message: JOURNAL_MESSAGES.REVERSE_SUCCESS,
        data: JournalService.toResponseWithLines(reversedEntry),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: JOURNAL_MESSAGES.REVERSE_FAILED,
      });
    }
  }
}
