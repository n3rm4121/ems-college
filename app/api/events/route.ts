import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/events";
import dbConnect from "@/lib/db";
export const POST = async (req: NextRequest, res: Response) => {
    await dbConnect();
    const body = await req.json();
    const { title, description, startDate, endDate, startTime, endTime, venue } = body;
    console.log("Received event data:", title, description, startDate, endDate, startTime, endTime, venue);
    await Event.create({
        title,
        description,
        startDate,
        endDate,
        startTime,
        endTime,
        venue,
    })
    // Save the event data to your database
    return NextResponse.json({ message: "Event created successfully" });
}