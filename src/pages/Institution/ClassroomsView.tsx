import { Plus, GraduationCap, ArrowRightLeft, ChevronRight } from "lucide-react";
import { type ModalType } from "./components/modals";
import { Badge } from "./components/index";
import { useClassrooms } from "../../hooks/useSchools";

// Skeleton
function ClassroomCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-start justify-between mb-3">
                <div className="space-y-1.5">
                    <div className="h-4 bg-gray-100 rounded w-28" />
                    <div className="h-3 bg-gray-100 rounded w-20" />
                </div>
                <div className="h-5 bg-gray-100 rounded-full w-14" />
            </div>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-gray-100" />
                <div className="h-3 bg-gray-100 rounded w-32" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="space-y-1">
                    <div className="h-3 bg-gray-100 rounded w-14" />
                    <div className="h-5 bg-gray-100 rounded w-10" />
                </div>
                <div className="flex gap-2">
                    <div className="h-7 bg-gray-100 rounded-lg w-16" />
                    <div className="h-7 bg-gray-100 rounded-lg w-14" />
                </div>
            </div>
        </div>
    );
}

interface ClassroomsViewProps {
    onModal: (m: ModalType, classId?: string) => void;
}

export function ClassroomsView({ onModal }: ClassroomsViewProps) {
    const { data: classrooms, isLoading, isError } = useClassrooms();

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Classrooms</h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Manage classes and student placement
                        {classrooms && (
                            <span className="ml-2 text-orange-500 font-medium">
                                · {classrooms.length} total
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={() => onModal("newClassroom")}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-white bg-kidemia-secondary flex-shrink-0"
                >
                    <Plus size={14} />
                    <span className="hidden sm:inline">New</span> Classroom
                </button>
            </div>

            {isError && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
                    Failed to load classrooms. Please try again.
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => <ClassroomCardSkeleton key={i} />)
                    : classrooms?.length === 0
                        ? (
                            <div className="col-span-3 bg-white rounded-2xl p-10 text-center border border-gray-100">
                                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
                                    <GraduationCap size={22} className="text-orange-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">No classrooms yet</p>
                                <p className="text-xs text-gray-400 mt-1 mb-4">
                                    Create your first classroom to get started
                                </p>
                                <button
                                    onClick={() => onModal("newClassroom")}
                                    className="inline-flex items-center gap-2 px-4 py-2
                                     rounded-xl text-xs font-medium bg-kidemia-secondary text-white"

                                >
                                    <Plus size={13} /> Create Classroom
                                </button>
                            </div>
                        )
                        : classrooms?.map((c) => (
                            <div
                                key={c.id}
                                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{c.name}</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {c.level} · {c.student_count} students
                                            {c.capacity && (
                                                <span className="text-gray-300"> / {c.capacity}</span>
                                            )}
                                        </p>
                                    </div>
                                    <Badge variant={c.is_active ? "green" : "gray"}>
                                        {c.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                        <GraduationCap size={14} className="text-orange-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 truncate">
                                        {c.class_teacher?.user.full_name ?? (
                                            <span className="text-gray-300 italic">No teacher assigned</span>
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-400">Class Code</p>
                                        <p className='text-xs text-muted text-kidemia-primary' >
                                            {c.code}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onModal("move", c.id)}
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-colors"
                                        >
                                            <ArrowRightLeft size={12} /> Move
                                        </button>
                                        <button
                                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-kidemia-secondary text-white"

                                        >
                                            View <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                }
            </div>
        </div>
    );
}