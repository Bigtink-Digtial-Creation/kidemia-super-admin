import { useState } from "react";
import { BookOpen, Info } from "lucide-react";
import { addToast, Tooltip } from "@heroui/react";
import { Modal } from "./modal";
import { Btn } from "..";
import {
    useClassrooms,
    useAssignTeacherToClassroom,
} from "../../../../hooks/useSchools";
import { useSubjects } from "../../../../hooks/useSubjects";
import type { TeacherResponse } from "../../../../sdk/generated";

export function AssignClassroomModal({
    teacher,
    onClose,
}: {
    teacher: TeacherResponse;
    onClose: () => void;
}) {
    const [classroomId, setClassroomId] = useState("");
    const [subjectSearch, setSubjectSearch] = useState(
        teacher.specialization ?? ""
    );
    const [subject, setSubject] = useState(teacher.specialization ?? "");

    // FIXED: boolean state
    const [isClassTeacher, setIsClassTeacher] = useState(false);

    const { data: classrooms } = useClassrooms();
    const { subjects, setFilters } = useSubjects();
    const assignTeacher = useAssignTeacherToClassroom();

    const handleSubjectSearch = (val: string) => {
        setSubjectSearch(val);
        setSubject("");
        setFilters((f) => ({ ...f, search: val }));
    };

    const handleSubmit = () => {
        if (!classroomId) return;

        assignTeacher.mutate(
            {
                teacherId: teacher.id,
                classroomId,
                subject: subject || null,
                isClassTeacher: isClassTeacher,
            },
            {
                onSuccess: () => {
                    addToast({
                        title: `${teacher.full_name} assigned`,
                        color: "success",
                    });
                    onClose();
                },
                onError: (err: any) => {
                    addToast({
                        title: "Assignment failed",
                        description: err?.body?.detail || err?.message,
                        color: "danger",
                    });
                },
            }
        );
    };

    return (
        <Modal
            title="Assign to Classroom"
            subtitle={`Assigning ${teacher.full_name}`}
            onClose={onClose}
            footer={
                <div className="flex gap-3">
                    <Btn variant="secondary" onClick={onClose} fullWidth>
                        Cancel
                    </Btn>
                    <Btn
                        icon={<BookOpen size={14} />}
                        disabled={!classroomId || assignTeacher.isPending}
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Assign
                    </Btn>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Teacher summary */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600 flex-shrink-0">
                        {teacher.full_name!.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-sm">
                            {teacher.full_name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {teacher.email}
                        </p>
                    </div>
                </div>

                {/* Classroom select */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        Classroom *
                    </label>
                    <select
                        value={classroomId}
                        onChange={(e) => setClassroomId(e.target.value)}
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

                {/* Subject override */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        Subject for this classroom
                        <span className="normal-case font-normal text-gray-400 ml-1">
                            (overrides default)
                        </span>
                    </label>

                    <input
                        type="text"
                        placeholder="Search subjects…"
                        value={subjectSearch}
                        onChange={(e) => handleSubjectSearch(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />

                    {subjectSearch && !subject && subjects.length > 0 && (
                        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm mt-1.5">
                            {subjects.slice(0, 5).map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        setSubject(s.name);
                                        setSubjectSearch(s.name);
                                        setFilters((f) => ({ ...f, search: "" }));
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700 transition-colors"
                                >
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {subject && (
                        <p className="text-xs text-orange-600 mt-1">
                            Selected: <strong>{subject}</strong>
                        </p>
                    )}
                </div>

                {/* Class Teacher Checkbox */}
                <div className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Set as Class Teacher
                        </label>

                        <Tooltip
                            content="Class teachers are responsible for managing the classroom, attendance, and student welfare."
                            placement="right"
                        >
                            <Info size={14} className="text-gray-400 cursor-help" />
                        </Tooltip>
                    </div>

                    <input
                        type="checkbox"
                        checked={isClassTeacher}
                        onChange={(e) => setIsClassTeacher(e.target.checked)}
                        className="w-4 h-4 accent-orange-500 cursor-pointer"
                    />
                </div>
            </div>
        </Modal>
    );
}