import { NextResponse } from "next/server";
import Event from "@/models/events";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";
import { NextApiRequest } from "next";

export async function GET(req: Request) {
    await dbConnect();

    try {
        const url = new URL(req.url);
        const event_id = url.searchParams.get("event_id");

        if (!event_id) {
            return NextResponse.json({ message: "Missing event_id" }, { status: 400 });
        }
        

        const isValidObjectId = require("mongoose").isValidObjectId;
        if (!isValidObjectId(event_id)) {
            return NextResponse.json({ message: "Invalid event_id format" }, { status: 400 });
        }

        const eventDetails = await Event.findById(event_id);
        if (!eventDetails) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: eventDetails }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
