import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VENUES = ['Hall 1', 'Hall 2', 'Hall 3', 'Conference Room', 'Meeting Room A', 'Meeting Room B'];

interface CreateEventFormProps {
  onCreateEvent: (event: any) => void;
  onClose: () => void;
  existingEvents: any[];
  selectedDate: Date;
}

export function CreateEventForm({ onCreateEvent, onClose, existingEvents, selectedDate }: CreateEventFormProps) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('07:00');
    const [endTime, setEndTime] = useState('17:00');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');

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
      };
      onCreateEvent(newEvent);
    } else {
      alert('The selected venue is not available at this time. Please choose a different venue or time.');
    }
  };
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 7; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            options.push(
                <SelectItem key={time} value={time}>
                    {time}
                </SelectItem>
            );
        }
    }
    return options;
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-green-500 bg-[#2C2C2C] p-4 rounded-lg">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required={true} />
      </div>
      <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                        {generateTimeOptions()}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="endTime">End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                        {generateTimeOptions()}
                    </SelectContent>
                </Select>
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

