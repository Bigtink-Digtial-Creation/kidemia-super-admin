import { useState } from "react";
import { addToast } from "@heroui/react";
import { Btn } from "..";
import { Modal } from "./modal";
import {
    useBulkMoveStudents,
    useClassrooms,
    useClassroomStudents,
    useInstitutionStudents,
} from "../../../../hooks/useSchools";

interface MoveStudentModalProps {
    classId?: string;
    onClose: () => void;
}

export function MoveStudentModal({ classId, onClose }: MoveStudentModalProps) {
    const [selected, setSelected] = useState<string[]>([]);
    const [targetClassId, setTargetClassId] = useState("");
    const [sourceClassId, setSourceClassId] = useState(classId ?? "");

    const { data: classrooms } = useClassrooms();

    // Always call both hooks (React-safe)
    const { data: classroomStudents } = useClassroomStudents(sourceClassId);
    const { data: institutionStudents } = useInstitutionStudents();

    // Decide which students to show
    const students = sourceClassId ? classroomStudents : institutionStudents;

    const bulkMove = useBulkMoveStudents();

    const toggle = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleMove = () => {
        bulkMove.mutate(
            {
                student_ids: selected,
                target_classroom_id: targetClassId,
            },
            {
                onSuccess: (res) => {
                    addToast({
                        title: `${res.moved_count} student${res.moved_count > 1 ? "s" : ""
                            } moved`,
                        color: "success",
                    });
                    onClose();
                },
                onError: (err: any) => {
                    addToast({
                        title: "Failed to move students",
                        description: err?.body?.detail || err?.message,
                        color: "danger",
                    });
                },
            }
        );
    };

    const targetClassName = classrooms?.find(
        (c) => c.id === targetClassId
    )?.name;

    return (
        <Modal
            title="Move Students"
            subtitle="Reassign students to a different classroom"
            onClose={onClose}
            footer={
                <div className="flex gap-3">
                    <Btn variant="secondary" onClick={onClose} fullWidth>
                        Cancel
                    </Btn>

                    <Btn
                        disabled={!selected.length || !targetClassId || bulkMove.isPending}
                        onClick={handleMove}
                        fullWidth
                    >
                        Move{" "}
                        {selected.length > 0
                            ? `${selected.length} Student${selected.length > 1 ? "s" : ""
                            }`
                            : "Students"}
                    </Btn>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Source Classroom Selector (only if modal wasn't opened from a class) */}
                {!classId && (
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Source classroom
                        </p>

                        <select
                            value={sourceClassId}
                            onChange={(e) => {
                                setSourceClassId(e.target.value);
                                setSelected([]); // reset selection when changing source
                            }}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                        >
                            <option value="">All Students</option>
                            {classrooms?.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} — {c.level}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Students List */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Select students
                    </p>

                    <div className="space-y-1 max-h-48 overflow-y-auto -mx-1 px-1">
                        {students?.map((s) => (
                            <label
                                key={s.id}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(s.id)}
                                    onChange={() => toggle(s.id)}
                                    className="w-4 h-4 rounded accent-orange-500"
                                />

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate">
                                        {s.user.full_name} — {s.user.email}
                                    </p>
                                </div>

                                <span className="text-xs text-gray-400 flex-shrink-0">
                                    {s.classroom?.name || "Unassigned"}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Destination Classroom */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Destination classroom
                    </p>

                    <select
                        value={targetClassId}
                        onChange={(e) => setTargetClassId(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                    >
                        <option value="">Select classroom…</option>
                        {classrooms?.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name} — {c.level}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Confirmation Box */}
                {selected.length > 0 && targetClassId && (
                    <div className="bg-orange-50 rounded-xl p-3 text-xs text-orange-700">
                        <strong>
                            {selected.length} student
                            {selected.length > 1 ? "s" : ""}
                        </strong>{" "}
                        will be moved to <strong>{targetClassName}</strong>. This action can
                        be undone.
                    </div>
                )}
            </div>
        </Modal>
    );
}