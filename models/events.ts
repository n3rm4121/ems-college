import mongoose from 'mongoose';
import JoinEvent from './joinEvents';

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

// Add pre-hook to delete related JoinEvent documents when an event is deleted
EventSchema.pre('deleteOne', { document: true }, async function(next) {
    try {
        const eventId = this._id;  // Get the ID of the event being deleted
        await JoinEvent.deleteMany({ event_id: eventId });  // Remove JoinEvent records with this event_id
        next();
    } catch (err: unknown) {
        console.log(err)    }
});

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

export default Event;
