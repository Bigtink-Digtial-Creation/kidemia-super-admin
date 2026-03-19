import {
    ClipboardList, Upload,
    ArrowRightLeft, UserPlus, FileText,
} from "lucide-react";
import {
    ResponsiveContainer, LineChart, Line,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import type { ModalType } from "./components/modals";
import StatCard, { type StatCardData } from "./components/StatCard";
import { Badge } from "./components";
import { formatDateToDDMMYYYY } from "../../utils";
import {
    useInstitutionStats,
    useScoreTrend,
    useClassroomPerformanceOverview,
} from "../../hooks/useSchools";

function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-center gap-4 animate-pulse">
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0" />
            <div className="space-y-2 flex-1">
                <div className="h-6 bg-gray-100 rounded w-16" />
                <div className="h-3 bg-gray-100 rounded w-24" />
                <div className="h-3 bg-gray-100 rounded w-20" />
            </div>
        </div>
    );
}

function ChartSkeleton() {
    return (
        <div className="h-[180px] flex flex-col justify-end gap-1 px-2 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-gray-100 rounded"
                    style={{ height: `${20 + i * 15}%` }}
                />
            ))}
        </div>
    );
}

interface OverviewProps {
    onModal: (m: ModalType) => void;
}

export function OverviewView({ onModal }: OverviewProps) {
    const { data: stats, isLoading, isError } = useInstitutionStats();
    const { data: scoreTrend, isLoading: trendLoading } = useScoreTrend();
    const { data: classPerformance, isLoading: classLoading } =
        useClassroomPerformanceOverview();

    const statCards: StatCardData[] = stats
        ? [
            {
                label: "Total Students",
                value: stats.total_students,
                icon: "Users",
                color: "#e07b39",
                change: `${stats.active_students} active`,
            },
            {
                label: "Classrooms",
                value: stats.total_classrooms,
                icon: "LayoutGrid",
                color: "#6366f1",
            },
            {
                label: "Teachers",
                value: stats.total_teachers,
                icon: "GraduationCap",
                color: "#10b981",
            },
            {
                label: "Assessments Assigned",
                value: stats.total_assessments_assigned,
                icon: "ClipboardList",
                color: "#f59e0b",
            },
        ]
        : [];

    // Compute a trend label from score trend data
    const trendLabel = (() => {
        if (!scoreTrend || scoreTrend.length < 2) return null;
        const last = scoreTrend[scoreTrend.length - 1];
        const prev = scoreTrend[scoreTrend.length - 2];
        const diff = last.avg_score - prev.avg_score;
        if (Math.abs(diff) < 1) return null;
        return {
            text: `${diff > 0 ? "+" : ""}${diff.toFixed(1)}pts vs last month`,
            positive: diff > 0,
        };
    })();

    // Top and bottom classroom for quick insight
    const sortedClassrooms = classPerformance
        ? [...classPerformance].sort((a, b) => b.avg_score - a.avg_score)
        : [];

    return (
        <div className="space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <StatCardSkeleton key={i} />
                    ))
                    : isError
                        ? (
                            <p className="col-span-4 text-sm text-red-500">
                                Failed to load stats.
                            </p>
                        )
                        : statCards.map((s) => <StatCard key={s.label} stat={s} />)}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                    {[
                        { label: "Bulk Onboard", icon: Upload, action: () => onModal("bulk") },
                        {
                            label: "Move Students",
                            icon: ArrowRightLeft,
                            action: () => onModal("move"),
                        },
                        {
                            label: "Assign Assessment",
                            icon: ClipboardList,
                            action: () => onModal("assign"),
                        },
                        {
                            label: "Add Teacher",
                            icon: UserPlus,
                            action: () => onModal("addTeacher"),
                        },
                        {
                            label: "Report Cards",
                            icon: FileText,
                            action: () => onModal("report"),
                        },
                    ].map(({ label, icon: Icon, action }) => (
                        <button
                            key={label}
                            onClick={action}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-700 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all"
                        >
                            <Icon size={14} className="flex-shrink-0" />
                            <span className="truncate">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Score trend */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                            Avg Score Trend
                        </h3>
                        {trendLabel && (
                            <span
                                className={`text-xs px-2 py-1 rounded-lg font-medium ${trendLabel.positive
                                    ? "text-green-600 bg-green-50"
                                    : "text-red-500 bg-red-50"
                                    }`}
                            >
                                {trendLabel.text}
                            </span>
                        )}
                        {stats?.avg_score_across_institution != null &&
                            !trendLabel && (
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                    Avg: {stats.avg_score_across_institution}%
                                </span>
                            )}
                    </div>
                    {trendLoading ? (
                        <ChartSkeleton />
                    ) : !scoreTrend?.length ? (
                        <div className="h-[180px] flex flex-col items-center justify-center gap-2 text-sm text-gray-400">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                <ClipboardList size={18} className="text-gray-300" />
                            </div>
                            No assessment data yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <LineChart data={scoreTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="period"
                                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                                    domain={[0, 100]}
                                    width={32}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: "none",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                    }}
                                    formatter={(value?: number, name?: string) => [
                                        `${value ?? 0}%`,
                                        name === "avg_score" ? "Avg Score" : "Pass Rate",
                                    ] as [string, "Avg Score" | "Pass Rate"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="avg_score"
                                    stroke="#e07b39"
                                    strokeWidth={2.5}
                                    dot={{ fill: "#e07b39", r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="pass_rate"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Class performance */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                            Class Performance
                        </h3>
                        {sortedClassrooms.length > 0 && (
                            <span className="text-xs text-gray-400">
                                {sortedClassrooms.length} classes
                            </span>
                        )}
                    </div>
                    {classLoading ? (
                        <ChartSkeleton />
                    ) : !classPerformance?.length ? (
                        <div className="h-[180px] flex flex-col items-center justify-center gap-2 text-sm text-gray-400">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                <UserPlus size={18} className="text-gray-300" />
                            </div>
                            No classroom data yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={classPerformance} barSize={20}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="classroom_name"
                                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                                    domain={[0, 100]}
                                    width={32}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: "none",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                    }}
                                    formatter={(value?: number) => [`${value ?? 0}%`, "Avg Score"] as [string, "Avg Score"]}
                                />
                                <Bar
                                    dataKey="avg_score"
                                    fill="#e07b39"
                                    radius={[6, 6, 0, 0]}
                                    name="Avg Score"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Class quick-insight strip — only when data exists */}
            {sortedClassrooms.length > 1 && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-green-600">↑</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-green-500 font-medium">Top class</p>
                            <p className="font-bold text-green-800 truncate">
                                {sortedClassrooms[0].classroom_name}
                            </p>
                            <p className="text-xs text-green-600">
                                {sortedClassrooms[0].avg_score}% avg ·{" "}
                                {sortedClassrooms[0].pass_rate}% pass
                            </p>
                        </div>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-red-500">↓</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-red-400 font-medium">Needs attention</p>
                            <p className="font-bold text-red-800 truncate">
                                {sortedClassrooms[sortedClassrooms.length - 1].classroom_name}
                            </p>
                            <p className="text-xs text-red-500">
                                {sortedClassrooms[sortedClassrooms.length - 1].avg_score}% avg ·{" "}
                                {sortedClassrooms[sortedClassrooms.length - 1].pass_rate}% pass
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent activity */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                        Recent Activity
                    </h3>
                </div>
                {isLoading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : !stats?.recent_activity?.length ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                            <ClipboardList size={18} className="text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400">No recent activity yet</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {stats.recent_activity.map((activity: any, i: number) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                    <ClipboardList size={13} className="text-orange-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 truncate">
                                        {activity.description}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {formatDateToDDMMYYYY(activity.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent students */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                        Recent Students
                    </h3>
                    <button className="text-xs text-orange-500 font-medium hover:underline">
                        View all
                    </button>
                </div>
                {isLoading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : !stats?.recent_students?.length ? (
                    <p className="text-sm text-gray-400 text-center py-6">
                        No students enrolled yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="w-full text-xs sm:text-sm min-w-[480px] sm:min-w-0">
                            <thead>
                                <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
                                    <th className="pb-3 font-medium px-4 sm:px-0">Student</th>
                                    <th className="pb-3 font-medium hidden sm:table-cell">
                                        Code
                                    </th>
                                    <th className="pb-3 font-medium">Class</th>
                                    <th className="pb-3 font-medium">Joined</th>
                                    <th className="pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.recent_students.map((s: any) => (
                                    <tr
                                        key={s.code}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-3 font-medium text-gray-800 px-4 sm:px-0">
                                            {s.name}
                                        </td>
                                        <td className="py-3 text-gray-400 hidden sm:table-cell">
                                            {s.code}
                                        </td>
                                        <td className="py-3 text-gray-600">
                                            {s.class ?? (
                                                <span className="text-gray-300 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="py-3 text-gray-500">
                                            {formatDateToDDMMYYYY(s.created_at)}
                                        </td>
                                        <td className="py-3">
                                            <Badge variant={s.status ? "green" : "red"}>
                                                {s.status ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}