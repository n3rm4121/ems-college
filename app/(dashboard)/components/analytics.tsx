"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const monthlyEventData = [
    { name: "Jan", total: 5 },
    { name: "Feb", total: 8 },
    { name: "Mar", total: 13 },
    { name: "Apr", total: 10 },
    { name: "May", total: 16 },
    { name: "Jun", total: 20 },
]

const userGrowthData = [
    { name: "Week 1", users: 100 },
    { name: "Week 2", users: 150 },
    { name: "Week 3", users: 200 },
    { name: "Week 4", users: 280 },
    { name: "Week 5", users: 350 },
    { name: "Week 6", users: 450 },
]

export function Analytics() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Analytics</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Events</CardTitle>
                        <CardDescription>Number of events per month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={monthlyEventData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>Weekly user registration trend</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={userGrowthData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

