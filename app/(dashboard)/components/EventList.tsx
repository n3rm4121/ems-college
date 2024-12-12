'use client'

import { useState, useMemo } from "react"
import { IEvent } from "@/types/event"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import EventModal from "./EventModal"

interface EventListProps {
    events: IEvent[]
    onUpdateEvents: (event: IEvent) => void
    onDeleteEvent: (eventId: string) => void
}

export default function EventList({
    events: initialEvents,
    onUpdateEvents,
    onDeleteEvent
}: EventListProps) {
    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null)

    // Use useMemo to optimize filtering
    const pendingEvents = useMemo(() =>
        initialEvents.filter(event => event.status === "pending"),
        [initialEvents]
    )

    const approvedEvents = useMemo(() =>
        initialEvents.filter(event => event.status === "approved"),
        [initialEvents]
    )

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Pending Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {pendingEvents.map(event => (
                    <EventCard
                        key={event._id}
                        event={event}
                        onSelect={setSelectedEvent}
                    />
                ))}
            </div>

            <h2 className="text-xl font-semibold mb-2">Approved Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedEvents.map(event => (
                    <EventCard
                        key={event._id}
                        event={event}
                        onSelect={setSelectedEvent}
                    />
                ))}
            </div>

            {selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onUpdate={onUpdateEvents}
                    onDelete={onDeleteEvent}
                />
            )}
        </div>
    )
}

function EventCard({ event, onSelect }: { event: IEvent; onSelect: (event: IEvent) => void }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm mb-4">{event.description.substring(0, 100)}...</p>
                <Button onClick={() => onSelect(event)}>View Details</Button>
            </CardContent>
        </Card>
    )
}