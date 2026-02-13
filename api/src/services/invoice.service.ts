/**
 * Invoice Service
 * Handles Invoice (Penagihan) business logic
 */

import { prisma } from "@/config";
import { INVOICE_CONFIG } from "@/constants";
import {
  CreateInvoice,
  Invoice,
  InvoiceResponse,
  InvoiceSearchParams,
  InvoiceStatus,
  InvoiceSummary,
  InvoiceWithRelations,
} from "@/types/models";
import { Decimal } from "@prisma/client/runtime/client";

export class InvoiceService {
  static async generateInvoiceNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const prefix = `${INVOICE_CONFIG.INVOICE_NUMBER.PREFIX}-${year}-${month}-`;

    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: { startsWith: prefix },
      },
      orderBy: { invoiceNumber: "desc" },
    });

    let sequence = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(
        lastInvoice.invoiceNumber.split("-").pop() || "0",
        10,
      );
      sequence = lastSequence + 1;
    }

    const paddedSequence = sequence
      .toString()
      .padStart(INVOICE_CONFIG.INVOICE_NUMBER.SEQUENCE_DIGITS, "0");
    return `${prefix}${paddedSequence}`;
  }

  static async createInvoice(input: CreateInvoice): Promise<Invoice> {
    const invoiceNumber =
      input.invoiceNumber || (await this.generateInvoiceNumber());
    const totalAmount = new Decimal(input.totalAmount.toString());

    return prisma.invoice.create({
      data: {
        invoiceNumber,
        customerName: input.customerName,
        date: new Date(input.date),
        dueDate: new Date(input.dueDate),
        totalAmount,
        remainingBalance: totalAmount,
        status: InvoiceStatus.UNPAID,
        createdById: input.createdById ?? null,
      },
    });
  }

  static async getInvoiceById(
    id: string,
  ): Promise<InvoiceWithRelations | null> {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, fullname: true },
        },
        paymentAllocations: {
          include: {
            payment: {
              select: { id: true, paymentNumber: true, paymentDate: true },
            },
          },
        },
      },
    });
  }

  static async getAllInvoices(
    params: InvoiceSearchParams = {},
  ): Promise<Invoice[]> {
    const {
      search,
      customerName,
      status,
      startDate,
      endDate,
      page = INVOICE_CONFIG.PAGINATION.DEFAULT_PAGE,
      limit = INVOICE_CONFIG.PAGINATION.DEFAULT_LIMIT,
    } = params;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, INVOICE_CONFIG.PAGINATION.MAX_LIMIT);

    return prisma.invoice.findMany({
      where: {
        ...(search && {
          OR: [
            { invoiceNumber: { contains: search, mode: "insensitive" } },
            { customerName: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(customerName && {
          customerName: { contains: customerName, mode: "insensitive" },
        }),
        ...(status && { status }),
        ...(startDate && { date: { gte: new Date(startDate) } }),
        ...(endDate && { date: { lte: new Date(endDate) } }),
      },
      orderBy: [{ dueDate: "asc" }, { invoiceNumber: "desc" }],
      skip,
      take,
    });
  }

  static async countInvoices(
    params: InvoiceSearchParams = {},
  ): Promise<number> {
    const { search, customerName, status, startDate, endDate } = params;

    return prisma.invoice.count({
      where: {
        ...(search && {
          OR: [
            { invoiceNumber: { contains: search, mode: "insensitive" } },
            { customerName: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(customerName && {
          customerName: { contains: customerName, mode: "insensitive" },
        }),
        ...(status && { status }),
        ...(startDate && { date: { gte: new Date(startDate) } }),
        ...(endDate && { date: { lte: new Date(endDate) } }),
      },
    });
  }

  static async getUnpaidInvoicesByCustomer(
    customerName: string,
  ): Promise<Invoice[]> {
    return prisma.invoice.findMany({
      where: {
        customerName: { equals: customerName, mode: "insensitive" },
        status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.PARTIALLY_PAID] },
        remainingBalance: { gt: 0 },
      },
      orderBy: { dueDate: "asc" },
    });
  }

  static async getDistinctCustomers(): Promise<string[]> {
    const customers = await prisma.invoice.findMany({
      where: {
        status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.PARTIALLY_PAID] },
      },
      select: { customerName: true },
      distinct: ["customerName"],
      orderBy: { customerName: "asc" },
    });
    return customers.map((c) => c.customerName);
  }

  static async getSummary(): Promise<InvoiceSummary> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalPiutangResult, totalJatuhTempoResult] = await Promise.all([
      prisma.invoice.aggregate({
        where: {
          status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.PARTIALLY_PAID] },
        },
        _sum: { remainingBalance: true },
      }),
      prisma.invoice.aggregate({
        where: {
          status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.PARTIALLY_PAID] },
          dueDate: { lt: today },
        },
        _sum: { remainingBalance: true },
      }),
    ]);

    return {
      totalPiutang: (
        totalPiutangResult._sum.remainingBalance || new Decimal(0)
      ).toString(),
      totalJatuhTempo: (
        totalJatuhTempoResult._sum.remainingBalance || new Decimal(0)
      ).toString(),
    };
  }

  static calculateDaysOverdue(dueDate: Date): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  static toResponse(invoice: Invoice): InvoiceResponse {
    const daysOverdue = InvoiceService.calculateDaysOverdue(invoice.dueDate);
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      date: invoice.date.toISOString().split("T")[0],
      dueDate: invoice.dueDate.toISOString().split("T")[0],
      totalAmount: invoice.totalAmount.toString(),
      remainingBalance: invoice.remainingBalance.toString(),
      status: invoice.status,
      daysOverdue,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    };
  }
}
