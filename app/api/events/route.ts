import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Event from "@/models/events";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
    // update the incomming event data
    await dbConnect();
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session?.user?.email;
    const isAdmin = session.user?.role === "admin";

    const body = await req.json();
    const { updatePayload } = body;
    console.log("body ko: ", updatePayload)
    if (!isAdmin && updatePayload.organizer !== userEmail) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const event = await Event.findById(updatePayload._id as string);
    if (!event) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const updatedEvent = await Event
        .findByIdAndUpdate(updatePayload._id as string, {
            title: updatePayload.title,
            description: updatePayload.description,
            startDate: updatePayload.startDate,
            endDate: updatePayload.endDate,
            startTime: updatePayload.startTime,
            endTime: updatePayload.endTime,
            venue: updatePayload.venue,
            status: updatePayload.status,
        });
    return NextResponse.json({ data: updatedEvent });
}


export const DELETE = async (req: NextRequest) => {
    await dbConnect();
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session?.user?.email;
    const isAdmin = session.user?.role === "admin";
    // get eventId from query param
    const searchParams = req.nextUrl.searchParams;
    const eventId = searchParams.get("eventId");
    const event = await Event.findById(eventId);
    if (!event) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
    if (event.organizer !== userEmail && !isAdmin) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await Event.findByIdAndDelete(eventId);
    return NextResponse.json({ message: "Event deleted successfully" });
}




export async function GET() {
    await dbConnect();
    const events = await Event.find({});
    return NextResponse.json(events);
}

export async function POST(request: Request) {
    await dbConnect();
    const data = await request.json();
    const newEvent = new Event(data);
    await newEvent.save();
    return NextResponse.json(newEvent);
}
