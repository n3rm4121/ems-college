import mongoose, { ObjectId } from "mongoose";

export interface IEvent extends mongoose.Document {
    title: string;
    description: string;
    start_date: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    venue: string;
    organizer_id: ObjectId;
    status: string;
}


const EventSchema = new mongoose.Schema<IEvent>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    start_date: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    venue: { type: String, enum: ['hall1', 'hall2'], required: true },
    organizer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved'], default: 'draft' }
});

export default mongoose.model<IEvent>("Event", EventSchema);