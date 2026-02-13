/**
 * Invoice & Payment Messages
 */

export const INVOICE_MESSAGES = {
  CREATE_SUCCESS: "Invoice created successfully",
  CREATE_FAILED: "Failed to create invoice",
  UPDATE_SUCCESS: "Invoice updated successfully",
  UPDATE_FAILED: "Failed to update invoice",
  DELETE_SUCCESS: "Invoice deleted successfully",
  DELETE_FAILED: "Failed to delete invoice",
  FETCH_SUCCESS: "Invoice(s) retrieved successfully",
  FETCH_FAILED: "Failed to retrieve invoice(s)",
  INVOICE_NOT_FOUND: "Invoice not found",
  MISSING_REQUIRED_FIELDS:
    "Missing required fields: customerName, date, dueDate, totalAmount",
  INVALID_AMOUNT: "Total amount must be greater than 0",
  INVOICE_NUMBER_EXISTS: "Invoice number already exists",
  CANNOT_DELETE_PAID: "Cannot delete invoice with payments",
};

export const PAYMENT_MESSAGES = {
  CREATE_SUCCESS: "Payment recorded successfully",
  CREATE_FAILED: "Failed to record payment",
  FETCH_SUCCESS: "Payment(s) retrieved successfully",
  FETCH_FAILED: "Failed to retrieve payment(s)",
  PAYMENT_NOT_FOUND: "Payment not found",
  MISSING_REQUIRED_FIELDS:
    "Missing required fields: paymentDate, customerName, depositAccountId, allocations",
  INVALID_AMOUNT: "Payment amount must be greater than 0",
  NO_ALLOCATIONS: "At least one allocation is required",
  ALLOCATION_EXCEEDS_BALANCE:
    "Allocation amount exceeds invoice remaining balance",
  DEPOSIT_ACCOUNT_NOT_FOUND: "Deposit account not found",
  DISCOUNT_ACCOUNT_NOT_FOUND: "Discount account not found",
  INVOICE_NOT_FOUND: "One or more invoices not found",
  PIUTANG_ACCOUNT_NOT_FOUND: "Piutang Dagang account (112.001) not found",
};
