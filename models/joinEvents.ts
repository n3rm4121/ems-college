import mongoose, { ObjectId, Schema, Document, Model } from "mongoose";

export interface IJoinEvent extends Document {
    event_id: ObjectId;
    attendees: string[];
}

const JoinEventSchema: Schema<IJoinEvent> = new Schema<IJoinEvent>({
    attendees: { type: [String], required: true, unique: true },
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
}, { timestamps: true });


const JoinEvent: Model<IJoinEvent> =
    mongoose.models.JoinEvent || mongoose.model<IJoinEvent>("JoinEvent", JoinEventSchema);


export default JoinEvent;