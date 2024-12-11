import Event, { IEvent } from "@/models/events";
import dbConnect from "@/lib/db"

export const getEventsFromDb = async (): Promise<IEvent[]> => {
    await dbConnect();
    console.log('inside getEventsFromDb')
    const events = await Event.find({}).sort({ startDate: 1 });
    console.log("events: ", events)
    return events;
}

export const getFeaturedEventsFromDb = async (): Promise<IEvent[]> => {
    await dbConnect();
    console.log('inside getFeaturedEventsFromDb')
    const featuredEvents = await Event.find({ featured: true }).sort({ startDate: 1 }).limit(3);
    console.log("featuredEvents: ", featuredEvents)
    return featuredEvents;
}

export const getUpcomingEventsFromDb = async (): Promise<IEvent[]> => {
    await dbConnect();
    console.log('inside getUpcomingEventsFromDb')
    const currentDate = new Date();
    const upcomingEvents = await Event.find({ startDate: { $gte: currentDate } }).sort({ startDate: 1 }).limit(3);
    console.log("upcomingEvents: ", upcomingEvents)
    return upcomingEvents;
}

