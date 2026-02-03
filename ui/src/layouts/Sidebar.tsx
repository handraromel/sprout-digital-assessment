import { MENU_ITEMS } from "@/constants/menuItems";
import { type SidebarProps } from "@/types/layout";
import { Link, useLocation } from "react-router";

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background-elevated transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Main Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            <p className="px-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              {"navigation"}
            </p>
            {MENU_ITEMS.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-background-surface ${
                    isActive(item.href)
                      ? "bg-background-surface text-(--sprd-purple)!"
                      : "text-foreground-muted"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{item.labelKey}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
