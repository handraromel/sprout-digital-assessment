/**
 * JWT Utility Functions
 */

import { JWT_CONFIG } from "@/constants";
import { RefreshTokenPayload, TokenPayload } from "@/types/auth";
import jwt, { SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";

/**
 * Generate access token
 */
export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY as StringValue,
  };
  return jwt.sign(payload, JWT_CONFIG.SECRET, options);
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  const payload = { id: userId };
  const options: SignOptions = {
    expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY as StringValue,
  };
  return jwt.sign(payload, JWT_CONFIG.REFRESH_SECRET, options);
};

/**
 * Verify access token
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (
  token: string,
): RefreshTokenPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      JWT_CONFIG.REFRESH_SECRET,
    ) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Extract token from Authorization header
 */
export const extractToken = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
};
