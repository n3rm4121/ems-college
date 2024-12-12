'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

const VENUES = ['Hall 1', 'Hall 2', 'Hall 3', 'Conference Room', 'Meeting Room A', 'Meeting Room B'];

interface CreateEventFormProps {
    onCreateEvent: (event: any) => void;
    onClose: () => void;
    existingEvents: any[];
    selectedDate: Date;
}

export function CreateEventForm({ onCreateEvent, onClose, existingEvents, selectedDate }: CreateEventFormProps) {

    const session = useSession();
    if (!session) return null;
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [venue, setVenue] = useState('');
    const [description, setDescription] = useState('');
    const { toast } = useToast();

    const isVenueAvailable = (selectedVenue: string, selectedStart: string, selectedEnd: string) => {
        return !existingEvents.some(event =>
            event.venue === selectedVenue &&
            event.startDate.toDateString() === selectedDate.toDateString() &&
            ((selectedStart >= event.startTime && selectedStart < event.endTime) ||
                (selectedEnd > event.startTime && selectedEnd <= event.endTime) ||
                (selectedStart <= event.startTime && selectedEnd >= event.endTime))
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isVenueAvailable(venue, startTime, endTime)) {
            const newEvent = {
                title,
                startDate: new Date(selectedDate.setHours(0, 0, 0, 0)), // Ensure the date is set to midnight
                startTime,
                endTime,
                venue,
                description,
                color: `bg-${['blue', 'green', 'purple', 'red', 'yellow', 'indigo'][Math.floor(Math.random() * 6)]}-500`,
                organizer: session?.data?.user?.email,
                status: 'pending',

            };
            onCreateEvent(newEvent);
        } else {
            toast({ description: 'The selected venue is not available at this time. Please choose a different venue or time.', variant: 'destructive' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-green-500 bg-transparent p-4 rounded-lg">
            <h1 className='text-3xl text-white text-center'>Create Event</h1>
            <div>
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required={true} />
            </div>
            <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required={true} />
            </div>
            <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required={true} />
            </div>
            <div>
                <Label htmlFor="venue">Venue</Label>
                <Select onValueChange={setVenue} required={true}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a venue" />
                    </SelectTrigger>
                    <SelectContent>
                        {VENUES.map((v) => (
                            <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Create Event</Button>
            </div>
        </form>
    );
}

