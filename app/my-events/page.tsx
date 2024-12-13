// @ts-nocheck
'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, User, MoveLeft } from 'lucide-react'
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { EventDetailsDialog } from "@/components/eventDetails"
import { redirect } from "next/navigation"
import axios from "axios"
import Spinner from "@/components/Spinner"

interface Event {
  _id: string;
  event_id: {
    _id: string;
    name: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    title: string;
    images: string[];
    startDate: string;
    endDate: string;
    venue: string;
    status: "pending" | "approved";
    organizer: string;
  };
}

const MyEvents = () => {
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events`);
        console.log(response.data);
        setUserEvents(response.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchUserEvents();
  }, [])
  useEffect(() => {
    const fetchJoinedEvents = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/myEvents`);
        if (!response.ok) {
          throw new Error('Failed to fetch joined events');
        }
        const data = await response.json();
        console.log(data.joinedEvents);
        setJoinedEvents(data.joinedEvents);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedEvents();
  }, []);

  const handleOpenDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (joinedEvents.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={() => redirect('/')}><MoveLeft className="inline-block" />Home</Button>
          <Avatar className="h-16 w-16">
            <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
            <AvatarFallback><User className="h-8 w-8" /></AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}</h1>
            <p className="text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-6">Your Joined Events</h2>
        {joinedEvents.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {joinedEvents.map((event, index) => (
              event.event_id ? (
                <motion.div key={event._id} variants={itemVariants} custom={index}>
                  <EventCard event={event.event_id} onViewDetails={() => handleOpenDialog(event)} />
                </motion.div>) : (
                <EmptyState />

              )

            ))}

          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-6">Your Created Events</h2>
        {userEvents.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {userEvents.map((event, index) => (
              <motion.div key={event._id} variants={itemVariants} custom={index}>
                <EventCard event={event} onViewDetails={() => handleOpenDialog(event)} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
      <EventDetailsDialog
        event={selectedEvent?.event_id}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        showJoinButton={false}
      />
    </div>

  );
};

const EventCard = ({ event, onViewDetails }) => (
  console.log('event', event),

  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <span>{event.title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <p>{new Date(event.startDate).toDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <p>{event.startTime} - {event.endTime}</p>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <p>{event.venue}</p>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button onClick={onViewDetails} className="w-full">
        View Details
      </Button>
    </CardFooter>
  </Card>
)

const EmptyState = () => (
  <Card className="text-center p-8">
    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-xl font-semibold mb-2">No Events Joined Yet</h3>
    <p className="text-muted-foreground mb-4">You haven't joined any events. Start exploring and join some exciting events!</p>
    <Button asChild>
      <a href="/create">Explore Events</a>
    </Button>
  </Card>
)

const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex items-center gap-4 mb-8">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
    <Skeleton className="h-8 w-48 mb-6" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
)

const ErrorState = ({ error }: { error: string }) => (
  <Card className="text-center p-8 max-w-md mx-auto mt-8">
    <div className="text-destructive mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
    <p className="text-muted-foreground mb-4">{error}</p>
    <Button onClick={() => window.location.reload()}>Try Again</Button>
  </Card>
)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

export default MyEvents;

