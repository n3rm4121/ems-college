'use client'
import EventList from "./EventList"
import { useEffect, useState } from "react"
import axios from 'axios'
import { IEvent } from "@/types/event"
import { Toaster } from "@/components/ui/toaster"

export default function EventsPage() {
    const [events, setEvents] = useState<IEvent[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events`)
                setEvents(response.data)
            } catch (error) {
                console.error("Failed to fetch events:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchEvents()
    }, [])

    const handleUpdateEvents = (updatedEvent: IEvent) => {
        setEvents(currentEvents =>
            currentEvents.map(event =>
                event._id === updatedEvent._id ? updatedEvent : event
            )
        )
    }

    const handleDeleteEvent = (eventId: string) => {
        setEvents(currentEvents =>
            currentEvents.filter(event => event._id !== eventId)
        )
    }

    if (isLoading) {
        return <div>Loading events...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Event Management</h1>
            <EventList
                events={events}
                onUpdateEvents={handleUpdateEvents}
                onDeleteEvent={handleDeleteEvent}
            />
            <Toaster />
        </div>
    )
}