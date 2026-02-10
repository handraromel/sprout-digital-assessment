import { ACCOUNT_ENDPOINTS } from "./account";
import { AUTH_ENDPOINTS } from "./auth";
import { USER_ENDPOINTS } from "./user";

export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  ACCOUNTS: ACCOUNT_ENDPOINTS,
} as const;
