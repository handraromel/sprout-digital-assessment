/**
 * Account Service
 * Handles Chart of Accounts business logic
 */

import { prisma } from "@/config";
import { ACCOUNT_CONFIG } from "@/constants";
import {
  Account,
  AccountResponse,
  AccountSearchParams,
  AccountTreeNode,
  AccountWithRelations,
  CreateAccount,
  UpdateAccount,
} from "@/types/models";

export class AccountService {
  /**
   * Create a new account
   */
  static async createAccount(input: CreateAccount): Promise<Account> {
    let level = 0;

    // Calculate level based on parent
    if (input.parentId) {
      const parent = await prisma.account.findUnique({
        where: { id: input.parentId },
      });
      if (parent) {
        level = parent.level + 1;
      }
    }

    return prisma.account.create({
      data: {
        code: input.code,
        name: input.name,
        type: input.type,
        level,
        balance: input.balance ?? 0,
        isSystem: input.isSystem ?? false,
        isControl: input.isControl ?? false,
        parentId: input.parentId ?? null,
        createdById: input.createdById ?? null,
      },
    });
  }

  /**
   * Get account by ID
   */
  static async getAccountById(
    id: string,
  ): Promise<AccountWithRelations | null> {
    return prisma.account.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { code: "asc" },
        },
        createdBy: {
          select: { id: true, fullname: true },
        },
      },
    });
  }

  /**
   * Get account by code
   */
  static async getAccountByCode(code: string): Promise<Account | null> {
    return prisma.account.findUnique({
      where: { code },
    });
  }

  /**
   * Check if code is unique
   */
  static async isCodeUnique(
    code: string,
    excludeId?: string,
  ): Promise<boolean> {
    const account = await prisma.account.findUnique({
      where: { code },
    });
    if (!account) return true;
    return excludeId ? account.id === excludeId : false;
  }

  /**
   * Get all accounts with optional search and filtering
   */
  static async getAllAccounts(
    params: AccountSearchParams = {},
  ): Promise<Account[]> {
    const {
      search,
      type,
      parentId,
      isActive,
      page = ACCOUNT_CONFIG.PAGINATION.DEFAULT_PAGE,
      limit = ACCOUNT_CONFIG.PAGINATION.DEFAULT_LIMIT,
    } = params;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, ACCOUNT_CONFIG.PAGINATION.MAX_LIMIT);

    return prisma.account.findMany({
      where: {
        ...(search && {
          OR: [
            { code: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(type && { type }),
        ...(parentId !== undefined && { parentId }),
        ...(isActive !== undefined && { isActive }),
      },
      orderBy: { code: "asc" },
      skip,
      take,
    });
  }

  /**
   * Get accounts as hierarchical tree structure
   */
  static async getAccountTree(type?: string): Promise<AccountTreeNode[]> {
    const accounts = await prisma.account.findMany({
      where: {
        ...(type && { type: type as Account["type"] }),
        isActive: true,
      },
      orderBy: { code: "asc" },
    });

    return this.buildTree(accounts);
  }

  /**
   * Build tree structure from flat accounts list
   */
  private static buildTree(accounts: Account[]): AccountTreeNode[] {
    const accountMap = new Map<string, AccountTreeNode>();
    const roots: AccountTreeNode[] = [];

    // First pass: create tree nodes
    for (const account of accounts) {
      accountMap.set(account.id, {
        ...this.toResponse(account),
        children: [],
      });
    }

    // Second pass: build hierarchy
    for (const account of accounts) {
      const node = accountMap.get(account.id)!;
      if (account.parentId && accountMap.has(account.parentId)) {
        accountMap.get(account.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  /**
   * Update account
   */
  static async updateAccount(
    id: string,
    input: UpdateAccount,
  ): Promise<Account> {
    const data: Record<string, unknown> = {};

    if (input.name !== undefined) data.name = input.name;
    if (input.balance !== undefined) data.balance = input.balance;
    if (input.isActive !== undefined) data.isActive = input.isActive;

    // Handle parent change with level recalculation
    if (input.parentId !== undefined) {
      data.parentId = input.parentId;
      if (input.parentId) {
        const parent = await prisma.account.findUnique({
          where: { id: input.parentId },
        });
        if (parent) {
          data.level = parent.level + 1;
        }
      } else {
        data.level = 0;
      }
    }

    return prisma.account.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete account
   */
  static async deleteAccount(id: string): Promise<Account> {
    return prisma.account.delete({
      where: { id },
    });
  }

  /**
   * Check if account has children
   */
  static async hasChildren(id: string): Promise<boolean> {
    const count = await prisma.account.count({
      where: { parentId: id },
    });
    return count > 0;
  }

  /**
   * Get account count
   */
  static async getAccountCount(
    params: AccountSearchParams = {},
  ): Promise<number> {
    const { search, type, parentId, isActive } = params;

    return prisma.account.count({
      where: {
        ...(search && {
          OR: [
            { code: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(type && { type }),
        ...(parentId !== undefined && { parentId }),
        ...(isActive !== undefined && { isActive }),
      },
    });
  }

  /**
   * Convert account to response format
   */
  static toResponse(account: Account): AccountResponse {
    return {
      id: account.id,
      code: account.code,
      name: account.name,
      type: account.type,
      level: account.level,
      balance: account.balance.toString(),
      isSystem: account.isSystem,
      isControl: account.isControl,
      isActive: account.isActive,
      parentId: account.parentId,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}
