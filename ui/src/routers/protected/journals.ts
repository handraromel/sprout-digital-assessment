import { lazy } from "react";

const JournalsPage = lazy(() => import("@/pages/journals"));
const CreateJournalPage = lazy(
  () => import("@/pages/journals/components/forms/CreateJournalPage"),
);
const EditJournalPage = lazy(
  () => import("@/pages/journals/components/forms/EditJournalPage"),
);
const JournalDetailPage = lazy(
  () => import("@/pages/journals/components/details"),
);

export const journalRoutes = [
  {
    path: "/journals",
    element: JournalsPage,
  },
  {
    path: "/journals/new",
    element: CreateJournalPage,
  },
  {
    path: "/journals/:id",
    element: JournalDetailPage,
  },
  {
    path: "/journals/:id/edit",
    element: EditJournalPage,
  },
];
