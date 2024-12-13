// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CreateEventForm } from "./create-event-form";
import { Toaster } from "@/components/ui/toaster";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventDetailsDialog } from "@/components/eventDetails";
import UserProfile from "@/components/userProfile";
import { useSession } from "next-auth/react";
import { ModeToggle } from "@/components/ToggleTheme";
import Spinner from "@/components/Spinner";
import Unauthorized from "./unauthorized";

const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
};

export default function Calendar() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showCreateEventForm, setShowCreateEventForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const timelineRef = useRef(null);
    const { data: session } = useSession();
    const [isInAdminRoute, setIsInAdminRoute] = useState(false);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
    };
    // get current route and if its not /admin then add a button to redirect to /admin if user is admin
    useEffect(() => {
        const path = window.location.pathname;
        setIsInAdminRoute(path.includes('admin'));
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                const processedEvents = data.map(event => ({
                    ...event,
                    startDate: new Date(event.startDate),
                    color: event.color || `bg-${['blue', 'green', 'purple', 'red', 'yellow', 'indigo'][Math.floor(Math.random() * 6)]}-500`
                }));
                const now = new Date();
                const filteredEvents = processedEvents.filter(event => {
                    const eventStartDate = new Date(`${event.startDate.toDateString()} ${event.startTime}`);
                    return eventStartDate >= now && (event.status === 'approved' || session && session.user.role === 'admin');
                });
                setEvents(filteredEvents.sort((a, b) => {
                    const dateA = new Date(`${a.startDate.toDateString()} ${a.startTime}`);
                    const dateB = new Date(`${b.startDate.toDateString()} ${b.startTime}`);
                    return dateA - dateB;
                })


                );
                console.log('Fetched events:', processedEvents);
            } catch (error) {
                toast({
                    title: 'Error fetching events',
                    description: 'Failed to fetch events. Please try again later.',
                    variant: 'destructive'
                })
                console.error('Error fetching events:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const hasEventOnDate = (date) => {
        return events.some(event =>
            event.startDate.getDate() === date &&
            event.startDate.getMonth() === currentDate.getMonth() &&
            event.startDate.getFullYear() === currentDate.getFullYear()
        );
    };

    const getEventsForDate = (date) => {
        const filteredEvents = events.filter(event =>
            event.startDate.getFullYear() === date.getFullYear() &&
            event.startDate.getMonth() === date.getMonth() &&
            event.startDate.getDate() === date.getDate()
        ).sort((a, b) => a.startTime.localeCompare(b.startTime));
        console.log('Filtered events for', date.toDateString(), ':', filteredEvents);
        return filteredEvents;
    };

    const handleDateClick = (day) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
        setSelectedTime(new Date().toLocaleTimeString());
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.trim() === "") {
            setSearchResults([]);
            return;
        }
        const results = events.filter(event =>
            event.title.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(results);
        if (results.length > 0) {
            setSelectedDate(results[0].startDate);
            setCurrentDate(new Date(results[0].startDate));
        }
    };

    const navigateDay = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + direction);
        setSelectedDate(newDate);
    };

    const scrollToEvent = (event) => {
        if (timelineRef.current) {
            const startHour = parseInt(event.startTime.split(':')[0]);
            const scrollPosition = Math.max(0, (startHour - 7) * 60);
            timelineRef.current.scrollTop = scrollPosition;
        }
    };

    const handleCreateEvent = async (newEvent) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });

            if (!response.ok) {
                throw new Error('Failed to create event');
            }

            const createdEvent = await response.json();
            setEvents(prevEvents => {
                const updatedEvents = [...prevEvents, {
                    ...createdEvent,
                    startDate: new Date(createdEvent.startDate),
                    color: createdEvent.color || `bg-${['blue', 'green', 'purple', 'red', 'yellow', 'indigo'][Math.floor(Math.random() * 6)]}-500`
                }];
                return updatedEvents.sort((a, b) => {
                    const dateA = new Date(`${a.startDate.toDateString()} ${a.startTime}`);
                    const dateB = new Date(`${b.startDate.toDateString()} ${b.startTime}`);
                    return dateA - dateB;
                });
            });
            setShowCreateEventForm(false);
            setSelectedDate(new Date(createdEvent.startDate));
            scrollToEvent(createdEvent);
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };


    if (isLoading) {
        return <Spinner />;
    }
    const isAdmin = session?.user?.role === 'admin';
    if (!isAdmin && isInAdminRoute) {
        return <Unauthorized />;
    }
    const renderedEvents = new Set();

    return (
        <div className="flex h-screen">
            {/* Left sidebar */}
            <div className="w-[300px] border-r border-gray-800 p-4 overflow-y-auto">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                    <Input
                        placeholder="Search events"
                        className="pl-10 "
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between mb-4">
                    <Button variant="ghost" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span>{monthName} {year}</span>
                    <Button variant="ghost" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="text-gray-400">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfMonth - 1 }).map((_, index) => (
                        <div key={`empty-${index}`} className="h-8" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const hasEvent = hasEventOnDate(day);
                        return (
                            <div key={day} className="relative">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "h-8 w-8 p-0",
                                        hasEvent && "text-blue-500",
                                        selectedDate.getDate() === day &&
                                        selectedDate.getMonth() === currentDate.getMonth() &&
                                        selectedDate.getFullYear() === currentDate.getFullYear() &&
                                        "bg-blue-600 text-white hover:bg-blue-700"
                                    )}
                                    onClick={() => handleDateClick(day)}
                                >
                                    {day}
                                </Button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Events</h3>
                    <ScrollArea className="h-96">
                        <div className="space-y-2">
                            {(searchResults.length > 0 ? searchResults : events)
                                .filter(event => event.startDate >= new Date().setHours(0, 0, 0, 0))
                                .map(event => (
                                    <div
                                        key={event._id}
                                        className="p-2 rounded cursor-pointer bg-secondary"
                                        onClick={() => {
                                            setSelectedEvent(event);

                                            setSelectedDate(event.startDate);
                                            setCurrentDate(new Date(event.startDate));
                                            scrollToEvent(event);
                                        }}
                                    >
                                        <div className="font-medium">{event.title}</div>
                                        <div className="text-sm text-gray-400">
                                            {event.venue} - {event.startDate.toDateString()}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Main calendar area */}
            <div className="flex-1 p-4 flex flex-col">
                {/** Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <h2 className="text-xl">
                            {selectedDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </h2>
                        <Button variant="outline" size="icon" className="text-gray-400" onClick={() => navigateDay(-1)}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-gray-400" onClick={() => navigateDay(1)}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">

                        <Dialog>
                            <DialogTrigger asChild><Button
                                className={!session?.user ? "opacity-50 cursor-not-allowed" : ""}
                                disabled={!session?.user}
                            >Create New Event</Button></DialogTrigger>
                            <DialogContent>
                                <CreateEventForm
                                    onCreateEvent={handleCreateEvent}
                                    onClose={() => setShowCreateEventForm(false)}
                                    existingEvents={events}
                                    selectedDate={selectedDate}
                                />
                            </DialogContent>
                        </Dialog>
                        {!isInAdminRoute && isAdmin && (
                            <Button variant="outline" className="text-gray-400" onClick={() => window.location.href = '/admin'}>
                                Admin Dashboard
                            </Button>
                        )}

                        <UserProfile />
                        <ModeToggle />


                    </div>
                </div>

                <div className="flex-1 overflow-y-auto rounded-lg p-4" ref={timelineRef}>
                    <div className="min-h-[660px]"> {/* 11 hours * 60 px per hour */}
                        {Array.from({ length: 12 }).map((_, index) => {
                            const hour = index + 7; // Start from 7 AM
                            return (
                                <div key={hour} className="relative h-[60px] border-t border-gray-700">
                                    <span className="absolute -top-3 -left-4 text-xs text-gray-400">
                                        {hour.toString().padStart(2, '0')}:00
                                    </span>

                                    {getEventsForDate(selectedDate)
                                        .filter(event => {
                                            const startHour = parseInt(event.startTime.split(':')[0]);
                                            const endHour = parseInt(event.endTime.split(':')[0]);
                                            const shouldDisplay = startHour <= hour && endHour > hour;

                                            // Prevent duplicate rendering
                                            if (renderedEvents.has(event._id)) {
                                                return false;
                                            }

                                            // Mark event as rendered
                                            if (shouldDisplay) {
                                                renderedEvents.add(event._id);
                                            }

                                            return shouldDisplay;
                                        })
                                        .map(event => {
                                            const startHour = parseInt(event.startTime.split(':')[0]);
                                            const startMinute = parseInt(event.startTime.split(':')[1]);
                                            const endHour = parseInt(event.endTime.split(':')[0]);
                                            const endMinute = parseInt(event.endTime.split(':')[1]);
                                            const top = (startHour === hour ? startMinute : 0) * (60 / 60);
                                            const height = ((endHour - startHour) * 60 + endMinute - startMinute) * (60 / 60);

                                            return (
                                                <div
                                                    key={event._id}
                                                    onClick={() => handleEventClick(event)}
                                                    className={`absolute left-4 right-4 md:left-16 md:right-4 rounded p-2 ${event.color} border-2 border-green-500 overflow-hidden cursor-pointer`}
                                                    style={{
                                                        top: `${top}px`,
                                                        height: `${height}px`,
                                                        zIndex: startHour === hour ? 10 : 5,
                                                    }}
                                                >
                                                    <div className="font-semibold text-sm md:text-base">{event.title}</div>
                                                    <div className="text-xs md:text-sm">
                                                        {event.startTime} - {event.endTime}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* Event Details Dialog */}
            {selectedEvent && (
                <EventDetailsDialog
                    event={selectedEvent}
                    isOpen={isDialogOpen}
                    onClose={() => {
                        setIsDialogOpen(false);
                        setSelectedEvent(null);
                    }}
                />
            )}
            <Toaster />
        </div>
    );
}

