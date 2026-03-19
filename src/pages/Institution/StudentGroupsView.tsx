import { useState } from "react";
import {
    Users, Plus, Pencil, ChevronDown, ChevronRight, BookOpen,
} from "lucide-react";
import { Badge } from "./components";
import {
    useClassrooms,
    useClassroomGroups,
} from "../../hooks/useSchools";
import type { StudentGroupResponse } from "../../sdk/generated";
import GroupModal from "./components/modals/GroupModal";


function GroupCard({
    group,
    classroomId,
}: {
    group: StudentGroupResponse;
    classroomId: string;
}) {
    const [expanded, setExpanded] = useState(false);
    const [editing, setEditing] = useState(false);

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                            <Users size={16} className="text-orange-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                                {group.name}
                            </p>
                            {group.description && (
                                <p className="text-xs text-gray-400 truncate mt-0.5">
                                    {group.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="green">
                            {group.student_count} student
                            {group.student_count !== 1 ? "s" : ""}
                        </Badge>
                        <button
                            onClick={() => setEditing(true)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Edit group"
                        >
                            <Pencil size={13} className="text-gray-400" />
                        </button>
                        <button
                            onClick={() => setExpanded((v) => !v)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {expanded ? (
                                <ChevronDown size={14} className="text-gray-400" />
                            ) : (
                                <ChevronRight size={14} className="text-gray-400" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Expanded member list */}
                {expanded && (
                    <div className="border-t border-gray-100 px-4 py-3">
                        {group.student_count === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-2">
                                No members yet. Edit to add students.
                            </p>
                        ) : (
                            <p className="text-xs text-gray-500">
                                {group.student_count} member
                                {group.student_count !== 1 ? "s" : ""} in this group
                            </p>
                        )}
                    </div>
                )}
            </div>

            {editing && (
                <GroupModal
                    classroomId={classroomId}
                    group={group}
                    onClose={() => setEditing(false)}
                />
            )}
        </>
    );
}

// ── Main View ─────────────────────────────────────────────────────
export function StudentGroupsView() {
    const [selectedClassroomId, setSelectedClassroomId] = useState<string>("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data: classrooms, isLoading: loadingClassrooms } = useClassrooms();
    const {
        data: groups,
        isLoading: loadingGroups,
        isError,
    } = useClassroomGroups(selectedClassroomId || null);

    return (
        <>
            <div className="space-y-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>

                        <p className="text-xs sm:text-sm text-gray-500">
                            Named groups for targeted assessment assignment
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        disabled={!selectedClassroomId}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl 
                         text-xs sm:text-sm font-medium bg-kidemia-secondary text-white flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"

                        title={
                            !selectedClassroomId
                                ? "Select a classroom first"
                                : "Create new group"
                        }
                    >
                        <Plus size={14} /> New Group
                    </button>
                </div>

                {/* Classroom selector */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                        Select classroom
                    </label>
                    {loadingClassrooms ? (
                        <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {classrooms?.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() =>
                                        setSelectedClassroomId((prev) =>
                                            prev === c.id ? "" : c.id
                                        )
                                    }
                                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${selectedClassroomId === c.id
                                        ? "border-orange-300 bg-orange-50 text-orange-700"
                                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    {c.name}
                                    <span className="ml-1.5 text-xs opacity-60">
                                        {c.level}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Groups list */}
                {!selectedClassroomId ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
                            <Users size={22} className="text-orange-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                            Select a classroom to view its groups
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Groups are scoped to a classroom
                        </p>
                    </div>
                ) : isError ? (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
                        Failed to load groups.
                    </div>
                ) : loadingGroups ? (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gray-100" />
                                    <div className="space-y-1.5 flex-1">
                                        <div className="h-4 bg-gray-100 rounded w-40" />
                                        <div className="h-3 bg-gray-100 rounded w-24" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : groups?.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
                            <BookOpen size={22} className="text-orange-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                            No groups in this classroom yet
                        </p>
                        <p className="text-xs text-gray-400 mt-1 mb-4">
                            Create a group to assign assessments to a specific set of students
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2
                            bg-kidemia-secondary rounded-xl text-xs font-medium bg-kidemia-secondary text-white"

                        >
                            <Plus size={13} /> Create First Group
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {groups?.map((g) => (
                            <GroupCard
                                key={g.id}
                                group={g}
                                classroomId={selectedClassroomId}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showCreateModal && selectedClassroomId && (
                <GroupModal
                    classroomId={selectedClassroomId}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </>
    );
}