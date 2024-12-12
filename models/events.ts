// import mongoose, { ObjectId, Schema, Document, Model } from "mongoose";

// export interface IEvent extends Document {
//     title: string;
//     description: string;
//     images: string[];
//     startDate: Date;
//     endDate: Date;
//     startTime: string;
//     endTime: string;
//     venue: "hall1" | "hall2";
//     featured: boolean;
//     organizer: string;
//     status: "pending" | "approved";
// }

// const EventSchema: Schema<IEvent> = new Schema<IEvent>({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     images: { type: [String], required: true },
//     startDate: { type: Date, required: true },
//     endDate: { type: Date, required: true },
//     startTime: { type: String, required: true },
//     endTime: { type: String, required: true },
//     featured: { type: Boolean, default: false },
//     venue: { type: String, enum: ["hall1", "hall2"], required: true },
//     organizer: { type: String, required: true },
//     status: { type: String, enum: ["pending", "approved"], default: "pending" },
// });

// const Event: Model<IEvent> =
//     mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

// export default Event;



import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    venue: { type: String, required: true },
    description: { type: String },
    color: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
});

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);


export default Event;
