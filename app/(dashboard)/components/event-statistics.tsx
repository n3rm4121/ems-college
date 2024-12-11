"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
    {
        name: "Jan",
        total: 5,
    },
    {
        name: "Feb",
        total: 8,
    },
    {
        name: "Mar",
        total: 13,
    },
    {
        name: "Apr",
        total: 10,
    },
    {
        name: "May",
        total: 16,
    },
    {
        name: "Jun",
        total: 20,
    },
]

export function EventStatistics() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}

