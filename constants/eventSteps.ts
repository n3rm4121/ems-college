import { StepInfo } from "../types/event";

export const EVENT_STEPS: StepInfo[] = [
    {
        title: "Basic Information",
        fields: ["title", "description"],
    },
    {
        title: "Date & Time",
        fields: ["date", "startTime", "endTime"],
    },
    {
        title: "Venue",
        fields: ["venue"],
    },
];

