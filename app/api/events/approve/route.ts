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
    if (!isAdmin) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log("edited event: ", updatePayload);
    const getEvent = await Event.findById(updatePayload._id as string);
    if (!getEvent) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const edited = await Event
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
    return NextResponse.json({ data: edited });
}