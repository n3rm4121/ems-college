import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UnapprovedEvents } from "./unapproved-events"
import { EventStatistics } from "./event-statistics"
import { RecentActivity } from "./recent-activity"
import { UserManagement } from "./user-management"

export function Dashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Unapproved Events</CardTitle>
                        <CardDescription>Events pending approval</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UnapprovedEvents />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Event Statistics</CardTitle>
                        <CardDescription>Overview of event data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EventStatistics />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Manage students and teachers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserManagement />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest actions and events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentActivity />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

