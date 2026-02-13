/**
 * Invoice & Payment Constants
 */

export const INVOICE_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 500,
  },
  INVOICE_NUMBER: {
    PREFIX: "INV",
    SEQUENCE_DIGITS: 3,
  },
};

export const PAYMENT_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 500,
  },
  PAYMENT_NUMBER: {
    PREFIX: "PAY",
    SEQUENCE_DIGITS: 3,
  },
};

export const AR_ACCOUNT_CODES = {
  PIUTANG_DAGANG: "112.000",
};
