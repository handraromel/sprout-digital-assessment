import { accountRoutes } from "./protected/account";
import { journalRoutes } from "./protected/journals";
import { mainRoutes } from "./protected/main";

export const protectedRoutes = [
  ...mainRoutes,
  ...accountRoutes,
  ...journalRoutes,
];
