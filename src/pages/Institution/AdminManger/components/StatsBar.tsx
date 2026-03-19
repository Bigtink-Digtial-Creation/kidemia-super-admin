import type { InstitutionAdminListItem } from "../../../../sdk/generated";


interface StatsBarProps {
    institutions: InstitutionAdminListItem[];
}

export default function StatsBar({ institutions }: StatsBarProps) {
    const stats = [
        { label: "Total Institutions", value: institutions.length, color: '#f59e0b' },
        { label: "Public", value: institutions.filter(i => i.is_public).length, color: "#ef4444" },
        { label: "Verified", value: institutions.filter(i => i.is_verified).length, color: "#f59e0b" },
        { label: "Total Students", value: institutions.reduce((s, i) => s + i.total_students, 0).toLocaleString(), color: "#f59e0b" },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {stats.map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-800">{s.value}</p>
                        <p className="text-xs text-gray-500">{s.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}