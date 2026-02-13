import { lazy } from "react";

const InvoicesPage = lazy(() => import("@/pages/invoices"));

export const invoiceRoutes = [
  {
    path: "/penagihan",
    element: InvoicesPage,
  },
];
