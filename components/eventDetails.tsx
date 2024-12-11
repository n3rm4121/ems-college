'use client'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, User } from 'lucide-react'
import { IEvent } from "@/models/events";

interface EventDetailsProps {
  event: IEvent;
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img className="h-48 w-full object-cover md:w-48" src="/placeholder.svg?height=400&width=400" alt={event.title} />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{event.venue === 'hall1' ? 'Hall 1' : 'Hall 2'}</div>
          <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">{event.title}</h1>
          <Badge className="mt-2" variant={event.status === 'approved' ? 'default' : 'secondary'}>{event.status}</Badge>

          <p className="mt-4 max-w-2xl text-xl text-gray-500">{event.description}</p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-gray-400" />
              <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
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

          <div className="mt-8">
            <Button size="lg">Join Event</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

