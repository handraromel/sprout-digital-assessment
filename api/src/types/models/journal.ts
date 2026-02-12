/**
 * Journal Entry Model Types
 * Represents the Jurnal Umum (General Journal) entity and related operations
 */

import { Decimal } from "@prisma/client/runtime/client";
import {
  JournalStatus,
  JournalEntry as PrismaJournalEntry,
  JournalEntryLine as PrismaJournalEntryLine,
} from "../../../generated/prisma/client";

export { JournalStatus } from "../../../generated/prisma/client";

export type JournalEntry = PrismaJournalEntry;
export type JournalEntryLine = PrismaJournalEntryLine;

export interface JournalEntryLineWithAccount extends JournalEntryLine {
  account: {
    id: string;
    code: string;
    name: string;
  };
}

export interface JournalEntryWithLines extends JournalEntry {
  lines: JournalEntryLineWithAccount[];
  createdBy?: { id: string; fullname: string | null } | null;
  reversedFrom?: JournalEntry | null;
  reversedBy?: JournalEntry | null;
}

export interface CreateJournalEntryLine {
  accountId: string;
  debit: number | string | Decimal;
  credit: number | string | Decimal;
}

export interface CreateJournalEntry {
  date: Date | string;
  description: string;
  invoiceReference?: string | null;
  status?: JournalStatus;
  lines: CreateJournalEntryLine[];
  createdById?: string;
}

export interface UpdateJournalEntry {
  date?: Date | string;
  description?: string;
  invoiceReference?: string | null;
  lines?: CreateJournalEntryLine[];
}

export interface ReverseJournalEntry {
  reason: string;
}

export interface JournalEntryLineResponse {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: string;
  credit: string;
}

export interface JournalEntryResponse {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  invoiceReference: string | null;
  status: JournalStatus;
  totalDebit: string;
  totalCredit: string;
  reversalReason: string | null;
  reversedFromId: string | null;
  createdAt: Date;
  updatedAt: Date;
  lines?: JournalEntryLineResponse[];
}

export interface JournalSearchParams {
  search?: string;
  status?: JournalStatus;
  startDate?: Date | string;
  endDate?: Date | string;
  page?: number;
  limit?: number;
}
