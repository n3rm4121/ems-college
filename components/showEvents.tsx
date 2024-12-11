'use client'
import { Carousel } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search, Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'
// import { EventDetails } from "@/components/EventDetails"
import { IEvent } from "@/models/events"
import { EventDetails } from "./eventDetails"
import { useEffect, useState } from "react"
import axios from 'axios'
const eventCategories = [
  { name: 'Academic', icon: '🎓', color: 'bg-blue-500' },
  { name: 'Cultural', icon: '🎭', color: 'bg-purple-500' },
  { name: 'Sports', icon: '🏅', color: 'bg-green-500' },
  { name: 'Technology', icon: '💻', color: 'bg-red-500' },
]

export default function ShowEvents() {
  // const featuredEvents = await getFeaturedEventsFromDb();
  // const upcomingEvents = await getUpcomingEventsFromDb();
  const [allEvents, setAllEvents] = useState<IEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);
  useEffect(() => {
    const fetchAllEvents = async () => {
      const res = await axios.get('http://localhost:3000/api/events');
      setAllEvents(res.data);
      console.log(res)

    }
    fetchAllEvents();
    const fetchUpcomingEvents = async () => {
      const res = await axios.get('http://localhost:3000/api/events/upcoming');
      (res.data);
      console.log(res)
      setUpcomingEvents(res.data);

    }
    fetchUpcomingEvents();

  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center">College Event Management System</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-16">
          {/* <Carousel className="rounded-xl overflow-hidden shadow-2xl">
            {featuredEvents.map((event) => (
              <div key={event.id.toString()} className="relative h-[500px]">
                <img src={event.images[0] || '/placeholder.svg?height=600&width=1200'} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-8">
                  <h2 className="text-5xl font-bold text-white text-center mb-4">{event.title}</h2>
                  <p className="text-2xl text-white mb-8">{new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-100">Learn More</Button>
                </div>
              </div>
            ))}
          </Carousel> */}
        </section>

        <section className="mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">Find Your Next Event</h2>
            <div className="flex shadow-lg rounded-full overflow-hidden">
              <Input placeholder="Search events..." className="rounded-r-none border-0 text-lg py-6 px-6 flex-grow" />
              <Button className="rounded-l-none px-8 bg-indigo-600 hover:bg-indigo-700">
                <Search className="mr-2" /> Search
              </Button>
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
            {/* {upcomingEvents.map((event) => (
              <Card key={event.id.toString()} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
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
                  <Link href={`/events/${event._id}`} className="w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))} */}
          </div>
        </section>

        {allEvents.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">Featured Event Details</h2>
            <h1>Event Details</h1>
            <div className="grid md:grid-cols-3 gap-8">
              {allEvents.map((event) => (
                <EventDetails key={event._id as string} event={event} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-indigo-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h3 className="text-2xl font-semibold mb-4">College Event Management System</h3>
              <p className="text-indigo-200">Your one-stop platform for all college events and activities.</p>
            </div>
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-indigo-200 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-indigo-200 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="text-indigo-200 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/privacy" className="text-indigo-200 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-xl font-semibold mb-4">Stay Connected</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-indigo-200 hover:text-white transition-colors text-2xl" aria-label="Facebook">📘</a>
                <a href="#" className="text-indigo-200 hover:text-white transition-colors text-2xl" aria-label="Twitter">🐦</a>
                <a href="#" className="text-indigo-200 hover:text-white transition-colors text-2xl" aria-label="Instagram">📷</a>
                <a href="#" className="text-indigo-200 hover:text-white transition-colors text-2xl" aria-label="LinkedIn">🔗</a>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center text-indigo-200">
            <p>&copy; 2024 College Event Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

