import dbConnect from "@/lib/db";
import Event from "@/models/events";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export const GET = async (req: NextApiRequest, res: NextResponse) => {
    await dbConnect()
    const unapprovedEvents = await Event.find({ status: 'pending' }).populate('organizer');
    return NextResponse.json({ data: unapprovedEvents }, { status: 200 });
}