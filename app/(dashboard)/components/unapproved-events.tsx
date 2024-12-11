'use client'

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import dbConnect from "@/lib/db"
import Events from "@/models/events"
import { IEvent } from "@/types/event"
import { useEffect, useState } from "react"

// const unapprovedEvents = [
//     { id: 1, name: "Tech Symposium", organizer: "CS Department", date: "2024-05-15" },
//     { id: 2, name: "Annual Sports Meet", organizer: "Sports Club", date: "2024-06-10" },
//     { id: 3, name: "Cultural Night", organizer: "Arts Society", date: "2024-07-22" },
// ]


export function UnapprovedEvents() {
    const [unapprovedEvents, setUnapprovedEvents] = useState([])
    useEffect(() => {
        const fetchUnapprovedEvents = async () => {
            const res = await fetch('http://localhost:3000/api/events/unapproved').then(res => res.json());
            setUnapprovedEvents(res.data)
            console.log(res.data)
        }
        fetchUnapprovedEvents()
    }, [])

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {unapprovedEvents.map((event: IEvent) => (
                    <TableRow key={event._id?.toString()}>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>{event.organizer_id as unknown as string}</TableCell>
                        <TableCell>{event.startDate.toString()}</TableCell>
                        <TableCell>{event.endDate.toString()}</TableCell>
                        <TableCell>{event.startTime}</TableCell>
                        <TableCell>{event.endTime}</TableCell>
                        <TableCell>
                            <Button variant="outline" className="mr-2">Approve</Button>
                            <Button variant="outline">Reject</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

