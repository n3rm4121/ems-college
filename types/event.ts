import { ObjectId } from "mongoose";

export interface IEvent {
    _id?: string;
    title: string;
    description: string;
    date: Date;
    startTime: string;
    endTime: string;
    startDate?: string;
    venue: string;
    endDate?: string
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

