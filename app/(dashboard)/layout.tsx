"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { useState, useEffect } from 'react'
import { UserManagement } from "./components/user-management"
import { Settings } from "./components/settings"
import { Analytics } from "./components/analytics"
import AllEvents from "./components/all-events"
import Dashboard from "./components/dashboard"
import { useSession } from "next-auth/react"
import Unauthorized from "./components/unauthorized"
import Spinner from "@/components/Spinner"

export default function Layout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [activeComponent, setActiveComponent] = useState("Dashboard");

    const isAdmin = session?.user?.role === "admin";

    useEffect(() => {
        if (status !== "loading") {
            setIsLoading(false);
        }
    }, [status]);

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

    if (isLoading) {
        return (
            <Spinner />
        );
    }

    return (
        <>
            {!isAdmin ? <Unauthorized /> : (
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
            )}
        </>
    )
}
