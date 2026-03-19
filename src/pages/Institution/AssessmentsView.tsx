import { Plus, MoreVertical, ClipboardList, BookOpen } from "lucide-react";
import { useNavigate } from "react-router";
import { type ModalType } from "./components/modals";
import { Badge } from "./components/index";
import { useInstitutionAssessments } from "../../hooks/useSchools";
import { useInstitution } from "../../context/InstitutionContext";

interface AssessmentsViewProps {
    onModal: (m: ModalType) => void;
}

function AssessmentRowSkeleton() {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
                <td key={i} className="px-5 py-4">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );
}

export function AssessmentsView({ onModal }: AssessmentsViewProps) {
    const navigate = useNavigate();
    const { institutionId } = useInstitution();
    const { data: assessments, isLoading, isError } = useInstitutionAssessments();

    const statusVariant = (status: string) => {
        if (status === "published") return "green";
        if (status === "draft") return "gray";
        return "orange";
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                        Assessments
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                        {isLoading
                            ? "Loading…"
                            : `${assessments?.length ?? 0} assessments`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onModal("assign")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-all"
                    >
                        <ClipboardList size={14} /> Assign
                    </button>
                    <button
                        onClick={() =>
                            navigate(`/institution/${institutionId}/assessments/create`)
                        }
                        className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl
                         text-xs sm:text-sm font-medium bg-kidemia-secondary text-white"

                    >
                        <Plus size={14} /> New Assessment
                    </button>
                </div>
            </div>

            {isError && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
                    Failed to load assessments.
                </div>
            )}

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse"
                        >
                            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                    ))
                    : assessments?.map((a) => (
                        <div
                            key={a.id}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <p className="font-medium text-gray-800 text-sm leading-tight">
                                    {a.title}
                                </p>
                                <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500 mt-2">
                                <span>{a.subject_name}</span>
                                <span>{a.total_questions} questions</span>
                                <span>{a.duration_minutes} mins</span>
                                {a.assignment_count! > 0 && (
                                    <span className="text-orange-600 font-medium">
                                        {a.assignment_count} assigned
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr className="text-left text-gray-400 text-xs uppercase tracking-wider">
                            <th className="px-5 py-3.5 font-medium">Assessment</th>
                            <th className="px-5 py-3.5 font-medium">Subject</th>
                            <th className="px-5 py-3.5 font-medium">Questions</th>
                            <th className="px-5 py-3.5 font-medium">Duration</th>
                            <th className="px-5 py-3.5 font-medium">Assigned</th>
                            <th className="px-5 py-3.5 font-medium">Status</th>
                            <th className="px-5 py-3.5 font-medium" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <AssessmentRowSkeleton key={i} />
                            ))
                            : assessments?.length === 0
                                ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                                                    <BookOpen size={22} className="text-orange-300" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    No assessments yet
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Create your first assessment to assign to students
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/institution/${institutionId}/assessments/create`
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                                                     text-xs font-medium bg-kidemia-secondary text-white mt-1"

                                                >
                                                    <Plus size={13} /> Create Assessment
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                                : assessments?.map((a) => (
                                    <tr
                                        key={a.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-5 py-4 font-medium text-gray-800 max-w-[240px]">
                                            <p className="truncate">{a.title}</p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 text-xs">
                                            {a.subject_name}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {a.total_questions}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {a.duration_minutes} mins
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {a.assignment_count! > 0 ? (
                                                <span className="text-orange-600 font-medium">
                                                    {a.assignment_count}×
                                                </span>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Badge variant={statusVariant(a.status)}>
                                                {a.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() =>
                                                    navigate(`/institution/${institutionId}/assessments/${a.id}`)
                                                }
                                                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                                title="View detail"
                                            >
                                                <MoreVertical size={15} className="text-gray-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}