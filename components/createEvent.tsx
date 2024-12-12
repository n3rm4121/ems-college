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

export const CreateEvent: React.FC = () => {
    const { formData, currentStep, updateFormData, nextStep, prevStep, isStepValid, submitForm } = useEventForm();

    const renderFormFields = () => {
        const currentFields = EVENT_STEPS[currentStep].fields;
        return currentFields.map((field) => {
            switch (field) {
                case "title":
                case "startTime":
                case "endTime":
                    return (
                        <Input
                            key={field}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
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
                case "startDate":
                case "endDate":
                    return (
                        <Input
                            key={field}
                            type="date"
                            value={formData[field].toISOString().split('T')[0]}
                            onChange={(e) => updateFormData(field, new Date(e.target.value))}
                            className="mb-4"
                        />
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
                    <Button onClick={submitForm} disabled={!isStepValid()}>
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

