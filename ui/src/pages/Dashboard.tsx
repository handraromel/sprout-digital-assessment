/**
 * Dashboard Page
 * Main dashboard for authenticated users
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/common";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-foreground-muted">Welcome to your dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card hover>
          <CardContent>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Your dashboard overview will appear here
            </CardDescription>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Your statistics will appear here</CardDescription>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent activity will appear here
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
