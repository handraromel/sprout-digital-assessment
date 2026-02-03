/**
 * Auth Service
 */

import { UserResponse } from "@/types/models";
import {
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
} from "@/utils/jwt";
import { verifyPassword } from "@/utils/password";
import { UserService } from "./user.service";

interface LoginResult {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  static async login(
    email: string,
    password: string,
  ): Promise<LoginResult | null> {
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login timestamp
    await UserService.updateLastLogin(user.id);

    // Generate JWT tokens
    const accessToken = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    const refreshToken = generateRefreshToken(user.id);

    return {
      user: UserService.toResponse(user),
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return null;
    }

    const user = await UserService.getUserById(payload.id);
    if (!user || !user.isActive) {
      return null;
    }

    // Generate new tokens
    const newAccessToken = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    const newRefreshToken = generateRefreshToken(user.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
