/**
 * Payment Service
 * Handles Payment (Pembayaran Pelanggan) business logic
 */

import { prisma } from "@/config";
import { AR_ACCOUNT_CODES, PAYMENT_CONFIG } from "@/constants";
import { JOURNAL_CONFIG } from "@/constants/journal";
import {
  CreatePayment,
  InvoiceStatus,
  PaymentAllocationResponse,
  PaymentResponse,
  PaymentSearchParams,
  PaymentWithRelations,
} from "@/types/models";
import { JournalStatus } from "@/types/models/journal";
import { Decimal } from "@prisma/client/runtime/client";

export class PaymentService {
  static async generatePaymentNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const prefix = `${PAYMENT_CONFIG.PAYMENT_NUMBER.PREFIX}-${year}-${month}-`;

    const lastPayment = await prisma.payment.findFirst({
      where: {
        paymentNumber: { startsWith: prefix },
      },
      orderBy: { paymentNumber: "desc" },
    });

    let sequence = 1;
    if (lastPayment) {
      const lastSequence = parseInt(
        lastPayment.paymentNumber.split("-").pop() || "0",
        10,
      );
      sequence = lastSequence + 1;
    }

    const paddedSequence = sequence
      .toString()
      .padStart(PAYMENT_CONFIG.PAYMENT_NUMBER.SEQUENCE_DIGITS, "0");
    return `${prefix}${paddedSequence}`;
  }

  private static async generateJournalEntryNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `${JOURNAL_CONFIG.ENTRY_NUMBER.PREFIX}-${year}-`;

    const lastEntry = await prisma.journalEntry.findFirst({
      where: {
        entryNumber: { startsWith: prefix },
      },
      orderBy: { entryNumber: "desc" },
    });

    let sequence = 1;
    if (lastEntry) {
      const lastSequence = parseInt(
        lastEntry.entryNumber.split("-").pop() || "0",
        10,
      );
      sequence = lastSequence + 1;
    }

    const paddedSequence = sequence
      .toString()
      .padStart(JOURNAL_CONFIG.ENTRY_NUMBER.SEQUENCE_DIGITS, "0");
    return `${prefix}${paddedSequence}`;
  }

  static async createPayment(
    input: CreatePayment,
  ): Promise<PaymentWithRelations> {
    const paymentNumber = await this.generatePaymentNumber();
    const piutangAccount = await prisma.account.findFirst({
      where: { code: AR_ACCOUNT_CODES.PIUTANG_DAGANG },
    });

    if (!piutangAccount) {
      throw new Error("Piutang Dagang account not found");
    }

    const invoiceIds = input.allocations.map((a) => a.invoiceId);
    const invoices = await prisma.invoice.findMany({
      where: { id: { in: invoiceIds } },
    });

    if (invoices.length !== invoiceIds.length) {
      throw new Error("One or more invoices not found");
    }

    let totalAllocated = new Decimal(0);
    for (const allocation of input.allocations) {
      const invoice = invoices.find((i) => i.id === allocation.invoiceId);
      const amount = new Decimal(allocation.allocatedAmount.toString());
      if (invoice && amount.gt(invoice.remainingBalance)) {
        throw new Error(
          `Allocation exceeds remaining balance for invoice ${invoice.invoiceNumber}`,
        );
      }
      totalAllocated = totalAllocated.add(amount);
    }

    const discountPercent = input.discountPercent
      ? new Decimal(input.discountPercent.toString())
      : null;

    let discountAmount = new Decimal(0);
    if (discountPercent && discountPercent.gt(0)) {
      discountAmount = totalAllocated.mul(discountPercent).div(100);
    }

    const totalPaymentAmount = totalAllocated.sub(discountAmount);

    return prisma.$transaction(async (tx) => {
      const journalEntryNumber = await this.generateJournalEntryNumber();
      const journalLines = [];

      journalLines.push({
        accountId: input.depositAccountId,
        debit: totalPaymentAmount,
        credit: new Decimal(0),
      });

      if (discountAmount.gt(0) && input.discountAccountId) {
        journalLines.push({
          accountId: input.discountAccountId,
          debit: discountAmount,
          credit: new Decimal(0),
        });
      }

      journalLines.push({
        accountId: piutangAccount.id,
        debit: new Decimal(0),
        credit: totalAllocated,
      });

      const journalEntry = await tx.journalEntry.create({
        data: {
          entryNumber: journalEntryNumber,
          date: new Date(input.paymentDate),
          description: `Penerimaan pembayaran dari ${input.customerName}`,
          status: JournalStatus.POSTED,
          totalDebit: totalAllocated,
          totalCredit: totalAllocated,
          createdById: input.createdById ?? null,
          lines: {
            create: journalLines,
          },
        },
      });

      const payment = await tx.payment.create({
        data: {
          paymentNumber,
          paymentDate: new Date(input.paymentDate),
          customerName: input.customerName,
          depositAccountId: input.depositAccountId,
          discountAccountId: input.discountAccountId ?? null,
          totalAmount: totalPaymentAmount,
          discountPercent,
          discountAmount: discountAmount.gt(0) ? discountAmount : null,
          journalEntryId: journalEntry.id,
          createdById: input.createdById ?? null,
          allocations: {
            create: input.allocations.map((a) => ({
              invoiceId: a.invoiceId,
              allocatedAmount: new Decimal(a.allocatedAmount.toString()),
            })),
          },
        },
        include: {
          depositAccount: {
            select: { id: true, code: true, name: true },
          },
          discountAccount: {
            select: { id: true, code: true, name: true },
          },
          journalEntry: {
            select: { id: true, entryNumber: true },
          },
          createdBy: {
            select: { id: true, fullname: true },
          },
          allocations: {
            include: {
              invoice: {
                select: {
                  id: true,
                  invoiceNumber: true,
                  dueDate: true,
                  totalAmount: true,
                  remainingBalance: true,
                },
              },
            },
          },
        },
      });

      for (const allocation of input.allocations) {
        const invoice = invoices.find((i) => i.id === allocation.invoiceId)!;
        const allocatedAmount = new Decimal(
          allocation.allocatedAmount.toString(),
        );
        const newRemainingBalance =
          invoice.remainingBalance.sub(allocatedAmount);

        let newStatus: InvoiceStatus;
        if (newRemainingBalance.lte(0)) {
          newStatus = InvoiceStatus.PAID;
        } else if (newRemainingBalance.lt(invoice.totalAmount)) {
          newStatus = InvoiceStatus.PARTIALLY_PAID;
        } else {
          newStatus = InvoiceStatus.UNPAID;
        }

        await tx.invoice.update({
          where: { id: allocation.invoiceId },
          data: {
            remainingBalance: newRemainingBalance.lt(0)
              ? new Decimal(0)
              : newRemainingBalance,
            status: newStatus,
          },
        });
      }

      return payment;
    });
  }

  static async getPaymentById(
    id: string,
  ): Promise<PaymentWithRelations | null> {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        depositAccount: {
          select: { id: true, code: true, name: true },
        },
        discountAccount: {
          select: { id: true, code: true, name: true },
        },
        journalEntry: {
          select: { id: true, entryNumber: true },
        },
        createdBy: {
          select: { id: true, fullname: true },
        },
        allocations: {
          include: {
            invoice: {
              select: {
                id: true,
                invoiceNumber: true,
                dueDate: true,
                totalAmount: true,
                remainingBalance: true,
              },
            },
          },
        },
      },
    });
  }

  static async getAllPayments(
    params: PaymentSearchParams = {},
  ): Promise<PaymentWithRelations[]> {
    const {
      search,
      customerName,
      startDate,
      endDate,
      page = PAYMENT_CONFIG.PAGINATION.DEFAULT_PAGE,
      limit = PAYMENT_CONFIG.PAGINATION.DEFAULT_LIMIT,
    } = params;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, PAYMENT_CONFIG.PAGINATION.MAX_LIMIT);

    return prisma.payment.findMany({
      where: {
        ...(search && {
          OR: [
            { paymentNumber: { contains: search, mode: "insensitive" } },
            { customerName: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(customerName && {
          customerName: { contains: customerName, mode: "insensitive" },
        }),
        ...(startDate && { paymentDate: { gte: new Date(startDate) } }),
        ...(endDate && { paymentDate: { lte: new Date(endDate) } }),
      },
      include: {
        depositAccount: {
          select: { id: true, code: true, name: true },
        },
        discountAccount: {
          select: { id: true, code: true, name: true },
        },
        journalEntry: {
          select: { id: true, entryNumber: true },
        },
        createdBy: {
          select: { id: true, fullname: true },
        },
        allocations: {
          include: {
            invoice: {
              select: {
                id: true,
                invoiceNumber: true,
                dueDate: true,
                totalAmount: true,
                remainingBalance: true,
              },
            },
          },
        },
      },
      orderBy: { paymentDate: "desc" },
      skip,
      take,
    });
  }

  static async countPayments(
    params: PaymentSearchParams = {},
  ): Promise<number> {
    const { search, customerName, startDate, endDate } = params;

    return prisma.payment.count({
      where: {
        ...(search && {
          OR: [
            { paymentNumber: { contains: search, mode: "insensitive" } },
            { customerName: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(customerName && {
          customerName: { contains: customerName, mode: "insensitive" },
        }),
        ...(startDate && { paymentDate: { gte: new Date(startDate) } }),
        ...(endDate && { paymentDate: { lte: new Date(endDate) } }),
      },
    });
  }

  static toAllocationResponse(
    allocation: PaymentWithRelations["allocations"][0],
  ): PaymentAllocationResponse {
    return {
      id: allocation.id,
      invoiceId: allocation.invoice.id,
      invoiceNumber: allocation.invoice.invoiceNumber,
      invoiceDueDate: allocation.invoice.dueDate.toISOString().split("T")[0],
      allocatedAmount: allocation.allocatedAmount.toString(),
    };
  }

  static toResponse(payment: PaymentWithRelations): PaymentResponse {
    return {
      id: payment.id,
      paymentNumber: payment.paymentNumber,
      paymentDate: payment.paymentDate.toISOString().split("T")[0],
      customerName: payment.customerName,
      depositAccountId: payment.depositAccount.id,
      depositAccountCode: payment.depositAccount.code,
      depositAccountName: payment.depositAccount.name,
      discountAccountId: payment.discountAccount?.id ?? null,
      discountAccountCode: payment.discountAccount?.code ?? null,
      discountAccountName: payment.discountAccount?.name ?? null,
      totalAmount: payment.totalAmount.toString(),
      discountPercent: payment.discountPercent?.toString() ?? null,
      discountAmount: payment.discountAmount?.toString() ?? null,
      journalEntryId: payment.journalEntry?.id ?? null,
      journalEntryNumber: payment.journalEntry?.entryNumber ?? null,
      allocations: payment.allocations.map((a) => this.toAllocationResponse(a)),
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
