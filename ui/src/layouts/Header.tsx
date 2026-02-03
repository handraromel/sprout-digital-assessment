import { ProfileDropdown } from "@/components";
import { type HeaderProps } from "@/types/layout";
import { Link } from "react-router";

export default function Header({
  onSidebarToggle,
  noUserProfile,
  noTitle,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background-elevated">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section - Logo & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button (Mobile Only) */}
          <button
            onClick={onSidebarToggle}
            className="inline-flex items-center justify-center rounded-lg p-2 text-foreground-muted transition-colors hover:bg-[var(--background-surface)] md:hidden"
            aria-label="Toggle sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="hidden text-lg font-bold text-foreground sm:inline">
              {"Sprout Digital Assessment"}
            </span>
          </Link>
        </div>

        {/* Center Section - Title */}
        {!noTitle && (
          <h1 className="text-sm font-semibold text-foreground-muted md:text-base">
            {"Dashboard"}
          </h1>
        )}

        {/* Right Section - User Profile */}
        <div className="flex items-center gap-4">
          {!noUserProfile && <ProfileDropdown />}
        </div>
      </div>
    </header>
  );
}
