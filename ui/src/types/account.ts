export const AccountType = {
  ASSET: "ASSET",
  LIABILITY: "LIABILITY",
  EQUITY: "EQUITY",
  REVENUE: "REVENUE",
  EXPENSE: "EXPENSE",
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  level: number;
  balance: string;
  isSystem: boolean;
  isControl: boolean;
  isActive: boolean;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AccountTreeNode extends Account {
  children: AccountTreeNode[];
}

export interface CreateAccountRequest {
  code: string;
  name: string;
  type: AccountType;
  parentId?: string | null;
  balance?: number;
  isSystem?: boolean;
  isControl?: boolean;
}

export interface UpdateAccountRequest {
  name?: string;
  parentId?: string | null;
  balance?: number;
  isActive?: boolean;
}

export interface AccountListResponse {
  message: string;
  data: Account[];
}

export interface AccountTreeResponse {
  message: string;
  data: AccountTreeNode[];
}

export interface AccountResponse {
  message: string;
  data: Account;
}

export interface AccountDeleteResponse {
  message: string;
}

export interface FlattenedAccountNode extends Account {
  hasChildren: boolean;
  isExpanded: boolean;
  isLastChild: boolean;
  parentLevels: boolean[];
}
