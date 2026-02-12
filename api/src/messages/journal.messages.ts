/**
 * Journal Entry Messages
 */

export const JOURNAL_MESSAGES = {
  // Create
  CREATE_SUCCESS: "Journal entry created successfully",
  CREATE_FAILED: "Failed to create journal entry",

  // Read
  RETRIEVE_SUCCESS: "Journal entry retrieved successfully",
  RETRIEVE_FAILED: "Failed to retrieve journal entry",
  RETRIEVE_ALL_SUCCESS: "Journal entries retrieved successfully",
  RETRIEVE_ALL_FAILED: "Failed to retrieve journal entries",

  // Update
  UPDATE_SUCCESS: "Journal entry updated successfully",
  UPDATE_FAILED: "Failed to update journal entry",

  // Delete
  DELETE_SUCCESS: "Journal entry deleted successfully",
  DELETE_FAILED: "Failed to delete journal entry",

  // Post
  POST_SUCCESS: "Journal entry posted successfully",
  POST_FAILED: "Failed to post journal entry",

  // Reverse
  REVERSE_SUCCESS: "Journal entry reversed successfully",
  REVERSE_FAILED: "Failed to reverse journal entry",

  // Validation
  MISSING_REQUIRED_FIELDS: "Missing required fields: date, description",
  JOURNAL_NOT_FOUND: "Journal entry not found",
  MINIMUM_LINES_REQUIRED: "Journal entry must have at least 2 lines",
  DEBIT_CREDIT_NOT_BALANCED: "Total debit must equal total credit",
  AMOUNTS_MUST_BE_POSITIVE: "Debit and credit amounts must be positive",
  LINE_MUST_HAVE_AMOUNT: "Each line must have either debit or credit amount",
  ACCOUNT_NOT_FOUND: "One or more accounts not found",
  CANNOT_EDIT_POSTED: "Cannot edit a posted journal entry",
  CANNOT_DELETE_POSTED: "Cannot delete a posted journal entry",
  CANNOT_REVERSE_NON_POSTED: "Only posted journal entries can be reversed",
  REVERSAL_REASON_REQUIRED: "Reversal reason is required",
  ALREADY_REVERSED: "This journal entry has already been reversed",
  INVALID_STATUS: "Invalid journal status",
};
