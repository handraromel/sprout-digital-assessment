export const JournalStatus = {
  DRAFT: "DRAFT",
  POSTED: "POSTED",
  REVERSED: "REVERSED",
} as const;

export type JournalStatus = (typeof JournalStatus)[keyof typeof JournalStatus];

export interface JournalEntryLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: string;
  credit: string;
}

export interface JournalEntry {
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
  createdAt: string;
  updatedAt: string;
  lines?: JournalEntryLine[];
  reversedFrom?: { id: string; entryNumber: string } | null;
  reversedBy?: { id: string; entryNumber: string } | null;
}

export interface CreateJournalEntryLineRequest {
  accountId: string;
  debit: number;
  credit: number;
}

export interface CreateJournalEntryRequest {
  date: string;
  description: string;
  invoiceReference?: string | null;
  status?: JournalStatus;
  lines: CreateJournalEntryLineRequest[];
}

export interface UpdateJournalEntryRequest {
  date?: string;
  description?: string;
  invoiceReference?: string | null;
  lines?: CreateJournalEntryLineRequest[];
}

export interface ReverseJournalEntryRequest {
  reason: string;
}

export interface JournalEntryListResponse {
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  data: JournalEntry[];
}

export interface JournalEntryResponse {
  message: string;
  data: JournalEntry;
}

export interface JournalEntryDeleteResponse {
  message: string;
}
