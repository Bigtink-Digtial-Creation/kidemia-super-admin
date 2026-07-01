import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
    label?: string;
    value?: number | string;
    icon?: LucideIcon;
    color?: string;
    isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    color = 'text-slate-900',
    isLoading = false,
}) => {
    return (
        // shrink-0 prevents the card from squishing; snap-start makes scrolling feel smooth
        <div className="shrink-0 snap-start min-w-[240px] sm:min-w-0 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-sm font-medium text-slate-500 block mb-1">{label}</span>
            {isLoading ? (
                <span className="block h-8 w-16 bg-slate-100 rounded animate-pulse" />
            ) : (
                <span className={`text-3xl font-bold tracking-tight ${color}`}>
                    {value}
                </span>
            )}
        </div>
    );
};