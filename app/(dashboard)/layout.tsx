"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { useState } from 'react'
import { Dashboard } from "./components/dashboard"
import { UnapprovedEvents } from "./components/unapproved-events"

import { UserManagement } from "./components/user-management"
import { Settings } from "./components/settings"
import { Analytics } from "./components/analytics"
import AllEvents from "./components/all-events"

export default function Layout({ children }: { children: React.ReactNode }) {
    const [activeComponent, setActiveComponent] = useState("Dashboard")

    const renderComponent = () => {
        switch (activeComponent) {
            case "Dashboard":
                return <Dashboard />
            case "AllEvents":
                return <AllEvents />
            case "UserManagement":
                return <UserManagement />
            case "Analytics":
                return <Analytics />
            case "Settings":
                return <Settings />
            default:
                return <Dashboard />
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
            <SidebarInset>
                <main className="min-h-screen bg-background">
                    <div className="flex items-center h-16 px-4 border-b">
                        <SidebarTrigger />
                    </div>
                    <div className="p-6">
                        {renderComponent()}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

