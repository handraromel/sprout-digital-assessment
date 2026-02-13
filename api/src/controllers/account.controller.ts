/**
 * Account Controller
 * Handles Chart of Accounts HTTP requests
 */

import { HTTP_STATUS } from "@/constants";
import { ACCOUNT_MESSAGES } from "@/messages";
import { AccountService } from "@/services";
import { AccountType, TokenPayload } from "@/types";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: TokenPayload;
}

export class AccountController {
  /**
   * Create a new account
   */
  static async createAccount(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { code, name, type, parentId, balance, isSystem, isControl } =
        req.body;

      if (!code || !name || !type) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: ACCOUNT_MESSAGES.MISSING_REQUIRED_FIELDS,
        });
        return;
      }

      // Validate account type
      if (!Object.values(AccountType).includes(type)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: ACCOUNT_MESSAGES.INVALID_ACCOUNT_TYPE,
        });
        return;
      }

      // Check code uniqueness
      const codeExists = !(await AccountService.isCodeUnique(code));
      if (codeExists) {
        res.status(HTTP_STATUS.CONFLICT).json({
          error: ACCOUNT_MESSAGES.CODE_ALREADY_EXISTS,
        });
        return;
      }

      // Validate parent if provided
      if (parentId) {
        const parent = await AccountService.getAccountById(parentId);
        if (!parent) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: ACCOUNT_MESSAGES.PARENT_NOT_FOUND,
          });
          return;
        }
      }

      const account = await AccountService.createAccount({
        code,
        name,
        type,
        parentId,
        balance,
        isSystem,
        isControl,
        createdById: req.user?.id,
      });

      res.status(HTTP_STATUS.CREATED).json({
        message: ACCOUNT_MESSAGES.CREATE_SUCCESS,
        data: AccountService.toResponse(account),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: ACCOUNT_MESSAGES.CREATE_FAILED,
      });
    }
  }

  /**
   * Get account by ID
   */
  static async getAccountById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const account = await AccountService.getAccountById(id);
      if (!account) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ACCOUNT_MESSAGES.ACCOUNT_NOT_FOUND,
        });
        return;
      }

      res.json({
        message: ACCOUNT_MESSAGES.RETRIEVE_SUCCESS,
        data: AccountService.toResponse(account),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: ACCOUNT_MESSAGES.RETRIEVE_FAILED,
      });
    }
  }

  /**
   * Get all accounts with optional filtering
   */
  static async getAllAccounts(req: Request, res: Response): Promise<void> {
    try {
      const { search, type, parentId, isActive, page, limit } = req.query;

      const params = {
        search: search as string | undefined,
        type: type as AccountType | undefined,
        parentId: parentId === "null" ? null : (parentId as string | undefined),
        isActive: isActive !== undefined ? isActive === "true" : undefined,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const [accounts, total] = await Promise.all([
        AccountService.getAllAccounts(params),
        AccountService.getAccountCount(params),
      ]);

      res.json({
        message: ACCOUNT_MESSAGES.RETRIEVE_ALL_SUCCESS,
        pagination: {
          page: params.page ?? 1,
          limit: params.limit ?? 50,
          total,
        },
        data: accounts.map((account) => AccountService.toResponse(account)),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: ACCOUNT_MESSAGES.RETRIEVE_ALL_FAILED,
      });
    }
  }

  /**
   * Get accounts as hierarchical tree
   */
  static async getAccountTree(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.query;

      const tree = await AccountService.getAccountTree(
        type as string | undefined,
      );

      res.json({
        message: ACCOUNT_MESSAGES.RETRIEVE_TREE_SUCCESS,
        data: tree,
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: ACCOUNT_MESSAGES.RETRIEVE_TREE_FAILED,
      });
    }
  }

  /**
   * Get paginated accounts tree (for infinite scroll)
   */
  static async getAccountTreePaginated(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { type, limit, cursor } = req.query;

      const result = await AccountService.getAccountTreePaginated({
        type: type as string | undefined,
        limit: limit ? parseInt(limit as string) : 5,
        cursor: cursor as string | undefined,
      });

      res.json({
        message: ACCOUNT_MESSAGES.RETRIEVE_TREE_SUCCESS,
        data: result.data,
        nextCursor: result.nextCursor,
        hasNextPage: result.hasNextPage,
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: ACCOUNT_MESSAGES.RETRIEVE_TREE_FAILED,
      });
    }
  }

  /**
   * Update account
   */
  static async updateAccount(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { name, parentId, balance, isActive } = req.body;

      const account = await AccountService.getAccountById(id);
      if (!account) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ACCOUNT_MESSAGES.ACCOUNT_NOT_FOUND,
        });
        return;
      }

      // Prevent editing system/control accounts
      if (account.isSystem || account.isControl) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          error: ACCOUNT_MESSAGES.CANNOT_EDIT_SYSTEM_ACCOUNT,
        });
        return;
      }

      // Validate parent if provided
      if (parentId !== undefined && parentId !== null) {
        const parent = await AccountService.getAccountById(parentId);
        if (!parent) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: ACCOUNT_MESSAGES.PARENT_NOT_FOUND,
          });
          return;
        }
      }

      const updatedAccount = await AccountService.updateAccount(id, {
        name,
        parentId,
        balance,
        isActive,
      });

      res.json({
        message: ACCOUNT_MESSAGES.UPDATE_SUCCESS,
        data: AccountService.toResponse(updatedAccount),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: ACCOUNT_MESSAGES.UPDATE_FAILED,
      });
    }
  }

  /**
   * Delete account
   */
  static async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const account = await AccountService.getAccountById(id);
      if (!account) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ACCOUNT_MESSAGES.ACCOUNT_NOT_FOUND,
        });
        return;
      }

      // Prevent deleting system/control accounts
      if (account.isSystem || account.isControl) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          error: ACCOUNT_MESSAGES.CANNOT_DELETE_SYSTEM_ACCOUNT,
        });
        return;
      }

      // Prevent deleting accounts with children
      const hasChildren = await AccountService.hasChildren(id);
      if (hasChildren) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: ACCOUNT_MESSAGES.CANNOT_DELETE_WITH_CHILDREN,
        });
        return;
      }

      await AccountService.deleteAccount(id);

      res.json({
        message: ACCOUNT_MESSAGES.DELETE_SUCCESS,
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: ACCOUNT_MESSAGES.DELETE_FAILED,
      });
    }
  }
}
