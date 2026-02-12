import { lazy } from "react";

const DashboardPage = lazy(() => import("@/pages/Dashboard"));

export const mainRoutes = [
  {
    path: "/",
    element: DashboardPage,
  },
  {
    path: "/dashboard",
    element: DashboardPage,
  },
];
