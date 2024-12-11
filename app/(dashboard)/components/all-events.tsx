import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const allEvents = [
    { id: 1, name: "Tech Symposium", organizer: "CS Department", date: "2024-05-15", status: "Approved" },
    { id: 2, name: "Annual Sports Meet", organizer: "Sports Club", date: "2024-06-10", status: "Pending" },
    { id: 3, name: "Cultural Night", organizer: "Arts Society", date: "2024-07-22", status: "Approved" },
    { id: 4, name: "Career Fair", organizer: "Career Services", date: "2024-08-05", status: "Approved" },
    { id: 5, name: "Alumni Meetup", organizer: "Alumni Association", date: "2024-09-15", status: "Pending" },
]

export function AllEvents() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">All Events</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Organizer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allEvents.map((event) => (
                        <TableRow key={event.id}>
                            <TableCell>{event.name}</TableCell>
                            <TableCell>{event.organizer}</TableCell>
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.status}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm">Edit</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

