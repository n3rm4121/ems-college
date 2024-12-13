'use client'

import { useState } from "react"
import { IEvent } from "@/types/event"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Edit2, Trash2, Check, X } from "lucide-react"

interface EventModalProps {
    event: IEvent
    onClose: () => void
    onUpdate: (updatedEvent: IEvent) => void
    onDelete: (eventId: string) => void
}

export default function EventModal({ event, onClose, onUpdate, onDelete }: EventModalProps) {
    const { data: session } = useSession()
    const { toast } = useToast()

    const isAdmin = session?.user?.role === 'admin';
    const isOrganizer = event.organizer === session?.user?.email;

    const [editedEvent, setEditedEvent] = useState<IEvent>(event)
    const [isEditing, setIsEditing] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEditedEvent(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setEditedEvent(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const updatePayload = {
                ...editedEvent,
                startDate: new Date(editedEvent.startDate),
            }

            const updatedEvent = await axios.put(`http://localhost:3000/api/events/`, { updatePayload }).then(res => res.data)
            console.log("updated event: ", updatedEvent)

            onUpdate(updatedEvent.data)

            setIsEditing(false)
            toast({
                title: "Event Updated",
                description: `Event "${updatedEvent.data.title}" has been successfully updated.`,
                variant: "default"
            })
            onClose()
        } catch (error) {
            console.error("Failed to update event:", error)
            toast({
                title: "Update Failed",
                description: "There was an error updating the event.",
                variant: "destructive"
            })
        }
    }

    const handleDelete = async () => {
        try {
            const eventId = event._id
            await axios.delete(`http://localhost:3000/api/events?eventId=${eventId}`)
            onDelete(event._id as string)
            toast({
                title: "Event Deleted",
                description: `Event "${event.title}" has been permanently deleted.`,
                variant: "destructive"
            })
            onClose()
        } catch (error) {
            console.error("Failed to delete event:", error)
            toast({
                title: "Deletion Failed",
                description: "There was an error deleting the event.",
                variant: "destructive"
            })
        }
    }

    const handleApprove = async () => {
        try {
            const updatePayload = {
                ...event,
                status: event.status === 'pending' ? 'approved' : 'pending'
            }

            const updatedEvent = await axios.put(`http://localhost:3000/api/events/approve`, { updatePayload }).then(res => res.data)

            onUpdate(updatedEvent.data)
            toast({
                title: "Event Status Changed",
                description: `Event "${updatedEvent.data.title}" status changed to ${updatedEvent.status}.`,
                variant: "default"
            })
            onClose()
        } catch (error) {
            console.error("Failed to change event status:", error)
            toast({
                title: "Status Change Failed",
                description: "There was an error changing the event status.",
                variant: "destructive"
            })
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]  rounded-xl shadow-2xl border-2 border-gray-100">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center">
                        <Calendar className="mr-3 text-blue-600" size={24} />
                        {isEditing ? "Edit Event" : "Event Details"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="title" className="text-right font-medium text-gray-700">Title</label>
                            <Input
                                id="title"
                                name="title"
                                value={editedEvent.title}
                                onChange={handleInputChange}
                                className="col-span-3 border-gray-300 focus:ring-2 focus:ring-blue-500"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="description" className="text-right font-medium text-gray-700">Description</label>
                            <Textarea
                                id="description"
                                name="description"
                                value={editedEvent.description}
                                onChange={handleInputChange}
                                className="col-span-3 border-gray-300 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="startDate" className="text-right font-medium text-gray-700">Start Date</label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={new Date(editedEvent.startDate).toISOString().split('T')[0]}
                                onChange={handleInputChange}
                                className="col-span-3 border-gray-300 focus:ring-2 focus:ring-blue-500"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="venue" className="text-right font-medium text-gray-700">Venue</label>
                            <Select
                                name="venue"
                                value={editedEvent.venue}
                                onValueChange={(value) => handleSelectChange("venue", value)}
                                disabled={!isEditing}
                            >
                                <SelectTrigger className="col-span-3 border-gray-300 focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Select a venue" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hall1">Hall 1</SelectItem>
                                    <SelectItem value="hall2">Hall 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="organizer" className="text-right font-medium text-gray-700">Organizer</label>
                            <Input
                                id="organizer"
                                name="organizer"
                                value={editedEvent.organizer}
                                onChange={handleInputChange}
                                className="col-span-3 border-gray-300 focus:ring-2 focus:ring-blue-500"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between items-center border-t pt-4">
                        <div className="flex space-x-2">
                            {(isAdmin || isOrganizer) && !isEditing && (
                                <Button
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit2 className="mr-2" size={16} /> Edit
                                </Button>
                            )}
                            {isEditing && (
                                <>
                                    <Button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white flex items-center"
                                    >
                                        <Check className="mr-2" size={16} /> Save Changes
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        <X className="mr-2" size={16} /> Cancel
                                    </Button>
                                </>
                            )}
                            {!isEditing && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                    onClick={onClose}
                                >
                                    Close
                                </Button>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            {isAdmin && !isEditing && (
                                <>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                className="bg-red-600 hover:bg-red-700 text-white flex items-center"
                                            >
                                                <Trash2 className="mr-2" size={16} /> Delete Event
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the event.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    {(event.status === "pending" || event.status === "approved") && (
                                        <Button
                                            onClick={handleApprove}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                                        >
                                            {event.status === 'pending' ? 'Approve Event' : 'Mark as Pending'}
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}