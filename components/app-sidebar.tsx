"use client"

import { Calendar, Home, Users, FileCheck, BarChart, Settings } from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { CreateEvent } from './createEvent'

const items = [
    {
        title: "Dashboard",
        icon: Home,
        component: "Dashboard"
    },
    {
        title: "All Events",
        icon: Calendar,
        component: "AllEvents"
    },
    {
        title: "User Management",
        icon: Users,
        component: "UserManagement"
    },
    {
        title: "Analytics",
        icon: BarChart,
        component: "Analytics"
    },
    {
        title: "Settings",
        icon: Settings,
        component: "Settings"
    },
]

export function AppSidebar({ setActiveComponent, activeComponent }: { setActiveComponent: (component: string) => void, activeComponent: string }) {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <Dialog>
                        <DialogTrigger asChild><Button>Create New Event</Button></DialogTrigger>
                        <DialogContent>
                            <CreateEvent />
                        </DialogContent>
                    </Dialog>
                    <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        size='lg'
                                        onClick={() => setActiveComponent(item.component)}
                                        className={activeComponent === item.component ? "bg-primary text-primary-foreground hover:bg-primary" : "hover:bg-secondary"}
                                        aria-current={activeComponent === item.component ? "page" : undefined}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

