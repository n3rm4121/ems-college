import { ScrollArea } from "@/components/ui/scroll-area"

const activities = [
    { id: 1, action: "Event Approved", details: "Tech Symposium approved by admin", timestamp: "2 hours ago" },
    { id: 2, action: "New User Registered", details: "Emily White joined as a student", timestamp: "5 hours ago" },
    { id: 3, action: "Event Cancelled", details: "Poetry Reading cancelled by organizer", timestamp: "1 day ago" },
    { id: 4, action: "User Role Updated", details: "John Doe promoted to teacher", timestamp: "2 days ago" },
    { id: 5, action: "New Event Created", details: "Annual Sports Meet added by Sports Club", timestamp: "3 days ago" },
]

export function RecentActivity() {
    return (
        <ScrollArea className="h-[200px]">
            <ul className="space-y-4">
                {activities.map((activity) => (
                    <li key={activity.id} className="flex justify-between items-start">
                        <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-gray-500">{activity.details}</p>
                        </div>
                        <span className="text-xs text-gray-400">{activity.timestamp}</span>
                    </li>
                ))}
            </ul>
        </ScrollArea>
    )
}

