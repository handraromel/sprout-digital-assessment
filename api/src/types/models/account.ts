/**
 * Account Model Types
 * Represents the Account entity (Chart of Accounts) and related operations
 */

import { Decimal } from "@prisma/client/runtime/client";
import {
  AccountType,
  Account as PrismaAccount,
} from "../../../generated/prisma/client";

export { AccountType } from "../../../generated/prisma/client";

export type Account = PrismaAccount;

export interface AccountWithRelations extends Account {
  parent?: Account | null;
  children?: Account[];
  createdBy?: { id: string; fullname: string | null } | null;
}

export interface CreateAccount {
  code: string;
  name: string;
  type: AccountType;
  parentId?: string | null;
  balance?: number | string | Decimal;
  isSystem?: boolean;
  isControl?: boolean;
  createdById?: string;
}

export interface UpdateAccount {
  name?: string;
  parentId?: string | null;
  balance?: number | string | Decimal;
  isActive?: boolean;
}

export interface AccountResponse {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  level: number;
  balance: string;
  isSystem: boolean;
  isControl: boolean;
  isActive: boolean;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountTreeNode extends AccountResponse {
  children: AccountTreeNode[];
}

export interface AccountSearchParams {
  search?: string;
  type?: AccountType;
  parentId?: string | null;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
