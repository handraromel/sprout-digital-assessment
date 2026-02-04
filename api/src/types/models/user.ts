/**
 * User Model Types
 * Represents the User entity and related operations
 */

import { User as PrismaUser } from "../../../generated/prisma/client";

export type User = PrismaUser;

export interface CreateUser {
  email: string;
  username: string;
  password: string;
  fullname?: string;
}

export interface UpdateUser {
  email?: string;
  username?: string;
  fullname?: string;
  password?: string;
  isActive?: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  fullname: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}
