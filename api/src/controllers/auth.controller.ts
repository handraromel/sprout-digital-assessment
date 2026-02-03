/**
 * Auth Controller
 */

import { HTTP_STATUS } from "@/constants";
import { AUTH_MESSAGES } from "@/messages";
import { AuthService } from "@/services";
import { Request, Response } from "express";

export class AuthController {
  // Login user and generate JWT tokens
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: AUTH_MESSAGES.MISSING_CREDENTIALS,
        });
        return;
      }

      const result = await AuthService.login(email, password);

      if (!result) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: AUTH_MESSAGES.INVALID_CREDENTIALS,
        });
        return;
      }

      if (!result.user.isActive) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          error: AUTH_MESSAGES.USER_INACTIVE,
        });
        return;
      }

      res.json({
        message: AUTH_MESSAGES.LOGIN_SUCCESS,
        data: {
          ...result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: AUTH_MESSAGES.LOGIN_FAILED,
      });
    }
  }

  // Refresh access token using refresh token
  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: "Refresh token is required",
        });
        return;
      }

      const result = await AuthService.refreshToken(refreshToken);

      if (!result) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: "Invalid or expired refresh token",
        });
        return;
      }

      res.json({
        message: "Token refreshed successfully",
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: "Failed to refresh token",
      });
    }
  }
}
