import { useState } from "react";
import { FileText, TrendingUp } from "lucide-react";
import {
    ResponsiveContainer, LineChart, Line,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { type ModalType } from "./components/modals";
import { Badge } from "./components";
import {
    useInstitutionAnalytics,
    useClassroomAnalytics,
    useClassrooms,
} from "../../hooks/useSchools";

interface AnalyticsViewProps {
    onModal: (m: ModalType) => void;
}

export function AnalyticsView({ onModal }: AnalyticsViewProps) {
    const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);

    const { data: analytics, isLoading } = useInstitutionAnalytics();
    const { data: classrooms } = useClassrooms();
    const { data: classroomDetail, isLoading: classroomLoading } =
        useClassroomAnalytics(selectedClassroomId);

    const trendColor = (trend: string) =>
        trend === "improving" ? "green" : trend === "declining" ? "red" : "gray";

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Analytics & Reports
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                    Performance insights across the institution
                </p>
            </div>

            {/* Institution summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse h-20"
                        />
                    ))
                    : [
                        {
                            label: "School Average",
                            value: `${analytics?.overall_avg_score ?? "—"}%`,
                            sub: `${analytics?.overall_pass_rate ?? "—"}% pass rate`,
                            color: "text-orange-500",
                        },
                        {
                            label: "Completion Rate",
                            value: `${analytics?.overall_completion_rate ?? "—"}%`,
                            sub: `${analytics?.total_assessments_assigned ?? 0} assigned`,
                            color: "text-blue-500",
                        },
                        {
                            label: "Top Classroom",
                            value: analytics?.top_classrooms?.[0]?.classroom_name ?? "—",
                            sub: `${analytics?.top_classrooms?.[0]?.avg_score ?? "—"}% avg`,
                            color: "text-green-600",
                        },
                        {
                            label: "Needs Attention",
                            value: analytics?.struggling_classrooms?.[0]?.classroom_name ?? "—",
                            sub: `${analytics?.struggling_classrooms?.[0]?.avg_score ?? "—"}% avg`,
                            color: "text-red-500",
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                        >
                            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                            <p className={`text-lg font-bold ${s.color} truncate`}>{s.value}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                        </div>
                    ))}
            </div>

            {/* Score trend + classroom comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                            Score Trend (6 months)
                        </h3>
                        <TrendingUp size={16} className="text-orange-400" />
                    </div>
                    {!analytics?.score_trend?.length ? (
                        <div className="h-[180px] flex items-center justify-center text-sm text-gray-400">
                            No trend data yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <LineChart data={analytics.score_trend}>
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
                                />
                                <Line
                                    type="monotone"
                                    dataKey="avg_score"
                                    stroke="#e07b39"
                                    strokeWidth={2.5}
                                    dot={{ fill: "#e07b39", r: 4 }}
                                    name="Avg Score"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="pass_rate"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    dot={false}
                                    name="Pass Rate"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-4">
                        Classroom Comparison
                    </h3>
                    {!analytics?.classroom_comparison?.length ? (
                        <div className="h-[180px] flex items-center justify-center text-sm text-gray-400">
                            No classroom data yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart
                                data={analytics.classroom_comparison}
                                barSize={20}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
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

            {/* Group performance */}
            {!!analytics?.group_performance?.length && (
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-4">
                        Student Group Performance
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                                    <th className="px-4 py-3 font-medium">Group</th>
                                    <th className="px-4 py-3 font-medium">Classroom</th>
                                    <th className="px-4 py-3 font-medium">Members</th>
                                    <th className="px-4 py-3 font-medium">Avg Score</th>
                                    <th className="px-4 py-3 font-medium">Pass Rate</th>
                                    <th className="px-4 py-3 font-medium">Completed</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {analytics.group_performance.map((g) => (
                                    <tr key={g.group_id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {g.group_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {g.classroom_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{g.total_members}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`font-semibold ${g.avg_score >= 75
                                                    ? "text-green-600"
                                                    : g.avg_score >= 60
                                                        ? "text-orange-500"
                                                        : "text-red-500"
                                                    }`}
                                            >
                                                {g.avg_score}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{g.pass_rate}%</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {g.assessments_completed}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Classroom drill-down */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                        Classroom Drill-Down
                    </h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {classrooms?.map((c) => (
                        <button
                            key={c.id}
                            onClick={() =>
                                setSelectedClassroomId((prev) =>
                                    prev === c.id ? null : c.id
                                )
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${selectedClassroomId === c.id
                                ? "border-orange-300 bg-orange-50 text-orange-700"
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                                }`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                {selectedClassroomId && (
                    classroomLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : classroomDetail ? (
                        <div className="space-y-4">
                            {/* Classroom summary row */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Avg Score", value: `${classroomDetail.avg_score}%` },
                                    { label: "Pass Rate", value: `${classroomDetail.pass_rate}%` },
                                    {
                                        label: "Completion",
                                        value: `${classroomDetail.completion_rate}%`,
                                    },
                                ].map((s) => (
                                    <div
                                        key={s.label}
                                        className="bg-gray-50 rounded-xl p-3 text-center"
                                    >
                                        <p className="text-lg font-bold text-gray-800">{s.value}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Top performers + needs support */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                        Top Performers
                                    </p>
                                    <div className="space-y-2">
                                        {classroomDetail.top_performers.map((s, i) => (
                                            <div
                                                key={s.student_id}
                                                className="flex items-center gap-3 p-2.5 rounded-xl bg-green-50"
                                            >
                                                <span className="text-xs font-bold text-green-600 w-5">
                                                    #{i + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">
                                                        {s.student_name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {s.completed_assessments}/{s.total_assessments} done
                                                    </p>
                                                </div>
                                                <span className="text-sm font-bold text-green-600">
                                                    {s.avg_score}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                        Needs Support
                                    </p>
                                    <div className="space-y-2">
                                        {classroomDetail.needs_support.map((s) => (
                                            <div
                                                key={s.student_id}
                                                className="flex items-center gap-3 p-2.5 rounded-xl bg-red-50"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">
                                                        {s.student_name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {s.completed_assessments}/{s.total_assessments} done
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-sm font-bold text-red-500">
                                                        {s.avg_score}%
                                                    </p>
                                                    <Badge variant={trendColor(s.trend) as any}>
                                                        {s.trend}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Difficult topics */}
                            {!!classroomDetail.most_difficult_topics.length && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                        Most Difficult Questions
                                    </p>
                                    <div className="space-y-1.5">
                                        {classroomDetail.most_difficult_topics.map((q) => (
                                            <div
                                                key={q.question_id}
                                                className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-700 truncate">
                                                        {q.question_text}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {q.total_answers} answers
                                                    </p>
                                                </div>
                                                <span
                                                    className={`text-xs font-bold flex-shrink-0 ${q.correct_rate < 40
                                                        ? "text-red-500"
                                                        : q.correct_rate < 60
                                                            ? "text-orange-500"
                                                            : "text-green-600"
                                                        }`}
                                                >
                                                    {q.correct_rate}% correct
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null
                )}
            </div>

            {/* Report cards */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                        Report Cards
                    </h3>
                    <button
                        onClick={() => onModal("report")}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl
                        bg-kidemia-secondary text-xs sm:text-sm font-medium text-white"

                    >
                        <FileText size={13} /> Generate Bulk
                    </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mb-4">
                    Generate individual or bulk report cards. Individual cards can be
                    accessed from the Students view.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { label: "All Students", sub: "Full institution report" },
                        { label: "By Classroom", sub: "Filter by class" },
                        { label: "By Group", sub: "Filter by student group" },
                    ].map((opt) => (
                        <button
                            key={opt.label}
                            onClick={() => onModal("report")}
                            className="p-3 sm:p-4 rounded-xl border border-gray-200 text-sm text-gray-700 hover:border-orange-300 hover:bg-orange-50 transition-all text-left"
                        >
                            <FileText size={16} className="text-orange-400 mb-2" />
                            <p className="font-medium text-sm">{opt.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}