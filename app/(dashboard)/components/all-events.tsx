'use client'
import EventList from "./EventList"
import { Toaster } from "@/components/ui/toaster"

export default function EventsPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Event Management</h1>
            <EventList />
            <Toaster />
        </div>
    )
}