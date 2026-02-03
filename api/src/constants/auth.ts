/**
 * Authentication Constants
 */

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || "sprout_digital_lab_assessment_key",
  REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "sprout_digital_lab_refresh_key",
  ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "15m",
  REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "7d",
};

export const PASSWORD_CONFIG = {
  SALT_ROUNDS: 10,
};
