/**
 * Invoice Controller
 * Handles Invoice (Penagihan) HTTP requests
 */

import { HTTP_STATUS, INVOICE_CONFIG } from "@/constants";
import { INVOICE_MESSAGES } from "@/messages";
import { InvoiceService } from "@/services";
import { InvoiceStatus, TokenPayload } from "@/types";
import { Decimal } from "@prisma/client/runtime/client";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: TokenPayload;
}

export class InvoiceController {
  static async createInvoice(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { invoiceNumber, customerName, date, dueDate, totalAmount } =
        req.body;

      if (!customerName || !date || !dueDate || !totalAmount) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: INVOICE_MESSAGES.MISSING_REQUIRED_FIELDS,
        });
        return;
      }

      const amount = new Decimal(totalAmount);
      if (amount.lte(0)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: INVOICE_MESSAGES.INVALID_AMOUNT,
        });
        return;
      }

      const invoice = await InvoiceService.createInvoice({
        invoiceNumber,
        customerName,
        date,
        dueDate,
        totalAmount,
        createdById: req.user?.id,
      });

      res.status(HTTP_STATUS.CREATED).json({
        message: INVOICE_MESSAGES.CREATE_SUCCESS,
        data: InvoiceService.toResponse(invoice),
      });
    } catch (error) {
      console.error("Create invoice error:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: INVOICE_MESSAGES.CREATE_FAILED,
      });
    }
  }

  static async getInvoiceById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const invoice = await InvoiceService.getInvoiceById(id as string);

      if (!invoice) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: INVOICE_MESSAGES.INVOICE_NOT_FOUND,
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        message: INVOICE_MESSAGES.FETCH_SUCCESS,
        data: InvoiceService.toResponse(invoice),
      });
    } catch (error) {
      console.error("Get invoice error:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: INVOICE_MESSAGES.FETCH_FAILED,
      });
    }
  }

  static async getAllInvoices(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        search,
        customerName,
        status,
        startDate,
        endDate,
        page = INVOICE_CONFIG.PAGINATION.DEFAULT_PAGE,
        limit = INVOICE_CONFIG.PAGINATION.DEFAULT_LIMIT,
      } = req.query;

      const params = {
        search: search as string | undefined,
        customerName: customerName as string | undefined,
        status: status as InvoiceStatus | undefined,
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      };

      const [invoices, total] = await Promise.all([
        InvoiceService.getAllInvoices(params),
        InvoiceService.countInvoices(params),
      ]);

      res.status(HTTP_STATUS.OK).json({
        message: INVOICE_MESSAGES.FETCH_SUCCESS,
        data: invoices.map(InvoiceService.toResponse),
        meta: {
          total,
          page: params.page || INVOICE_CONFIG.PAGINATION.DEFAULT_PAGE,
          limit: params.limit || INVOICE_CONFIG.PAGINATION.DEFAULT_LIMIT,
          totalPages: Math.ceil(
            total / (params.limit || INVOICE_CONFIG.PAGINATION.DEFAULT_LIMIT),
          ),
        },
      });
    } catch (error) {
      console.error("Get all invoices error:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: INVOICE_MESSAGES.FETCH_FAILED,
      });
    }
  }

  static async getSummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      const summary = await InvoiceService.getSummary();
      res.status(HTTP_STATUS.OK).json({
        message: INVOICE_MESSAGES.FETCH_SUCCESS,
        data: summary,
      });
    } catch (error) {
      console.error("Get invoice summary error:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: INVOICE_MESSAGES.FETCH_FAILED,
      });
    }
  }

  static async getUnpaidByCustomer(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { customerName } = req.params;

      if (!customerName) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: "Customer name is required",
        });
        return;
      }

      const invoices = await InvoiceService.getUnpaidInvoicesByCustomer(
        decodeURIComponent(customerName as string),
      );

      res.status(HTTP_STATUS.OK).json({
        message: INVOICE_MESSAGES.FETCH_SUCCESS,
        data: invoices.map(InvoiceService.toResponse),
      });
    } catch (error) {
      console.error("Get unpaid invoices error:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: INVOICE_MESSAGES.FETCH_FAILED,
      });
    }
  }

  static async getCustomers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const customers = await InvoiceService.getDistinctCustomers();
      res.status(HTTP_STATUS.OK).json({
        message: INVOICE_MESSAGES.FETCH_SUCCESS,
        data: customers,
      });
    } catch (error) {
      console.error("Get customers error:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: INVOICE_MESSAGES.FETCH_FAILED,
      });
    }
  }
}
