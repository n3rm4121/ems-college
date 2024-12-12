import { ObjectId } from "mongoose";

export interface IEvent {
    _id?: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    venue: string;
    organizer: string;
    status: 'pending' | 'approved' | 'draft';
    images: string[];
    featured?: boolean;
}

export type EventFormData = Omit<IEvent, 'organizer' | 'status'>;

export interface StepInfo {
    title: string;
    fields: (keyof EventFormData)[];
}

