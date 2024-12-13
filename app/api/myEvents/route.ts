import { NextResponse } from "next/server";
import JoinEvent from "@/models/joinEvents";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {
    await dbConnect();

    // Cleanup invalid records before fetching
    await JoinEvent.deleteMany({ event_id: null });

    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session?.user?.email;

    // Fetch only valid joined events
    const joinedEvents = await JoinEvent.find({
        attendees: userEmail,
        event_id: { $exists: true, $ne: null }
    }).populate("event_id");

    console.log("joinedEvents", joinedEvents);

    // if (!joinedEvents.length) {
    //     return NextResponse.json({ message: "No events found" }, { status: 404 });
    // }

    return NextResponse.json({ joinedEvents }, { status: 200 });
}
