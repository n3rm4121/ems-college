import { NextResponse } from "next/server";
import JoinEvent from "@/models/joinEvents";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {
    await dbConnect();
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session?.user?.email;
    const joinedEvents = await JoinEvent.find({ attendees: userEmail })
        .populate("event_id"); 

    if (joinedEvents.length === 0) {
        return NextResponse.json({ message: "No events found" }, { status: 404 });
    }

    return NextResponse.json({ joinedEvents }, { status: 200 });
}

