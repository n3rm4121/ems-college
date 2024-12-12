'use client'
import { Carousel } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Search, Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'
import { useEffect, useState } from "react"
import axios from 'axios'
import { EventDetailsDialog } from "@/components/eventDetails"
import { ObjectId } from "mongoose"
import UserProfile from "@/components/userProfile"

const eventCategories = [
  { name: 'Academic', icon: '🎓', color: 'bg-blue-500' },
  { name: 'Cultural', icon: '🎭', color: 'bg-purple-500' },
  { name: 'Sports', icon: '🏅', color: 'bg-green-500' },
  { name: 'Technology', icon: '💻', color: 'bg-red-500' },
]

export default function ShowEvents() {
  interface Event {
    _id: ObjectId;
    title: string;
    startDate: string;
    startTime: string;
    venue: string;
    images: string[];
    description: string;
    endDate: string;
    endTime: string;
    featured: boolean;
    status: "pending" | "approved";
  }

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    const fetchAndProcessEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/events');
        const events = res.data;

        const now = new Date();

        const upcoming: Event[] = events.filter((event: Event) => {
          const eventStartDate = new Date(event.startDate);
          return eventStartDate > now;
        });

        const featured: Event[] = events.filter((event: Event) => {
          const eventStartDate = new Date(event.startDate);
          return eventStartDate <= now;
        });

        console.log("All events:", events);
        console.log("Upcoming events:", upcoming);
        console.log("Featured events:", featured);

        setAllEvents(events);
        setUpcomingEvents(upcoming);
        setFeaturedEvents(featured);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchAndProcessEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 ">
      <header className="bg-indigo-600 text-white shadow-lg relative overflow-visible mr-3 ml-3 ">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center">College Event Management System</h1>
          <UserProfile />
          </div>
      </header>


      <main className="container mx-auto px-4 py-8">
        <section className="mb-16">
          <Carousel className="rounded-xl overflow-hidden shadow-2xl relative">
            {featuredEvents.map((event) => (
              <div key={event._id.toString()} className="relative h-[300px]">
                <img src={event.images[0] || '/placeholder.svg?height=600&width=1200'} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-8">
                  <h2 className="text-5xl font-bold text-white text-center mb-4">{event.title}</h2>
                  <p className="text-2xl text-white mb-8">{new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <Button size="lg" variant="default" className="bg-white text-indigo-600 hover:bg-indigo-100">Learn More</Button>
                </div>
              </div>
            ))}
          </Carousel>
        </section>

        <section className="mb-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">Find Your Next Event</h2>
            <div className="relative w-full">
              <div className="flex items-center shadow-2xl rounded-full bg-white overflow-hidden">
                <div className="absolute left-6 text-gray-400">
                  <Search className="h-6 w-6" />
                </div>
                <Input
                  placeholder="Search events by title, category, or venue..."
                  className="pl-14 pr-6 py-6 text-lg border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow"
                />
                <Button
                  className="
            absolute right-2 top-1/2 transform -translate-y-1/2 
            px-6 py-3 rounded-full 
            bg-indigo-600 hover:bg-indigo-700 
            transition-all duration-300 ease-in-out
          "
                >
                  Search
                </Button>
              </div>

            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">Event Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {eventCategories.map((category) => (
              <Card key={category.name} className={`text-center hover:shadow-xl transition-shadow overflow-hidden group ${category.color}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-6xl group-hover:scale-110 transition-transform">{category.icon}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold text-white">{category.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">Upcoming Events</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event._id.toString()} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-indigo-700">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-2 text-gray-600">
                    <Calendar className="mr-2 h-5 w-5" />
                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mb-2 text-gray-600">
                    <MapPin className="mr-2 h-5 w-5" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="mr-2 h-5 w-5" />
                    <span>{event.startTime}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => {
                      setSelectedEvent(event);
                      console.log("Selected event:", event);
                      setIsDialogOpen(true);
                    }}
                  >
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">Featured Events</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <Card key={event._id.toString()} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-indigo-700">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-2 text-gray-600">
                    <Calendar className="mr-2 h-5 w-5" />
                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mb-2 text-gray-600">
                    <MapPin className="mr-2 h-5 w-5" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="mr-2 h-5 w-5" />
                    <span>{event.startTime}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsDialogOpen(true);
                    }}
                  >
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <EventDetailsDialog
        event={selectedEvent}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  )
}

