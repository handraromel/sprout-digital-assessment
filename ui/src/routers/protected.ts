import { lazy } from "react";

const DashboardPage = lazy(() => import("@/pages/Dashboard"));

export const protectedRoutes = [
  {
    path: "/",
    element: DashboardPage,
  },
  {
    path: "/dashboard",
    element: DashboardPage,
  },
];
