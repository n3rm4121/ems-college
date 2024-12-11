'use client'
import { useState } from "react";
import { EventFormData } from "../types/event";
import { EVENT_STEPS } from "../constants/eventSteps";
import axios from 'axios'

const initialFormData: EventFormData = {
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    startTime: "",
    endTime: "",
    venue: "hall1",
};

export const useEventForm = () => {
    const [formData, setFormData] = useState<EventFormData>(initialFormData);
    const [currentStep, setCurrentStep] = useState(0);

    const updateFormData = (field: keyof EventFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (currentStep < EVENT_STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const isStepValid = () => {
        const currentFields = EVENT_STEPS[currentStep].fields;
        return currentFields.every((field) => formData[field] !== "");
    };

    const submitForm = async () => {
        // Here you would typically send the formData to your API
        console.log("Submitting form data:", formData);
        await axios.post('http://localhost:3000/api/events', formData)
        // Implement your API call here
    };

    return {
        formData,
        currentStep,
        updateFormData,
        nextStep,
        prevStep,
        isStepValid,
        submitForm,
    };
};
