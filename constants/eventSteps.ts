import { StepInfo } from "../types/event";

export const EVENT_STEPS: StepInfo[] = [
    {
        title: "Basic Information",
        fields: ["title", "description"],
    },
    {
        title: "Date and Time",
        fields: ["startDate", "endDate", "startTime", "endTime"],
    },
    {
        title: "Venue",
        fields: ["venue"],
    },
];

