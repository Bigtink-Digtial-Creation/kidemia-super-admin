import { addToast } from "@heroui/react";
import type { StudentGroupResponse } from "../../../../sdk/generated";
import { useState } from "react";
import { useClassroomStudents, useCreateGroup, useUpdateGroup } from "../../../../hooks/useSchools";


export default function GroupModal({
    classroomId,
    group,
    onClose,
}: {
    classroomId: string;
    group?: StudentGroupResponse;
    onClose: () => void;
}) {
    const isEdit = !!group;

    const [name, setName] = useState(group?.name ?? "");
    const [description, setDescription] = useState(group?.description ?? "");
    const [selectedIds, setSelectedIds] = useState<string[]>(
        // Pre-check existing members when editing
        group?.students?.map((s) => s.id) ?? []
    );
    // Load classroom students for member selection
    const { data: students, isLoading: loadingStudents } =
        useClassroomStudents(classroomId);

    const createGroup = useCreateGroup();
    const updateGroup = useUpdateGroup();
    const isPending = createGroup.isPending || updateGroup.isPending;

    const toggle = (id: string) =>
        setSelectedIds((s) =>
            s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
        );

    const handleSubmit = () => {
        if (!name.trim()) return;

        if (isEdit) {
            updateGroup.mutate(
                {
                    groupId: group.id,
                    classroomId,
                    data: {
                        name: name.trim(),
                        description: description || undefined,
                        // send full new member list — backend does full sync
                        student_ids: selectedIds,
                    },
                },
                {
                    onSuccess: () => {
                        addToast({ title: "Group updated", color: "success" });
                        onClose();
                    },
                    onError: (err: any) =>
                        addToast({
                            title: "Failed to update group",
                            description: err?.body?.detail || err?.message,
                            color: "danger",
                        }),
                }
            );
        } else {
            createGroup.mutate(
                {
                    name: name.trim(),
                    description: description || undefined,
                    classroom_id: classroomId,
                    student_ids: selectedIds,
                },
                {
                    onSuccess: () => {
                        addToast({ title: "Group created", color: "success" });
                        onClose();
                    },
                    onError: (err: any) =>
                        addToast({
                            title: "Failed to create group",
                            description: err?.body?.detail || err?.message,
                            color: "danger",
                        }),
                }
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">
                        {isEdit ? "Edit Group" : "New Student Group"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {isEdit
                            ? "Update group name or members"
                            : "Create a named group for targeted assessment"}
                    </p>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Group name *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Top Set, Foundation Group, Science A"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Description
                            <span className="normal-case font-normal text-gray-400 ml-1">
                                (optional)
                            </span>
                        </label>
                        <textarea
                            rows={2}
                            placeholder="What is this group for?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                        />
                    </div>

                    {/* Member selection */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Members
                            </label>
                            {selectedIds.length > 0 && (
                                <span className="text-xs text-orange-600 font-medium">
                                    {selectedIds.length} selected
                                </span>
                            )}
                        </div>

                        {loadingStudents ? (
                            <div className="space-y-1.5">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : !students?.length ? (
                            <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-xl">
                                No students in this classroom yet.
                            </p>
                        ) : (
                            <>
                                {/* Select all */}
                                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 cursor-pointer mb-1.5">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === students.length}
                                        onChange={() =>
                                            setSelectedIds(
                                                selectedIds.length === students.length
                                                    ? []
                                                    : students.map((s) => s.id)
                                            )
                                        }
                                        className="w-4 h-4 rounded accent-orange-500"
                                    />
                                    <span className="text-xs font-semibold text-gray-500">
                                        Select all ({students.length})
                                    </span>
                                </label>

                                <div className="space-y-1 max-h-44 overflow-y-auto">
                                    {students.map((s) => (
                                        <label
                                            key={s.id}
                                            className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${selectedIds.includes(s.id)
                                                ? "border-orange-200 bg-orange-50"
                                                : "border-transparent hover:bg-gray-50"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(s.id)}
                                                onChange={() => toggle(s.id)}
                                                className="w-4 h-4 rounded accent-orange-500"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-700 truncate">
                                                    {s.user.full_name}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate">
                                                    {s.user.email}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!name.trim() || isPending}
                        className="flex-1 py-2.5 rounded-xl text-sm 
                        font-medium text-white transition-colors disabled:opacity-50 bg-kidemia-secondary"
                    >
                        {isPending
                            ? "Saving…"
                            : isEdit
                                ? "Save Changes"
                                : "Create Group"}
                    </button>
                </div>
            </div>
        </div>
    );
}