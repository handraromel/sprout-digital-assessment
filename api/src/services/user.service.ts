/**
 * User Service
 */

import { prisma } from "@/config";
import { CreateUser, UpdateUser, User, UserResponse } from "@/types/models";
import { hashPassword } from "@/utils/password";

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(input: CreateUser): Promise<User> {
    const hashedPassword = await hashPassword(input.password);
    return prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        password: hashedPassword,
        fullname: input.fullname,
      },
    });
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Get user by username
   */
  static async getUserByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  /**
   * Get all users with pagination
   */
  static async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<User[]> {
    const skip = (page - 1) * limit;
    return prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get all active users
   */
  static async getActiveUsers(): Promise<User[]> {
    return prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Update user
   */
  static async updateUser(id: string, input: UpdateUser): Promise<User> {
    const data = { ...input };
    if (input.password) {
      data.password = await hashPassword(input.password);
    }
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Update user last login timestamp
   */
  static async updateLastLogin(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }

  /**
   * Activate user
   */
  static async activateUser(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isActive: true },
    });
  }

  /**
   * Deactivate user
   */
  static async deactivateUser(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Check if user exists
   */
  static async userExists(id: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!user;
  }

  /**
   * Check if email is unique
   */
  static async isEmailUnique(
    email: string,
    excludeId?: string,
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) return true;
    if (excludeId && user.id === excludeId) return true;
    return false;
  }

  /**
   * Convert User to UserResponse
   */
  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullname: user.fullname,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
    };
  }
}
