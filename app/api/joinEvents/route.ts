import { NextResponse } from "next/server";
import JoinEvent from "@/models/joinEvents";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";
import { NextApiRequest } from "next";
import mongoose from "mongoose";

const { ObjectId } = require('mongodb');

// POST: Add an attendee to an event
export async function POST(req: Request) {
    await dbConnect();

    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userEmail = session?.user?.email

    try {
        const body = await req.json();
        const { event_id } = body;
        console.log('event_id from post joinEvents', event_id);

        // if (!event_id) {
        //     return NextResponse.json({ message: "Missing event_id" }, { status: 400 });
        // }

        // convert event_id to ObjectId
        const objectIdEventId = new ObjectId(event_id);
        const documentAlreadyExists = await JoinEvent.findOne({ event_id: objectIdEventId });
        if (!documentAlreadyExists) {
            console.log("aaile samma bane xaina so banaudai", event_id)
            const newDocument = await JoinEvent.create({
                event_id: objectIdEventId,
                attendees: [userEmail]
            })
            console.log(
                "new joined ", newDocument
            )
        } else {
            console.log("bane sakexa", event_id)
            const join = await JoinEvent.findOneAndUpdate(
                { event_id },
                { $push: { attendees: userEmail } },
                { new: true, upsert: true }
            );
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.log('error: ', error)
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}


// DELETE: Withdraw from an event
export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userEmail = session?.user?.email;
        const url = new URL(req.url);
        const event_id = url.searchParams.get("event_id");

        const attendee_id = userEmail;

        if (!event_id || !attendee_id) {
            return NextResponse.json({ message: "Missing event_id or attendee_id" }, { status: 400 });
        }

        const result = await JoinEvent.findOneAndUpdate(
            { event_id },
            { $pull: { attendees: attendee_id } },
            { new: true }
        );

        if (!result) {
            console.log('Event or Attendee not found');
            return NextResponse.json({ message: "Event or Attendee not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}


// GET: Retrieve attendees for a specific event
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const event_id = url.searchParams.get("event_id");
        console.log('event_id from get joinEvents', event_id);

        if (!event_id) {
            return NextResponse.json({ message: "Missing event_id" }, { status: 400 });
        }

        const attendees = await JoinEvent.findOne({ event_id }).populate("attendees");
        console.log('attendees from get joinEvents', attendees);

        if (!attendees) {
            return NextResponse.json({ message: "No attendees found for this event" }, { status: 200 });
        }

        return NextResponse.json({ success: true, data: attendees }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}


