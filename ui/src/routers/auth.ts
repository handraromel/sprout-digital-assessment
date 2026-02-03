import { lazy } from "react";

const LoginPage = lazy(() => import("@/pages/auth/login"));

export const authRoutes = [
  {
    path: "/login",
    element: LoginPage,
  },
];
