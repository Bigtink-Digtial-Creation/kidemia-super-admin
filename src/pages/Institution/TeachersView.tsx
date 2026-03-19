import { useState } from "react";
import { UserPlus, MoreVertical, ShieldOff, Shield, BookOpen } from "lucide-react";
import { addToast } from "@heroui/react";
import { type ModalType } from "./components/modals";
import { Badge, Avatar } from "./components/index";
import { useInstitutionTeachers, useSuspendTeacher } from "../../hooks/useSchools";
import type { TeacherResponse } from "../../sdk/generated";
import { AssignClassroomModal } from "./components/modals/AssignClassroomModal";


interface TeachersViewProps {
    onModal: (m: ModalType) => void;
}

// Inline action menu per teacher row
function TeacherActions({
    teacher,
    onAssign,
}: {
    teacher: TeacherResponse;
    onAssign: (teacher: TeacherResponse) => void;
}) {
    const [open, setOpen] = useState(false);
    const suspendTeacher = useSuspendTeacher();
    const isSuspended = teacher.is_suspended;

    const handleSuspend = () => {
        setOpen(false);
        suspendTeacher.mutate(
            { teacherId: teacher.id, suspend: !isSuspended },
            {
                onSuccess: () =>
                    addToast({
                        title: isSuspended
                            ? `${teacher.full_name} reinstated`
                            : `${teacher.full_name} suspended`,
                        color: isSuspended ? "success" : "warning",
                    }),
                onError: (err: any) =>
                    addToast({
                        title: "Action failed",
                        description: err?.body?.detail || err?.message,
                        color: "danger",
                    }),
            }
        );
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <MoreVertical size={15} className="text-gray-400" />
            </button>

            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[160px]">
                        <button
                            onClick={() => {
                                setOpen(false);
                                onAssign(teacher);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <BookOpen size={14} className="text-orange-500" />
                            Assign to classroom
                        </button>
                        <div className="border-t border-gray-100 my-1" />
                        <button
                            onClick={handleSuspend}
                            disabled={suspendTeacher.isPending}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${isSuspended
                                ? "text-green-600 hover:bg-green-50"
                                : "text-red-500 hover:bg-red-50"
                                }`}
                        >
                            {isSuspended ? (
                                <>
                                    <Shield size={14} /> Reinstate teacher
                                </>
                            ) : (
                                <>
                                    <ShieldOff size={14} /> Suspend teacher
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

function TeacherRowSkeleton() {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
                <td key={i} className="px-5 py-4">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );
}

export function TeachersView({ onModal }: TeachersViewProps) {
    const { data: teachers, isLoading, isError } = useInstitutionTeachers();
    const [assignTarget, setAssignTarget] = useState<TeacherResponse | null>(null);

    return (
        <>
            <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                            Teachers
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500">
                            {isLoading
                                ? "Fetching staff..."
                                : `${teachers?.length ?? 0} teaching staff`}
                        </p>
                    </div>
                    <button
                        onClick={() => onModal("addTeacher")}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2.5 
                        rounded-xl text-xs sm:text-sm font-medium bg-kidemia-secondary text-white flex-shrink-0"

                    >
                        <UserPlus size={14} /> Invite Teacher
                    </button>
                </div>

                {isError && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
                        Failed to load teachers. Please try again.
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
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-full bg-gray-100" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3.5 bg-gray-100 rounded w-32" />
                                        <div className="h-3 bg-gray-100 rounded w-20" />
                                    </div>
                                    <div className="h-5 bg-gray-100 rounded-full w-14" />
                                </div>
                            </div>
                        ))
                        : teachers?.map((t) => (
                            <div
                                key={t.id}
                                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <Avatar name={t.full_name!} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 text-sm truncate">
                                            {t.full_name}
                                        </p>
                                        <p className="text-xs text-gray-400">{t.email}</p>
                                    </div>
                                    <Badge variant={t.is_suspended ? "red" : "green"}>
                                        {t.is_suspended ? "Suspended" : "Active"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{t.specialization ?? "No subject"}</span>
                                    <span>
                                        {t.taught_classes_count ?? 0} class
                                        {(t.taught_classes_count ?? 0) !== 1 ? "es" : ""}
                                    </span>
                                    <TeacherActions
                                        teacher={t}
                                        onAssign={setAssignTarget}
                                    />
                                </div>
                            </div>
                        ))}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-100 ">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr className="text-left text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-5 py-3.5 font-medium">Teacher</th>
                                <th className="px-5 py-3.5 font-medium">Email</th>
                                <th className="px-5 py-3.5 font-medium">Subject</th>
                                <th className="px-5 py-3.5 font-medium">Classes</th>
                                <th className="px-5 py-3.5 font-medium">Status</th>
                                <th className="px-5 py-3.5 font-medium" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading
                                ? Array.from({ length: 5 }).map((_, i) => (
                                    <TeacherRowSkeleton key={i} />
                                ))
                                : teachers?.length === 0
                                    ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-5 py-12 text-center text-sm text-gray-400"
                                            >
                                                No teachers yet. Invite your first teacher.
                                            </td>
                                        </tr>
                                    )
                                    : teachers?.map((t) => (
                                        <tr
                                            key={t.id}
                                            className={`hover:bg-gray-50 transition-colors ${t.is_suspended ? "opacity-60" : ""
                                                }`}
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={t.full_name!} size="sm" />
                                                    <span className="font-medium text-gray-800">
                                                        {t.full_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-gray-400 text-xs">
                                                {t.email}
                                            </td>
                                            <td className="px-5 py-4 text-gray-600">
                                                {t.specialization ?? (
                                                    <span className="text-gray-300 italic">
                                                        Not assigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-gray-600">
                                                {t.taught_classes_count ?? 0} class
                                                {(t.taught_classes_count ?? 0) !== 1 ? "es" : ""}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Badge variant={t.is_suspended ? "red" : "green"}>
                                                    {t.is_suspended ? "Suspended" : "Active"}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-4">
                                                <TeacherActions
                                                    teacher={t}
                                                    onAssign={setAssignTarget}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assign classroom modal — triggered from row action */}
            {assignTarget && (
                <AssignClassroomModal
                    teacher={assignTarget}
                    onClose={() => setAssignTarget(null)}
                />
            )}
        </>
    );
}