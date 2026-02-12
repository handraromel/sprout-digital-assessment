/**
 * Journal Entry Service
 * Handles Jurnal Umum (General Journal) business logic
 */

import { prisma } from "@/config";
import { JOURNAL_CONFIG } from "@/constants";
import {
  CreateJournalEntry,
  JournalEntry,
  JournalEntryLineResponse,
  JournalEntryResponse,
  JournalEntryWithLines,
  JournalSearchParams,
  JournalStatus,
  UpdateJournalEntry,
} from "@/types/models";
import { Decimal } from "@prisma/client/runtime/client";

export class JournalService {
  /**
   * Generate entry number in format JU-YYYY-XXX
   */
  static async generateEntryNumber(): Promise<string> {
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

  /**
   * Create a new journal entry with lines
   */
  static async createJournalEntry(
    input: CreateJournalEntry,
  ): Promise<JournalEntryWithLines> {
    const entryNumber = await this.generateEntryNumber();

    let totalDebit = new Decimal(0);
    let totalCredit = new Decimal(0);

    for (const line of input.lines) {
      totalDebit = totalDebit.add(new Decimal(line.debit || 0));
      totalCredit = totalCredit.add(new Decimal(line.credit || 0));
    }

    return prisma.journalEntry.create({
      data: {
        entryNumber,
        date: new Date(input.date),
        description: input.description,
        invoiceReference: input.invoiceReference ?? null,
        status: input.status ?? JournalStatus.DRAFT,
        totalDebit,
        totalCredit,
        createdById: input.createdById ?? null,
        lines: {
          create: input.lines.map((line) => ({
            accountId: line.accountId,
            debit: new Decimal(line.debit || 0),
            credit: new Decimal(line.credit || 0),
          })),
        },
      },
      include: {
        lines: {
          include: {
            account: {
              select: { id: true, code: true, name: true },
            },
          },
        },
        createdBy: {
          select: { id: true, fullname: true },
        },
      },
    });
  }

  /**
   * Get journal entry by ID
   */
  static async getJournalEntryById(
    id: string,
  ): Promise<JournalEntryWithLines | null> {
    return prisma.journalEntry.findUnique({
      where: { id },
      include: {
        lines: {
          include: {
            account: {
              select: { id: true, code: true, name: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        createdBy: {
          select: { id: true, fullname: true },
        },
        reversedFrom: true,
        reversedBy: true,
      },
    });
  }

  /**
   * Get all journal entries with optional search and filtering
   */
  static async getAllJournalEntries(
    params: JournalSearchParams = {},
  ): Promise<JournalEntry[]> {
    const {
      search,
      status,
      startDate,
      endDate,
      page = JOURNAL_CONFIG.PAGINATION.DEFAULT_PAGE,
      limit = JOURNAL_CONFIG.PAGINATION.DEFAULT_LIMIT,
    } = params;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, JOURNAL_CONFIG.PAGINATION.MAX_LIMIT);

    return prisma.journalEntry.findMany({
      where: {
        ...(search && {
          OR: [
            { entryNumber: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { invoiceReference: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(status && { status }),
        ...(startDate && { date: { gte: new Date(startDate) } }),
        ...(endDate && { date: { lte: new Date(endDate) } }),
      },
      orderBy: { date: "desc" },
      skip,
      take,
    });
  }

  /**
   * Get journal entry count
   */
  static async getJournalEntryCount(
    params: JournalSearchParams = {},
  ): Promise<number> {
    const { search, status, startDate, endDate } = params;

    return prisma.journalEntry.count({
      where: {
        ...(search && {
          OR: [
            { entryNumber: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { invoiceReference: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(status && { status }),
        ...(startDate && { date: { gte: new Date(startDate) } }),
        ...(endDate && { date: { lte: new Date(endDate) } }),
      },
    });
  }

  /**
   * Update journal entry (only DRAFT status)
   */
  static async updateJournalEntry(
    id: string,
    input: UpdateJournalEntry,
  ): Promise<JournalEntryWithLines> {
    const data: Record<string, unknown> = {};

    if (input.date !== undefined) data.date = new Date(input.date);
    if (input.description !== undefined) data.description = input.description;
    if (input.invoiceReference !== undefined)
      data.invoiceReference = input.invoiceReference;

    if (input.lines) {
      let totalDebit = new Decimal(0);
      let totalCredit = new Decimal(0);

      for (const line of input.lines) {
        totalDebit = totalDebit.add(new Decimal(line.debit || 0));
        totalCredit = totalCredit.add(new Decimal(line.credit || 0));
      }

      data.totalDebit = totalDebit;
      data.totalCredit = totalCredit;

      await prisma.journalEntryLine.deleteMany({
        where: { journalEntryId: id },
      });

      await prisma.journalEntryLine.createMany({
        data: input.lines.map((line) => ({
          journalEntryId: id,
          accountId: line.accountId,
          debit: new Decimal(line.debit || 0),
          credit: new Decimal(line.credit || 0),
        })),
      });
    }

    await prisma.journalEntry.update({
      where: { id },
      data,
    });

    return this.getJournalEntryById(id) as Promise<JournalEntryWithLines>;
  }

  /**
   * Delete journal entry (only DRAFT status)
   */
  static async deleteJournalEntry(id: string): Promise<JournalEntry> {
    return prisma.journalEntry.delete({
      where: { id },
    });
  }

  /**
   * Post journal entry (change status to POSTED)
   */
  static async postJournalEntry(id: string): Promise<JournalEntry> {
    return prisma.journalEntry.update({
      where: { id },
      data: { status: JournalStatus.POSTED },
    });
  }

  /**
   * Reverse journal entry (create new entry with swapped amounts)
   */
  static async reverseJournalEntry(
    id: string,
    reason: string,
  ): Promise<JournalEntryWithLines> {
    const original = await this.getJournalEntryById(id);
    if (!original) {
      throw new Error("Journal entry not found");
    }

    const entryNumber = await this.generateEntryNumber();

    const reversed = await prisma.journalEntry.create({
      data: {
        entryNumber,
        date: new Date(),
        description: `Reversal of ${original.entryNumber}: ${original.description}`,
        invoiceReference: original.invoiceReference,
        status: JournalStatus.POSTED,
        totalDebit: original.totalCredit,
        totalCredit: original.totalDebit,
        reversedFromId: original.id,
        createdById: original.createdById,
        lines: {
          create: original.lines.map((line) => ({
            accountId: line.accountId,
            debit: line.credit,
            credit: line.debit,
          })),
        },
      },
      include: {
        lines: {
          include: {
            account: {
              select: { id: true, code: true, name: true },
            },
          },
        },
        createdBy: {
          select: { id: true, fullname: true },
        },
      },
    });

    await prisma.journalEntry.update({
      where: { id },
      data: {
        status: JournalStatus.REVERSED,
        reversalReason: reason,
      },
    });

    return reversed;
  }

  /**
   * Check if all accounts exist
   */
  static async validateAccounts(accountIds: string[]): Promise<boolean> {
    const count = await prisma.account.count({
      where: { id: { in: accountIds } },
    });
    return count === accountIds.length;
  }

  /**
   * Convert journal entry to response format
   */
  static toResponse(entry: JournalEntry): JournalEntryResponse {
    return {
      id: entry.id,
      entryNumber: entry.entryNumber,
      date: entry.date.toISOString().split("T")[0],
      description: entry.description,
      invoiceReference: entry.invoiceReference,
      status: entry.status,
      totalDebit: entry.totalDebit.toString(),
      totalCredit: entry.totalCredit.toString(),
      reversalReason: entry.reversalReason,
      reversedFromId: entry.reversedFromId,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }

  /**
   * Convert journal entry with lines to response format
   */
  static toResponseWithLines(
    entry: JournalEntryWithLines,
  ): JournalEntryResponse {
    const lines: JournalEntryLineResponse[] = entry.lines.map((line) => ({
      id: line.id,
      accountId: line.accountId,
      accountCode: line.account.code,
      accountName: line.account.name,
      debit: line.debit.toString(),
      credit: line.credit.toString(),
    }));

    return {
      ...this.toResponse(entry),
      lines,
    };
  }
}
