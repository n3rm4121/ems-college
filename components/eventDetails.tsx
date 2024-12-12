'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Tag, User } from "lucide-react";
import { ImageCarousel } from "./imagecarousel";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { useState, useEffect } from "react";
import { ObjectId } from "mongoose";
import { useSession } from "next-auth/react";

interface EventDetailsDialogProps {
  event: Event | null;
  isOpen?: boolean;
  onClose?: () => void;
}

interface Event {
  _id: ObjectId;
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  status: "pending" | "approved";
  organizer: string;
}

export function EventDetailsDialog({ event, isOpen, onClose }: EventDetailsDialogProps) {
  const [attendees, setAttendees] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const {data: session }  = useSession()
  useEffect(() => {
    console.log("Dialog isOpen:", isOpen, "Event:", event);
  }, [isOpen, event]);
  
  useEffect(() => {
    if (event) {
      const fetchAttendees = async () => {
        setIsFetching(true);
        try {
          const res = await axios.get(`http://localhost:3000/api/joinEvents?event_id=${event._id}`);
          // console.log("Attendees: ", res.data.data.attendees);
          setAttendees(res.data.data.attendees);
        } catch (error) {
          console.error("Failed to fetch attendees", error);
        } finally {
          setIsFetching(false);
        }
      };

      fetchAttendees();
    }
  }, [event, setAttendees]);

  const handleJoinEvent = async (event_id: string) => {
    try {
      const res = await axios.post(`http://localhost:3000/api/joinEvents`, { event_id });
      console.log("JoinEvent created", res.data);

      if (res.status === 201) {
        alert("User is successfully joined the event");
        setAttendees((prev) => [...prev, "session?.user?.email"]);
      }
    } catch (error) {
      console.error("Failed to join event", error);
      alert("An error occurred while joining the event. Please try again.");
    }
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0 gap-0 bg-gradient-to-br from-indigo-50 to-purple-50">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-3xl font-bold text-indigo-800">{event.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 relative">
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-700">
                  {new Date(event.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-700">
                  {event.startTime} - {event.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-700">{event.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-700 capitalize">
                  Status: <Badge variant={event.status === "approved" ? "default" : "secondary"}>{event.status}</Badge>
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-400" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-gray-400" />
              <span>{event.venue === 'hall1' ? 'Hall 1' : 'Hall 2'}</span>
            </div>
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-gray-400" />
              <span>{event?.organizer}</span>
            </div>
          </div>
        </ScrollArea>
        <div className="p-6 pt-2 mt-4 mb-4">
          <Button

            disabled={attendees.includes(session?.user?.email as string) || event.startDate < new Date().toISOString()}
            onClick={() => handleJoinEvent(event._id.toString())}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >{
             attendees.includes(session?.user?.email as string) ? "Already Joined" : "Join Event"
          }
          </Button>
          <Button onClick={onClose} className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
