'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Tag, User, Trash2 } from "lucide-react";
import { ImageCarousel } from "./imagecarousel";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { useState, useEffect } from "react";
import { ObjectId } from "mongoose";
import { useSession } from "next-auth/react";
import { Toaster } from "./ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Separator } from "./ui/separator";

interface EventDetailsDialogProps {
  event: Event | null;
  isOpen?: boolean;
  onClose?: () => void;
  onJoin?: () => void;
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

export function EventDetailsDialog({
  event,
  isOpen,
  onClose,
  onApprove,
  onDelete,
  onJoin,

}: EventDetailsDialogProps & {
  onApprove?: () => void,
  onDelete?: () => void,
  onJoin?: () => void
}) {
  const { toast } = useToast();
  const [attendees, setAttendees] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin";
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    console.log("Dialog isOpen:", isOpen, "Event:", event);
  }, [isOpen, event]);

  useEffect(() => {
    if (event) {
      const fetchAttendees = async () => {
        setIsFetching(true);
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/joinEvents?event_id=${event._id}`);
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
      setIsLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/joinEvents`, { event_id });
      console.log("JoinEvent created", res.data);
      setIsLoading(false);
      if (res.status === 201) {
        toast({
          title: "Event Joined",
          description: `You have successfully joined the event "${event?.title}".`,
        });
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

  if (!event) return null;

  // const handleDelete = async () => {
  //   try {
  //     const eventId = event._id
  //     await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/events?eventId=${eventId}`)
  //     toast({
  //       title: "Event Deleted",
  //       description: `Event "${event.title}" has been permanently deleted.`,
  //       variant: "destructive"
  //     })
  //   } catch (error) {
  //     console.error("Failed to delete event:", error)
  //     toast({
  //       title: "Deletion Failed",
  //       description: "There was an error deleting the event.",
  //       variant: "destructive"
  //     })
  //   }
  // }

  // const handleApprove = async () => {
  //   try {
  //     const updatePayload = {
  //       ...event,
  //       status: event.status === 'pending' ? 'approved' : 'pending'
  //     }

  //     const updatedEvent = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/events/approve`, { updatePayload }).then(res => res.data)
  //     console.log("Updated Event:", updatedEvent)

  //     toast({
  //       title: "Event Status Changed",
  //       description: `Event "${updatedEvent.data.title}" status changed to ${updatedEvent.data.status}.`,
  //       variant: "default"
  //     })
  //   } catch (error) {
  //     console.error("Failed to change event status:", error)
  //     toast({
  //       title: "Status Change Failed",
  //       description: "There was an error changing the event status.",
  //       variant: "destructive"
  //     })
  //   }
  // }

  const handleDelete = async () => {
    try {
      await onDelete?.()
    } catch (error) {
      console.error("Failed to delete event:", error)
    }
  }

  const handleApprove = async () => {
    try {
      await onApprove?.()
    } catch (error) {
      console.error("Failed to change event status:", error)
    }
  }


  return (
    <>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:min-w-[700px] flex flex-col p-0 gap-0 bg-gradient-to-br from-indigo-50 to-purple-50">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-3xl font-bold text-indigo-800">{event.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-grow px-6 relative mt-6">
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  <span className="text-gray-700">
                    {new Date(event.startDate).toDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  <span className="text-gray-700">
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5  text-indigo-600" />
                  <span className="text-gray-700 capitalize">
                    Venue: {event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-indigo-600" />
                  <span className="text-gray-700 capitalize">
                    Status: <Badge variant={event.status === "approved" ? "default" : "secondary"}>{event.status}</Badge>
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5  text-indigo-600" />
                <span className="text-gray-700 capitalize">
                  Event Organizer: {event?.organizer}</span>
              </div>
              <div className="flex flex-col gap-4 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-indigo-800">Description</h3>
                <div className="flex flex-wrap items-start gap-4 text-gray-700">
                  <p className="flex-1 text-justify">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div>
            <Separator className="mt-10 mb-2" />

            <div className="flex flex-row gap-4 p-4">
              <Button

                disabled={attendees.includes(session?.user?.email as string) || event.status === "pending" || isLoading}
                onClick={() => handleJoinEvent(event._id.toString())}
              >{
                  attendees.includes(session?.user?.email as string) ? "Already Joined" : "Join Event"
                }
              </Button>
              {isAdmin && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center"
                      >
                        <Trash2 className="mr-2" size={16} /> Delete Event
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the event.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {(event.status === "pending" || event.status === "approved") && (
                    <Button
                      onClick={handleApprove}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      {event.status === 'pending' ? 'Approve Event' : 'Mark as Pending'}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}
