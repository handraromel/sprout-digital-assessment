/**
 * Dashboard Page
 * Main dashboard for authenticated users
 */

import { Card, CardContent, CardTitle } from "@/components/common";
import { MENU_ITEMS } from "@/constants/menuItems";
import { Link } from "react-router";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
        <p className="text-foreground-muted mt-2">
          Quick access to your modules
        </p>
      </div>

      {/* Quick Access Menu */}
      <div className="mb-8">
        <h2 className="text-foreground mb-4 text-xl font-semibold">
          Quick Access
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} to={item.href}>
                <Card
                  hover
                  className="h-full transition-shadow hover:shadow-md"
                >
                  <CardContent className="flex flex-wrap items-center justify-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                      <Icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-center text-lg font-semibold">
                        {item.labelKey}
                      </CardTitle>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
