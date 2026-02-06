/**
 * Account Messages
 */

export const ACCOUNT_MESSAGES = {
  // Create
  CREATE_SUCCESS: "Account created successfully",
  CREATE_FAILED: "Failed to create account",

  // Read
  RETRIEVE_SUCCESS: "Account retrieved successfully",
  RETRIEVE_FAILED: "Failed to retrieve account",
  RETRIEVE_ALL_SUCCESS: "Accounts retrieved successfully",
  RETRIEVE_ALL_FAILED: "Failed to retrieve accounts",
  RETRIEVE_TREE_SUCCESS: "Account tree retrieved successfully",
  RETRIEVE_TREE_FAILED: "Failed to retrieve account tree",

  // Update
  UPDATE_SUCCESS: "Account updated successfully",
  UPDATE_FAILED: "Failed to update account",

  // Delete
  DELETE_SUCCESS: "Account deleted successfully",
  DELETE_FAILED: "Failed to delete account",

  // Validation
  MISSING_REQUIRED_FIELDS: "Missing required fields: code, name, type",
  ACCOUNT_NOT_FOUND: "Account not found",
  CODE_ALREADY_EXISTS: "Account code already exists",
  PARENT_NOT_FOUND: "Parent account not found",
  CANNOT_DELETE_SYSTEM_ACCOUNT: "Cannot delete system or control account",
  CANNOT_EDIT_SYSTEM_ACCOUNT: "Cannot edit system or control account",
  CANNOT_DELETE_WITH_CHILDREN: "Cannot delete account with child accounts",
  INVALID_ACCOUNT_TYPE: "Invalid account type",
  PARENT_REQUIRED: "Parent account is required for non-root accounts",
};
