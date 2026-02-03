import { useUserStore } from "@/stores";
import {
  ArrowLeftStartOnRectangleIcon,
  Cog8ToothIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";

export const ProfileDropdown = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout, user } = useUserStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        variant="secondary"
        className="flex items-center gap-2 rounded-lg bg-transparent p-2 px-3 py-1.5"
      >
        <span className="text-(--sprd-purple)">
          {user?.fullname
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()}
        </span>
      </Button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-32 origin-top-right rounded-lg border-0 shadow-lg transition-all duration-200 ease-out ${
          isProfileOpen
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <Button
          variant="secondary"
          className="w-full rounded-t-md rounded-b-none border-0 bg-transparent py-2 pl-2.5 text-left text-sm focus:ring-0"
          icon={<UserIcon className="h-5 w-5" />}
        >
          Profile
        </Button>
        <Button
          variant="secondary"
          className="w-full rounded-none border-0 bg-transparent py-2 pl-2.5 text-left text-sm focus:ring-0"
          icon={<Cog8ToothIcon className="h-5 w-5" />}
        >
          Settings
        </Button>
        <hr className="border-border" />
        <Button
          variant="secondary"
          className="text-error! w-full rounded-none rounded-t-none rounded-b-md border-0 bg-transparent py-2 pl-2.5 text-left text-sm focus:ring-0"
          icon={<ArrowLeftStartOnRectangleIcon className="h-5 w-5" />}
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
