//@ts-nocheck
'use client'

import { useState, useMemo, useCallback, useEffect } from "react"
import { IEvent } from "@/types/event"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Calendar, Timer } from "lucide-react"
import { EventDetailsDialog } from "@/components/eventDetails"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

export default function EventList() {
    const { toast } = useToast()
    // const [events, setEvents] = useState<IEvent[]>(initialEvents)
    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null)
    const [events, setEvents] = useState<IEvent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [attendees, setAttendees] = useState<string[]>([])

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events`)

                setEvents(response.data.reverse())
            } catch (error) {
                console.error("Failed to fetch events:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchEvents()
    }, [])

    // Use useMemo to optimize filtering
    const pendingEvents = useMemo(() =>
        events.filter(event => event.status === "pending"),
        [events]
    )

    const approvedEvents = useMemo(() =>
        events.filter(event => event.status === "approved" && new Date(event.startDate) >= new Date()),
        [events]
    )

    const pastEvents = useMemo(() =>
        events.filter(event => new Date(event.startDate) < new Date()).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
        [events]
    )

    const handleApproveEvent = useCallback(async (event: IEvent) => {
        try {
            const updatePayload = {
                ...event,
                status: event.status === 'pending' ? 'approved' : 'pending'
            }

            const updatedEvent = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/events/approve`, { updatePayload }).then(res => res.data.data)

            setEvents(prevEvents => prevEvents.map(e =>
                e._id === updatedEvent._id ? updatedEvent : e
            ))

            toast({
                title: "Event Status Changed",
                description: `Event "${updatedEvent.title}" status changed to ${updatedEvent.status}.`,
                variant: "default"
            })

            setSelectedEvent(null)
        } catch (error) {
            console.error("Failed to change event status:", error)
            toast({
                title: "Status Change Failed",
                description: "There was an error changing the event status.",
                variant: "destructive"
            })
        }
    }, [toast])

    const handleDeleteEvent = useCallback(async (event: IEvent) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/events?eventId=${event._id}`)

            setEvents(prevEvents => prevEvents.filter(e => e._id !== event._id))

            toast({
                title: "Event Deleted",
                description: `Event "${event.title}" has been permanently deleted.`,
                variant: "destructive"
            })

            setSelectedEvent(null)
        } catch (error) {
            console.error("Failed to delete event:", error)
            toast({
                title: "Deletion Failed",
                description: "There was an error deleting the event.",
                variant: "destructive"
            })
        }
    }, [toast])

    const handleJoinEvent = async (event_id: string) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/joinEvents`, { event_id });
            console.log("JoinEvent created", res.data);
            console.log("JoinEvent created", res);
            if (res.status === 201) {
                toast({
                    title: "Event Joined",
                    description: `You have successfully joined the event "${selectedEvent.title}".`,
                });
                // ReferenceError: setAttendees is not defined

                setAttendees((prev) => [...prev, "session?.user?.email"]);
            }
        } catch (error) {
            console.error("Failed to join event", error);
            toast({
                title: "Join Event Failed",
                description: "There was an error joining the event.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold mb-10">Pending Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {pendingEvents.map(event => (
                    <EventCard
                        key={event._id}
                        event={event}
                        onSelect={setSelectedEvent}
                    />
                ))}
            </div>

            <h2 className="text-xl font-semibold mb-10">Approved Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedEvents.map(event => (
                    <EventCard
                        key={event._id}
                        event={event}
                        onSelect={setSelectedEvent}
                    />
                ))}
            </div>

            <h2 className="text-xl font-semibold mb-10">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.map(event => (
                    <EventCard
                        key={event._id}
                        event={event}
                        onSelect={setSelectedEvent}
                    />
                ))}
            </div>

            {selectedEvent && (
                console.log("selected: ", selectedEvent),
                <EventDetailsDialog
                    event={selectedEvent}
                    isOpen={true}
                    onClose={() => setSelectedEvent(null)}
                    onApprove={() => handleApproveEvent(selectedEvent)}
                    onDelete={() => handleDeleteEvent(selectedEvent)}
                    onJoin={() => handleJoinEvent(selectedEvent._id)}
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
                    <Calendar className="inline-block size-4 text-center mr-2" />{new Date(event.startDate).toDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                    <Timer className="inline-block size-4 text-center mr-2" />{event.startTime} - {event.endTime}
                </p>
                <p className="text-sm mb-4">
                    <span className="text-md text-gray-500 mb-2">Description: </span>{event.description.substring(0, 100)}...</p>
                <Button onClick={() => onSelect(event)}>View Details</Button>
            </CardContent>
        </Card>
    )
}