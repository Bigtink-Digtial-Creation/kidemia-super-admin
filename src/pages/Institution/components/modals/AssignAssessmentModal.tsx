import { useState } from "react";
import { addToast } from "@heroui/react";
import { Modal } from "./modal";
import { Btn } from "..";
import {
    useClassrooms,
    useInstitutionStudents,
    useAllGroups,
    useInstitutionAssessments,
    useAssignAssessment,
} from "../../../../hooks/useSchools";


const scopeOptions = ["classroom", "group", "individual"] as const;
type Scope = (typeof scopeOptions)[number];






export function AssignAssessmentModal({ onClose }: { onClose: () => void }) {
    const [scope, setScope] = useState<Scope>("classroom");
    const [assessmentId, setAssessmentId] = useState("");
    const [classroomId, setClassroomId] = useState("");
    const [groupId, setGroupId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [instructions, setInstructions] = useState("");

    const { data: assessments, isLoading: loadingAssessments } =
        useInstitutionAssessments();
    const { data: classrooms } = useClassrooms();
    const { data: groups } = useAllGroups();
    const { data: students } = useInstitutionStudents({ page: 0, limit: 200 });
    const assign = useAssignAssessment();

    // Reset scope-specific selection when scope changes
    const handleScopeChange = (s: Scope) => {
        setScope(s);
        setClassroomId("");
        setGroupId("");
        setStudentId("");
    };

    const scopeId =
        scope === "classroom"
            ? classroomId
            : scope === "group"
                ? groupId
                : studentId;

    const isValid = assessmentId && scopeId;

    const handleSubmit = () => {
        assign.mutate(
            {
                assessment_id: assessmentId,
                classroom_id: scope === "classroom" ? classroomId : undefined,
                student_group_id: scope === "group" ? groupId : undefined,
                student_ids: scope === "individual" ? [studentId] : undefined,
                available_from: fromDate || undefined,
                due_date: dueDate || undefined,
                instructions: instructions || undefined,
            },
            {
                onSuccess: () => {
                    addToast({ title: "Assessment assigned", color: "success" });
                    onClose();
                },
                onError: (err: any) =>
                    addToast({
                        title: "Assignment failed",
                        description: err?.body?.detail || err?.message,
                        color: "danger",
                    }),
            }
        );
    };

    return (
        <Modal
            title="Assign Assessment"
            subtitle="Set assessment availability and scope"
            onClose={onClose}
            footer={
                <div className="flex gap-3">
                    <Btn variant="secondary" onClick={onClose} fullWidth>
                        Cancel
                    </Btn>
                    <Btn
                        disabled={!isValid || assign.isPending}
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Assign Assessment
                    </Btn>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Assessment picker */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                        Assessment *
                    </label>
                    <select
                        value={assessmentId}
                        onChange={(e) => setAssessmentId(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                    >
                        <option value="">
                            {loadingAssessments ? "Loading…" : "Select assessment…"}
                        </option>
                        {assessments?.map((a: any) => (
                            <option key={a.id} value={a.id}>
                                {a.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Scope selector */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                        Assign to
                    </label>
                    <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
                        {scopeOptions.map((s) => (
                            <button
                                key={s}
                                onClick={() => handleScopeChange(s)}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${scope === s
                                    ? "text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                                style={scope === s ? { backgroundColor: "#e07b39" } : {}}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scope-specific selector */}
                {scope === "classroom" && (
                    <select
                        value={classroomId}
                        onChange={(e) => setClassroomId(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                    >
                        <option value="">Select classroom…</option>
                        {classrooms?.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name} — {c.level} · {c.student_count} students
                            </option>
                        ))}
                    </select>
                )}

                {scope === "group" && (
                    <select
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                    >
                        <option value="">Select group…</option>
                        {groups?.length === 0 && (
                            <option disabled>No groups created yet</option>
                        )}
                        {groups?.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.name} · {g.student_count} students
                            </option>
                        ))}
                    </select>
                )}

                {scope === "individual" && (
                    <select
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                    >
                        <option value="">Select student…</option>
                        {students?.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.user.full_name} — {s.classroom?.name ?? "Unassigned"}
                            </option>
                        ))}
                    </select>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Available from
                        </label>
                        <input
                            type="datetime-local"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Due date
                        </label>
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                </div>

                {/* Instructions */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        Instructions
                        <span className="normal-case font-normal text-gray-400 ml-1">
                            (optional)
                        </span>
                    </label>
                    <textarea
                        rows={2}
                        placeholder="Any instructions for students…"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                    />
                </div>
            </div>
        </Modal>
    );
}