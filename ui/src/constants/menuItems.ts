import { type MenuItem } from "@/types";
import { HomeIcon, QueueListIcon } from "@heroicons/react/24/outline";

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
];
