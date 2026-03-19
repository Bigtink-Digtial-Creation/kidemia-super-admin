import { useState } from "react";
import { LayoutGrid, Sparkles } from "lucide-react";
import { addToast } from "@heroui/react";
import { Modal } from "./modal";
import { Btn } from "..";
import { useCreateClassroom } from "../../../../hooks/useSchools";

export function NewClassroomModal({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState({
        name: "",
        code: "",
        description: "",
        level: "",
        section: "",
        academic_year: new Date().getFullYear().toString(),
        capacity: "35",
    });

    const update = (key: string, value: string) =>
        setForm((f) => ({ ...f, [key]: value }));

    const createClassroom = useCreateClassroom();

    // Helper to auto-generate a code based on the name and level
    const generateCode = () => {
        if (!form.name && !form.level) {
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            update("code", `CLS-${random}`);
            return;
        }
        const prefix = (form.level || form.name).substring(0, 3).toUpperCase();
        const suffix = Math.floor(100 + Math.random() * 900);
        update("code", `${prefix}-${suffix}`);
    };

    const handleSubmit = () => {
        createClassroom.mutate(
            {
                name: form.name,
                code: form.code || undefined,
                description: form.description || undefined,
                level: form.level || undefined,
                section: form.section || undefined,
                academic_year: form.academic_year || undefined,
                capacity: form.capacity ? Number(form.capacity) : undefined,
            },
            {
                onSuccess: () => {
                    addToast({ title: "Classroom created", color: "success" });
                    onClose();
                },
                onError: (err: any) => {
                    addToast({
                        title: "Failed to create classroom",
                        description: err?.body?.detail || err?.message,
                        color: "danger",
                    });
                },
            }
        );
    };

    const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all";
    const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5";

    return (
        <Modal
            title="New Classroom"
            subtitle="Fill in the details to create a new classroom"
            onClose={onClose}
            footer={
                <div className="flex gap-3 pt-2">
                    <Btn variant="secondary" onClick={onClose}>
                        Cancel
                    </Btn>
                    <Btn
                        icon={<LayoutGrid size={14} />}
                        disabled={!form.name || createClassroom.isPending}
                        onClick={handleSubmit}
                    >
                        Create Classroom
                    </Btn>
                </div>
            }
        >
            {/* Removed max-h and overflow-y-auto to stop the double scrollbar */}
            <div className="space-y-4 px-1 pb-4">
                {/* Name Field */}
                <div>
                    <label className={labelClass}>Class name *</label>
                    <input
                        type="text"
                        placeholder="e.g. JSS 2C, SS 2 Science"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Code Field with Auto-Gen */}
                    <div>
                        <label className={labelClass}>Class Code</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Click to generate"
                                value={form.code}
                                onFocus={() => !form.code && generateCode()} // Changed to onFocus for better accessibility
                                onChange={(e) => update("code", e.target.value)}
                                className={`${inputClass} pr-10`}
                            />
                            <button
                                type="button"
                                onClick={generateCode}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600 transition-colors"
                            >
                                <Sparkles size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Level Field */}
                    <div>
                        <label className={labelClass}>Level</label>
                        <input
                            type="text"
                            placeholder="e.g. JSS1"
                            value={form.level}
                            onChange={(e) => update("level", e.target.value)}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Section</label>
                        <input
                            type="text"
                            placeholder="e.g. Science"
                            value={form.section}
                            onChange={(e) => update("section", e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Academic Year</label>
                        <input
                            type="text"
                            placeholder="2024/2025"
                            value={form.academic_year}
                            onChange={(e) => update("academic_year", e.target.value)}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Capacity</label>
                    <input
                        type="number"
                        value={form.capacity}
                        onChange={(e) => update("capacity", e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                        placeholder="Brief overview..."
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        className={`${inputClass} min-h-[70px] resize-none`} // Added resize-none to prevent manual resizing breaking the layout
                    />
                </div>
            </div>
        </Modal>
    );
}