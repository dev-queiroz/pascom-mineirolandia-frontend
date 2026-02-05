import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: string;
}

export function StatCard({ title, value, icon, color = 'blue' }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
                    <p className={`text-3xl font-bold mt-1 text-${color}-600 dark:text-${color}-400`}>{value}</p>
                </div>
                <div className={`text-${color}-500 dark:text-${color}-400 text-4xl opacity-80`}>{icon}</div>
            </div>
        </div>
    );
}