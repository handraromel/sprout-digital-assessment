import { lazy } from "react";

const AccountsPage = lazy(() => import("@/pages/accounts"));

export const accountRoutes = [
  {
    path: "/accounts",
    element: AccountsPage,
  },
];
