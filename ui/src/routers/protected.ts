import { lazy } from "react";

const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const AccountsPage = lazy(() => import("@/pages/accounts"));

export const protectedRoutes = [
  {
    path: "/",
    element: DashboardPage,
  },
  {
    path: "/dashboard",
    element: DashboardPage,
  },
  {
    path: "/accounts",
    element: AccountsPage,
  },
];
