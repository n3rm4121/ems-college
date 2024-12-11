import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: Response) => {
    return NextResponse.json({ message: "Event created successfully" });
}