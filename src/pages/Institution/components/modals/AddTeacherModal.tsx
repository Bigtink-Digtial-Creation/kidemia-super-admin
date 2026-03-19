import { useState } from "react";
import { UserPlus } from "lucide-react";
import { addToast } from "@heroui/react";
import { Modal } from "./modal";
import { Btn } from "..";
import { useInviteTeacher, useClassrooms } from "../../../../hooks/useSchools";
import { useSubjects } from "../../../../hooks/useSubjects";

export function AddTeacherModal({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        subject: "",
        invite_now: true,
    });
    const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
    const [subjectSearch, setSubjectSearch] = useState("");

    const update = (key: string, value: string | boolean) =>
        setForm((f) => ({ ...f, [key]: value }));

    const toggleClass = (id: string) =>
        setSelectedClassIds((s) =>
            s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
        );

    const { data: classrooms } = useClassrooms();
    const { subjects, setFilters } = useSubjects();
    const inviteTeacher = useInviteTeacher();

    const handleSubjectSearch = (val: string) => {
        setSubjectSearch(val);
        setFilters((f) => ({ ...f, search: val }));
    };

    const handleSubmit = () => {
        inviteTeacher.mutate(
            {
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
                subject: form.subject || undefined,
                specialization: form.subject || undefined,
                classroom_ids: selectedClassIds,
            },
            {
                onSuccess: () => {
                    addToast({
                        title: `Invite sent to ${form.email}`,
                        color: "success",
                    });
                    onClose();
                },
                onError: (err: any) => {
                    addToast({
                        title: "Failed to invite teacher",
                        description: err?.body?.detail || err?.message,
                        color: "danger",
                    });
                },
            }
        );
    };

    return (
        <Modal
            title="Invite Teacher"
            subtitle="Add a new teacher to the institution"
            onClose={onClose}
            size="md"
            footer={
                <div className="flex gap-3">
                    <Btn variant="secondary" onClick={onClose} fullWidth>
                        Cancel
                    </Btn>
                    <Btn
                        icon={<UserPlus size={14} />}
                        disabled={
                            !form.first_name || !form.email || inviteTeacher.isPending
                        }
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Send Invite
                    </Btn>
                </div>
            }
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            First name *
                        </label>
                        <input
                            type="text"
                            placeholder="Chidi"
                            value={form.first_name}
                            onChange={(e) => update("first_name", e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Last name
                        </label>
                        <input
                            type="text"
                            placeholder="Adeyemi"
                            value={form.last_name}
                            onChange={(e) => update("last_name", e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        Email address *
                    </label>
                    <input
                        type="email"
                        placeholder="teacher@school.edu.ng"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        Phone number
                    </label>
                    <input
                        type="tel"
                        placeholder="+234 800 000 0000"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                </div>

                {/* Subject — searchable from platform subjects API */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        Primary subject
                    </label>
                    <input
                        type="text"
                        placeholder="Search subjects…"
                        value={subjectSearch}
                        onChange={(e) => handleSubjectSearch(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 mb-1.5"
                    />
                    {subjectSearch && subjects.length > 0 && (
                        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                            {subjects.slice(0, 6).map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        update("subject", s.name);
                                        setSubjectSearch(s.name);
                                        setFilters((f) => ({ ...f, search: "" }));
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${form.subject === s.name
                                        ? "bg-orange-50 text-orange-700"
                                        : "hover:bg-gray-50 text-gray-700"
                                        }`}
                                >
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    )}
                    {form.subject && (
                        <p className="text-xs text-orange-600 mt-1">
                            Selected: <strong>{form.subject}</strong>
                        </p>
                    )}
                </div>

                {/* Assign classrooms */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                        Assign classrooms{" "}
                        <span className="normal-case font-normal text-gray-400">
                            (optional)
                        </span>
                    </label>
                    {!classrooms?.length ? (
                        <p className="text-xs text-gray-400 italic">
                            No classrooms available yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                            {classrooms.map((c) => (
                                <label
                                    key={c.id}
                                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${selectedClassIds.includes(c.id)
                                        ? "border-orange-300 bg-orange-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedClassIds.includes(c.id)}
                                        onChange={() => toggleClass(c.id)}
                                        className="accent-orange-500"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-gray-700 truncate">
                                            {c.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {c.student_count} students
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div
                        onClick={() => update("invite_now", !form.invite_now)}
                        className="w-10 h-5 rounded-full transition-colors flex items-center flex-shrink-0"
                        style={{
                            backgroundColor: form.invite_now ? "#e07b39" : "#e5e7eb",
                        }}
                    >
                        <span
                            className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${form.invite_now ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </div>
                    <span className="text-sm text-gray-600">
                        Send invitation email immediately
                    </span>
                </label>
            </div>
        </Modal>
    );
}