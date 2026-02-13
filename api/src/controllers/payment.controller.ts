/**
 * Payment Controller
 * Handles Payment (Pembayaran Pelanggan) HTTP requests
 */

import { HTTP_STATUS, PAYMENT_CONFIG } from "@/constants";
import { PAYMENT_MESSAGES } from "@/messages";
import { PaymentService } from "@/services";
import { TokenPayload } from "@/types";
import { Decimal } from "@prisma/client/runtime/client";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: TokenPayload;
}

export class PaymentController {
  static async createPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        paymentDate,
        customerName,
        depositAccountId,
        discountAccountId,
        discountPercent,
        allocations,
      } = req.body;

      if (!paymentDate || !customerName || !depositAccountId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: PAYMENT_MESSAGES.MISSING_REQUIRED_FIELDS,
        });
        return;
      }

      if (
        !allocations ||
        !Array.isArray(allocations) ||
        allocations.length === 0
      ) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: PAYMENT_MESSAGES.NO_ALLOCATIONS,
        });
        return;
      }

      for (const allocation of allocations) {
        if (!allocation.invoiceId || !allocation.allocatedAmount) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: PAYMENT_MESSAGES.MISSING_REQUIRED_FIELDS,
          });
          return;
        }

        const amount = new Decimal(allocation.allocatedAmount);
        if (amount.lte(0)) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: PAYMENT_MESSAGES.INVALID_AMOUNT,
          });
          return;
        }
      }

      const payment = await PaymentService.createPayment({
        paymentDate,
        customerName,
        depositAccountId,
        discountAccountId: discountAccountId || null,
        discountPercent: discountPercent || null,
        allocations,
        createdById: req.user?.id,
      });

      res.status(HTTP_STATUS.CREATED).json({
        message: PAYMENT_MESSAGES.CREATE_SUCCESS,
        data: PaymentService.toResponse(payment),
      });
    } catch (error) {
      console.error("Create payment error:", error);

      if (error instanceof Error) {
        if (error.message.includes("Piutang Dagang account not found")) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: PAYMENT_MESSAGES.PIUTANG_ACCOUNT_NOT_FOUND,
          });
          return;
        }
        if (error.message.includes("invoices not found")) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: PAYMENT_MESSAGES.INVOICE_NOT_FOUND,
          });
          return;
        }
        if (error.message.includes("exceeds remaining balance")) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: PAYMENT_MESSAGES.ALLOCATION_EXCEEDS_BALANCE,
          });
          return;
        }
      }

      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: PAYMENT_MESSAGES.CREATE_FAILED,
      });
    }
  }

  static async getPaymentById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payment = await PaymentService.getPaymentById(id as string);

      if (!payment) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: PAYMENT_MESSAGES.PAYMENT_NOT_FOUND,
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        message: PAYMENT_MESSAGES.FETCH_SUCCESS,
        data: PaymentService.toResponse(payment),
      });
    } catch (error) {
      console.error("Get payment error:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: PAYMENT_MESSAGES.FETCH_FAILED,
      });
    }
  }

  static async getAllPayments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        search,
        customerName,
        startDate,
        endDate,
        page = PAYMENT_CONFIG.PAGINATION.DEFAULT_PAGE,
        limit = PAYMENT_CONFIG.PAGINATION.DEFAULT_LIMIT,
      } = req.query;

      const params = {
        search: search as string | undefined,
        customerName: customerName as string | undefined,
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      };

      const [payments, total] = await Promise.all([
        PaymentService.getAllPayments(params),
        PaymentService.countPayments(params),
      ]);

      res.status(HTTP_STATUS.OK).json({
        message: PAYMENT_MESSAGES.FETCH_SUCCESS,
        data: payments.map(PaymentService.toResponse),
        meta: {
          total,
          page: params.page || PAYMENT_CONFIG.PAGINATION.DEFAULT_PAGE,
          limit: params.limit || PAYMENT_CONFIG.PAGINATION.DEFAULT_LIMIT,
          totalPages: Math.ceil(
            total / (params.limit || PAYMENT_CONFIG.PAGINATION.DEFAULT_LIMIT),
          ),
        },
      });
    } catch (error) {
      console.error("Get all payments error:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: PAYMENT_MESSAGES.FETCH_FAILED,
      });
    }
  }
}
