/**
 * API endpoint constants
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    LOGOUT: "/api/v1/auth/logout",
    REFRESH: "/api/v1/auth/refresh",
  },
  USER: {
    PROFILE: "/api/v1/users/profile",
    UPDATE: "/api/v1/users/update",
  },
} as const;
