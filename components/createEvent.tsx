'use client'
import React from "react";
import { EVENT_STEPS } from "../constants/eventSteps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEventForm } from "@/hooks/useEventForm";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";

interface CreateEventProps {
    onClose: () => void;
}

export const CreateEvent: React.FC<CreateEventProps> = ({ onClose }) => {
    const { formData, currentStep, updateFormData, nextStep, prevStep, isStepValid, submitForm } = useEventForm();

    const handleSubmit = async () => {
        await submitForm();
        onClose();
    }

    const renderFormFields = () => {
        const currentFields = EVENT_STEPS[currentStep].fields;
        return currentFields.map((field) => {
            switch (field) {
                case "title":
                    return (
                        <Input
                            key={field}
                            placeholder="Event Title"
                            value={formData[field]}
                            onChange={(e) => updateFormData(field, e.target.value)}
                            className="mb-4"
                        />
                    );
                case "description":
                    return (
                        <Textarea
                            key={field}
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => updateFormData("description", e.target.value)}
                            className="mb-4"
                        />
                    );
                case "date":
                    return (
                        <Popover key={field}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={`w-full justify-start text-left font-normal mb-4 ${!formData.date && "text-muted-foreground"
                                        }`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formData.date}
                                    onSelect={(date) => updateFormData("date", date)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    );
                case "startTime":
                case "endTime":
                    return (
                        <div key={field} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field === "startTime" ? "Start Time" : "End Time"}
                            </label>
                            <Select onValueChange={(value) => updateFormData(field, value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 11 }, (_, i) => i + 7).map((hour) => (
                                        <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                                            {`${hour === 12 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    );
                case "venue":
                    return (
                        <Select key={field} onValueChange={(value) => updateFormData("venue", value)}>
                            <SelectTrigger className="mb-4">
                                <SelectValue placeholder="Select venue" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hall1">Hall 1</SelectItem>
                                <SelectItem value="hall2">Hall 2</SelectItem>
                            </SelectContent>
                        </Select>
                    );
                default:
                    return null;
            }
        });
    };

    return (
        <Card className="w-full max-w-lg border-none mx-auto">
            <CardHeader>
                <CardTitle>{EVENT_STEPS[currentStep].title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Progress value={(currentStep + 1) / EVENT_STEPS.length * 100} className="mb-4" />
                {renderFormFields()}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={prevStep} disabled={currentStep === 0}>
                    Previous
                </Button>
                {currentStep === EVENT_STEPS.length - 1 ? (
                    <Button onClick={handleSubmit} disabled={!isStepValid()}>
                        Submit
                    </Button>
                ) : (
                    <Button onClick={nextStep} disabled={!isStepValid()}>
                        Next
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

