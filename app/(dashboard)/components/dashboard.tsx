// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { UnapprovedEvents } from "./unapproved-events"
// import { EventStatistics } from "./event-statistics"
// import { RecentActivity } from "./recent-activity"
// import { UserManagement } from "./user-management"

// export function Dashboard() {
//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//             <div className="grid gap-6 md:grid-cols-2">
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Unapproved Events</CardTitle>
//                         <CardDescription>Events pending approval</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <UnapprovedEvents />
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Event Statistics</CardTitle>
//                         <CardDescription>Overview of event data</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <EventStatistics />
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>User Management</CardTitle>
//                         <CardDescription>Manage students and teachers</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <UserManagement />
//                     </CardContent>
//                 </Card>
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Recent Activity</CardTitle>
//                         <CardDescription>Latest actions and events</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <RecentActivity />
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     )
// }



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
import EventModal from "./EventModal";
import { EventDetailsDialog } from "@/components/eventDetails";

const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
};

export default function Dashboard() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showCreateEventForm, setShowCreateEventForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const timelineRef = useRef(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:3000/api/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                setEvents(data.map(event => ({
                    ...event,
                    startDate: new Date(event.startDate)
                })));
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);
    console.log(events);



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
        return events
            .filter(event =>
                event.startDate.getDate() === date.getDate() &&
                event.startDate.getMonth() === date.getMonth() &&
                event.startDate.getFullYear() === date.getFullYear()
            )
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
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
            const scrollPosition = startHour * 60;
            timelineRef.current.scrollTop = scrollPosition;
        }
    };

    const handleCreateEvent = async (newEvent) => {
        try {
            const response = await fetch('http://localhost:3000/api/events', {
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
                const updatedEvents = [...prevEvents, { ...createdEvent, startDate: new Date(createdEvent.startDate) }];
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
        return <div>Loading...</div>;
    }
    return (
        <div className="flex h-screen bg-[#1C1C1C] text-white">
            {/* Left sidebar */}
            <div className="w-[300px] border-r border-gray-800 p-4 overflow-y-auto">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search events"
                        className="pl-10 bg-[#2C2C2C] border-none"
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
                                {selectedDate.getDate() === day &&
                                    selectedDate.getMonth() === currentDate.getMonth() &&
                                    selectedDate.getFullYear() === currentDate.getFullYear() &&
                                    selectedTime && (
                                        <div className="absolute top-full left-0 z-10 bg-blue-600 text-white text-xs p-1 rounded">
                                            {selectedTime}
                                        </div>
                                    )}
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
                                        className="p-2 rounded bg-[#2C2C2C] cursor-pointer hover:bg-[#3C3C3C]"
                                        onClick={() => {
                                            setSelectedDate(event.startDate);
                                            setCurrentDate(new Date(event.startDate));
                                            scrollToEvent(event);
                                        }}
                                    >
                                        <div className="font-medium">{event.title}</div>
                                        <div className="text-sm text-gray-400">
                                            {event.venue} - {event.startDate.toLocaleDateString()}
                                        </div>
                                    </div>

                                ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Main calendar area */}
            <div className="flex-1 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl">
                        {selectedDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="text-gray-400" onClick={() => navigateDay(-1)}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-gray-400" onClick={() => navigateDay(1)}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        {/* <Button onClick={() => setShowCreateEventForm(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Event
                        </Button> */}
                        <Dialog>
                            <DialogTrigger asChild><Button>Create New Event</Button></DialogTrigger>
                            <DialogContent>
                                <CreateEventForm
                                    onCreateEvent={handleCreateEvent}
                                    onClose={() => setShowCreateEventForm(false)}
                                    existingEvents={events}
                                    selectedDate={selectedDate}
                                />

                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* {showCreateEventForm && (
                    <div className="mb-4">
                        <CreateEventForm
                            onCreateEvent={handleCreateEvent}
                            onClose={() => setShowCreateEventForm(false)}
                            existingEvents={events}
                            selectedDate={selectedDate}
                        />
                    </div>
                )} */}

                <div className="flex-1 overflow-y-auto bg-[#2C2C2C] rounded-lg p-4" ref={timelineRef}>
                    <div className="min-h-[100vh]">
                        {Array.from({ length: 24 }).map((_, hour) => (
                            <div key={hour} className="relative h-[60px] border-t border-gray-700">
                                <span className="absolute -top-3 -left-4 text-xs text-gray-400">
                                    {hour.toString().padStart(2, '0')}:00
                                </span>
                                {getEventsForDate(selectedDate)
                                    .filter(event => {
                                        const startHour = parseInt(event.startTime.split(':')[0]);
                                        const endHour = parseInt(event.endTime.split(':')[0]);
                                        return startHour <= hour && endHour > hour;
                                    })
                                    .map(event => {
                                        const startHour = parseInt(event.startTime.split(':')[0]);
                                        const startMinute = parseInt(event.startTime.split(':')[1]);
                                        const endHour = parseInt(event.endTime.split(':')[0]);
                                        const endMinute = parseInt(event.endTime.split(':')[1]);
                                        const top = (startHour === hour ? startMinute : 0) * (60 / 60);
                                        const height = ((endHour - startHour) * 60 + endMinute - startMinute) * (60 / 60);
                                        return (
                                            <Dialog>

                                                <DialogTrigger asChild>
                                                    <div
                                                        key={event._id}
                                                        className={`absolute left-16 right-4 rounded p-2 ${event.color} text-white overflow-hidden`}
                                                        style={{
                                                            top: `${top}px`,
                                                            height: `${height}px`,
                                                            zIndex: startHour === hour ? 10 : 5,
                                                        }}

                                                    >

                                                        <div className="font-semibold">{event.title}</div>
                                                        <div className="text-sm">
                                                            {event.startTime} - {event.endTime}
                                                        </div>
                                                        <div className="text-xs">{event.venue}</div>
                                                        {event.description && (
                                                            <div className="text-xs mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {event.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <EventDetailsDialog event={event}

                                                    />

                                                </DialogContent>
                                            </Dialog>

                                        );
                                    })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Toaster />
        </div >
    );
}



