/**
 * User Controller
 */

import { HTTP_STATUS } from "@/constants";
import { USER_MESSAGES } from "@/messages";
import { UserService } from "@/services";
import { Request, Response } from "express";

export class UserController {
  /**
   * Create a new user
   */
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, username, password, fullname } = req.body;

      if (!email || !username || !password) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: USER_MESSAGES.MISSING_REQUIRED_FIELDS,
        });
        return;
      }

      const emailExists = !(await UserService.isEmailUnique(email));
      if (emailExists) {
        res.status(HTTP_STATUS.CONFLICT).json({
          error: USER_MESSAGES.EMAIL_ALREADY_IN_USE,
        });
        return;
      }

      const user = await UserService.createUser({
        email,
        username,
        password,
        fullname,
      });

      res.status(HTTP_STATUS.CREATED).json({
        message: USER_MESSAGES.CREATE_SUCCESS,
        data: UserService.toResponse(user),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: USER_MESSAGES.CREATE_FAILED,
      });
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const user = await UserService.getUserById(id);
      if (!user) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: USER_MESSAGES.USER_NOT_FOUND,
        });
        return;
      }

      res.json({
        message: USER_MESSAGES.RETRIEVE_SUCCESS,
        data: UserService.toResponse(user),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: USER_MESSAGES.RETRIEVE_FAILED,
      });
    }
  }

  /**
   * Get all users with pagination
   */
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const users = await UserService.getAllUsers(page, limit);

      res.json({
        message: USER_MESSAGES.RETRIEVE_ALL_SUCCESS,
        pagination: { page, limit },
        data: users.map((user) => UserService.toResponse(user)),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: USER_MESSAGES.RETRIEVE_ALL_FAILED,
      });
    }
  }

  /**
   * Update user
   */
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { email, username, fullname, password } = req.body;

      const userExists = await UserService.userExists(id);
      if (!userExists) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: USER_MESSAGES.USER_NOT_FOUND,
        });
        return;
      }

      const user = await UserService.updateUser(id, {
        email,
        username,
        fullname,
        password,
      });

      res.json({
        message: USER_MESSAGES.UPDATE_SUCCESS,
        data: UserService.toResponse(user),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: USER_MESSAGES.UPDATE_FAILED,
      });
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      await UserService.deleteUser(id);

      res.json({
        message: USER_MESSAGES.DELETE_SUCCESS,
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: USER_MESSAGES.DELETE_FAILED,
      });
    }
  }

  /**
   * Activate user
   */
  static async activateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const user = await UserService.activateUser(id);

      res.json({
        message: USER_MESSAGES.ACTIVATE_SUCCESS,
        data: UserService.toResponse(user),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: USER_MESSAGES.ACTIVATE_FAILED,
      });
    }
  }

  /**
   * Deactivate user
   */
  static async deactivateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const user = await UserService.deactivateUser(id);

      res.json({
        message: USER_MESSAGES.DEACTIVATE_SUCCESS,
        data: UserService.toResponse(user),
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: USER_MESSAGES.DEACTIVATE_FAILED,
      });
    }
  }
}
