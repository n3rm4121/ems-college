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


const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

export default Event;
