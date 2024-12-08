import mongoose, { ObjectId } from "mongoose";

export interface INotification extends mongoose.Document {
    message: string;
    user_id: ObjectId;
    status: string;
}

const NotificationSchema = new mongoose.Schema<INotification>({
    message: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['unread', 'read'], default: 'unread' }
});

export default mongoose.model<INotification>("Notification", NotificationSchema);