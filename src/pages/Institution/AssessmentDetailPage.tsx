import { useParams, useNavigate } from "react-router";
import {
    ArrowLeft, Users, CheckCircle, Clock,
    AlertCircle, BookOpen, BarChart2,
} from "lucide-react";
import {
    ResponsiveContainer, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { useAssessmentDetail } from "../../hooks/useSchools";
import { useInstitution } from "../../context/InstitutionContext";
import { Badge } from "./components";

const STATUS_CONFIG: Record<string, {
    label: string;
    variant: "green" | "orange" | "blue" | "gray" | "red";
    icon: typeof CheckCircle;
}> = {
    graded: { label: "Graded", variant: "green", icon: CheckCircle },
    submitted: { label: "Submitted", variant: "blue", icon: CheckCircle },
    in_progress: { label: "In Progress", variant: "orange", icon: Clock },
    not_started: { label: "Not Started", variant: "gray", icon: Users },
    overdue: { label: "Overdue", variant: "red", icon: AlertCircle },
};

function StatBox({
    label,
    value,
    sub,
    color = "text-gray-800",
}: {
    label: string;
    value: string | number;
    sub?: string;
    color?: string;
}) {
    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    );
}

function RowSkeleton() {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
                <td key={i} className="px-5 py-3.5">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );
}

export default function AssessmentDetailPage() {
    const { assessmentId } = useParams<{ assessmentId: string }>();
    const { institutionId } = useInstitution();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useAssessmentDetail(assessmentId ?? null);

    const chartData = data
        ? Object.entries(data.score_distribution).map(([range, count]) => ({
            range,
            count,
        }))
        : [];

    const progressPct = data?.total_assigned
        ? Math.round((data.total_graded / data.total_assigned) * 100)
        : 0;

    return (
        <div className="space-y-5">
            {/* Back */}
            <button
                onClick={() => navigate(`/institution/${institutionId}/dashboard`)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
                <ArrowLeft size={15} /> Back to Assessments
            </button>

            {isError && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
                    Failed to load assessment detail.
                </div>
            )}

            {/* Header */}
            {isLoading ? (
                <div className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ) : data && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <BookOpen size={14} className="text-orange-500" />
                                </div>
                                <span className="text-xs text-gray-400">{data.subject_name}</span>
                            </div>
                            <h2 className="text-lg font-bold text-gray-800 truncate">
                                {data.title}
                            </h2>
                            <p className="text-xs text-gray-400 mt-1">
                                {data.total_questions} questions · {data.duration_minutes} mins
                                {data.available_from && (
                                    <> · From {new Date(data.available_from).toLocaleDateString()}</>
                                )}
                                {data.available_until && (
                                    <> · Due {new Date(data.available_until).toLocaleDateString()}</>
                                )}
                            </p>
                        </div>
                        <Badge
                            variant={data.status === "published" ? "green" : "gray"}
                        >
                            {data.status.toUpperCase()}
                        </Badge>
                    </div>

                    {/* Overall progress bar */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                            <span>{data.total_graded} of {data.total_assigned} completed</span>
                            <span className="font-medium">{progressPct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                    backgroundColor: "#e07b39",
                                    width: `${progressPct}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Stats grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl h-24 border border-gray-100" />
                    ))}
                </div>
            ) : data && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatBox
                        label="Assigned"
                        value={data.total_assigned}
                        sub={`${data.total_started} started`}
                    />
                    <StatBox
                        label="Completion"
                        value={`${data.completion_rate}%`}
                        sub={`${data.total_graded} graded`}
                        color="text-orange-500"
                    />
                    <StatBox
                        label="Pass Rate"
                        value={`${data.pass_rate}%`}
                        sub={`Avg: ${data.average_score}%`}
                        color={data.pass_rate >= 70 ? "text-green-600" : "text-red-500"}
                    />
                    <StatBox
                        label="Score Range"
                        value={`${data.lowest_score}–${data.highest_score}%`}
                        sub="Lowest to highest"
                    />
                </div>
            )}

            {/* Score distribution chart */}
            {!isLoading && data && chartData.some((d) => d.count > 0) && (
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                            <BarChart2 size={14} className="text-orange-500" />
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                            Score Distribution
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={chartData} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="range"
                                tick={{ fontSize: 9, fill: "#9ca3af" }}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: "#9ca3af" }}
                                allowDecimals={false}
                                width={24}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: 10,
                                    border: "none",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                    fontSize: 12,
                                }}
                                formatter={(v: number | undefined) => [v ?? 0, "students"]}
                            />
                            <Bar
                                dataKey="count"
                                fill="#e07b39"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Student submission table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm">
                        Student Submissions
                    </h3>
                    {data && (
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                                {data.students.filter((s) => s.status === "graded").length} graded
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                                {data.students.filter((s) => s.status === "submitted").length} submitted
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
                                {data.students.filter((s) => s.status === "not_started").length} not started
                            </span>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr className="text-left text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-5 py-3 font-medium">Student</th>
                                <th className="px-5 py-3 font-medium">Class</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Score</th>
                                <th className="px-5 py-3 font-medium">Time Spent</th>
                                <th className="px-5 py-3 font-medium">Submitted</th>
                                <th className="px-5 py-3 font-medium">Attempts</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <RowSkeleton key={i} />
                                ))
                                : data?.students.length === 0
                                    ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-5 py-12 text-center text-sm text-gray-400"
                                            >
                                                No students assigned to this assessment yet.
                                            </td>
                                        </tr>
                                    )
                                    : data?.students.map((s) => {
                                        const cfg = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.not_started;
                                        const Icon = cfg.icon;
                                        const mins = s.time_spent_seconds
                                            ? Math.round(s.time_spent_seconds / 60)
                                            : null;

                                        return (
                                            <tr
                                                key={s.student_id.toString()}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div
                                                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                                            style={{ backgroundColor: "#e07b39" }}
                                                        >
                                                            {s.student_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-gray-800 truncate text-sm">
                                                                {s.student_name}
                                                            </p>
                                                            {s.student_code && (
                                                                <p className="text-xs text-gray-400 font-mono">
                                                                    {s.student_code}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-gray-500 text-xs">
                                                    {s.classroom_name ?? "—"}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg ${s.status === "graded"
                                                                ? "bg-green-50 text-green-700"
                                                                : s.status === "submitted"
                                                                    ? "bg-blue-50 text-blue-700"
                                                                    : s.status === "in_progress"
                                                                        ? "bg-orange-50 text-orange-700"
                                                                        : s.status === "overdue"
                                                                            ? "bg-red-50 text-red-500"
                                                                            : "bg-gray-50 text-gray-500"
                                                            }`}
                                                    >
                                                        <Icon size={11} />
                                                        {cfg.label}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    {s.best_percentage != null ? (
                                                        <span
                                                            className={`font-semibold text-sm ${s.best_percentage >= 75
                                                                    ? "text-green-600"
                                                                    : s.best_percentage >= 60
                                                                        ? "text-orange-500"
                                                                        : "text-red-500"
                                                                }`}
                                                        >
                                                            {s.best_percentage.toFixed(0)}%
                                                            {s.grade && (
                                                                <span className="ml-1 text-xs text-gray-400">
                                                                    ({s.grade})
                                                                </span>
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300">—</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5 text-gray-500 text-xs">
                                                    {mins != null ? `${mins} min${mins !== 1 ? "s" : ""}` : "—"}
                                                </td>
                                                <td className="px-5 py-3.5 text-gray-500 text-xs">
                                                    {s.submitted_at
                                                        ? new Date(s.submitted_at).toLocaleString("en-GB", {
                                                            day: "numeric",
                                                            month: "short",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })
                                                        : "—"}
                                                </td>
                                                <td className="px-5 py-3.5 text-gray-500 text-xs text-center">
                                                    {s.attempt_count}
                                                </td>
                                            </tr>
                                        );
                                    })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}