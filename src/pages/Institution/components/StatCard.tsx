import { Users, LayoutGrid, GraduationCap, ClipboardList } from "lucide-react";

const iconMap: Record<string, any> = {
    Users,
    LayoutGrid,
    GraduationCap,
    ClipboardList,
};

export interface StatCardData {
    label: string;
    value: number | string;
    icon: string;
    color: string;
    change?: string;
}

export default function StatCard({ stat }: { stat: StatCardData }) {
    const Icon = iconMap[stat.icon];
    return (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow">
            <div
                className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: stat.color + "18" }}
            >
                {Icon && <Icon size={20} style={{ color: stat.color }} />}
            </div>
            <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</p>
                {stat.change && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: stat.color }}>
                        {stat.change}
                    </p>
                )}
            </div>
        </div>
    );
}