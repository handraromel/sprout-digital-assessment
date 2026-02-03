/**
 * Authentication Middleware
 */

import { TokenPayload } from "@/types";
import { extractToken, verifyToken } from "@/utils/jwt";
import { NextFunction, Request, Response } from "express";

interface AuthRequest extends Request {
  user?: TokenPayload;
}

/**
 * Verify JWT token from Authorization header
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      res.status(401).json({ error: "Missing authorization token" });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

/**
 * Optional auth middleware - doesn't fail if token is missing
 */
export const optionalAuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        req.user = payload;
      }
    }

    next();
  } catch (error) {
    next();
  }
};
