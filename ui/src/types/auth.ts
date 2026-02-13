export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  fullname: string;
  password: string;
}

export type UserRole = "ADMIN" | "USER" | "GUEST";

export interface User {
  id: string;
  email: string;
  username: string;
  fullname: string;
  role: UserRole;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginSuccessResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  } & User;
}

export interface RefreshTokenResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthError {
  error: string;
}
