import { type MenuItem } from "@/types";
import {
  BanknotesIcon,
  BookOpenIcon,
  HomeIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";

export const MENU_ITEMS: MenuItem[] = [
  {
    labelKey: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    labelKey: "Daftar Akun",
    href: "/accounts",
    icon: QueueListIcon,
  },
  {
    labelKey: "Jurnal Umum",
    href: "/journals",
    icon: BookOpenIcon,
  },
  {
    labelKey: "Penagihan",
    href: "/penagihan",
    icon: BanknotesIcon,
  },
];
