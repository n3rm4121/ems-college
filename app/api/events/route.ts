import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/events";
import dbConnect from "@/lib/db";
import { getSession } from "next-auth/react";
import { auth } from "@/auth";
import User from "@/models/user";
export const POST = async (req: NextRequest, res: Response) => {
    const session = await auth();

    const userEmail = session?.user?.email;
    if (!userEmail) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { title, description, startDate, endDate, startTime, endTime, venue } = body;
    // get user name from email
    const organizer = await User.findOne({ email: userEmail })
    console.log("Organizer from create event api: ", organizer)
    console.log("Received event data:", title, description, startDate, endDate, startTime, endTime, venue);
    await Event.create({
        title,
        description,
        startDate,
        endDate,
        startTime,
        endTime,
        venue,
        organizer: organizer.email
    })
    // Save the event data to your database
    return NextResponse.json({ message: "Event created successfully" });
}


export const GET = async (req: NextRequest, res: Response) => {
    await dbConnect();
    const events = await Event.find();
    console.log(events);
    return NextResponse.json(events);
}