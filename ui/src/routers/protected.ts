import { accountRoutes } from "./protected/account";
import { invoiceRoutes } from "./protected/invoices";
import { journalRoutes } from "./protected/journals";
import { mainRoutes } from "./protected/main";

export const protectedRoutes = [
  ...mainRoutes,
  ...accountRoutes,
  ...invoiceRoutes,
  ...journalRoutes,
];
