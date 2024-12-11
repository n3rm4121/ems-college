import { ObjectId } from "mongoose";

export interface IEvent {
    _id?: ObjectId;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    venue: 'hall1' | 'hall2';
    organizer_id: ObjectId;
    status: 'pending' | 'approved' | 'draft';
}

export type EventFormData = Omit<IEvent, 'organizer_id' | 'status'>;

export interface StepInfo {
    title: string;
    fields: (keyof EventFormData)[];
}

