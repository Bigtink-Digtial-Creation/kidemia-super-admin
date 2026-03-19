import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { addToast } from "@heroui/react";
import { Modal } from "./modal";
import { Btn } from "..";
import { useClassrooms, useAllGroups, useBulkReportCards } from "../../../../hooks/useSchools";
// import type { BulkReportCardResult } from "../../../../sdk/generated";

type Scope = "all" | "classroom" | "group";

export function GenerateReportModal({ onClose }: { onClose: () => void }) {
    const [scope, setScope] = useState<Scope>("all");
    const [selectedClassroomId, setSelectedClassroomId] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState("");
    // const result = useState<BulkReportCardResult | null>(null);

    const { data: classrooms } = useClassrooms();
    const { data: groups } = useAllGroups();
    const generateReports = useBulkReportCards();

    const scopeId =
        scope === "classroom"
            ? selectedClassroomId
            : scope === "group"
                ? selectedGroupId
                : "ready";

    const isReady = !!scopeId;

    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [_, setGeneratedCount] = useState(0);

    const handleGenerate = () => {
        generateReports.mutate(
            {
                classroom_id: scope === "classroom" ? selectedClassroomId : undefined,
                group_id: scope === "group" ? selectedGroupId : undefined,
                format: "pdf",
            },
            {
                onSuccess: (data: any) => {
                    setPdfBlob(data.blob);
                    // Estimate count from scope
                    const count =
                        scope === "classroom"
                            ? classrooms?.find((c) => c.id === selectedClassroomId)?.student_count ?? 0
                            : scope === "group"
                                ? groups?.find((g) => g.id === selectedGroupId)?.student_count ?? 0
                                : 0;
                    setGeneratedCount(count);
                },
                onError: (err: any) => {
                    addToast({
                        title: "Failed to generate reports",
                        description: err?.body?.detail || err?.message,
                        color: "danger",
                    });
                },
            }
        );
    };

    const handleDownload = () => {
        if (!pdfBlob) return;
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report_cards_${new Date().toISOString().split("T")[0]}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        onClose();
    };

    // Replace result JSX
    if (pdfBlob) {
        return (
            <Modal
                title="Reports Ready"
                subtitle="Your PDF is ready to download"
                onClose={onClose}
                footer={
                    <div className="flex gap-3">
                        <Btn variant="secondary" onClick={onClose} fullWidth>Close</Btn>
                        <Btn icon={<Download size={14} />} onClick={handleDownload} fullWidth>
                            Download PDF
                        </Btn>
                    </div>
                }
            >
                <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3">
                        <FileText size={28} className="text-green-500" />
                    </div>
                    <h3 className="font-bold text-gray-800">PDF Ready</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {scope === "all" ? "All students" : scope === "classroom"
                            ? classrooms?.find((c) => c.id === selectedClassroomId)?.name
                            : groups?.find((g) => g.id === selectedGroupId)?.name
                        } — one report card per page
                    </p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            title="Generate Report Cards"
            subtitle="Select scope and generate student reports"
            onClose={onClose}
            footer={
                <div className="flex gap-3">
                    <Btn variant="secondary" onClick={onClose} fullWidth>
                        Cancel
                    </Btn>
                    <Btn
                        icon={<FileText size={14} />}
                        onClick={handleGenerate}
                        disabled={!isReady || generateReports.isPending}
                        fullWidth
                    >
                        Generate
                    </Btn>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Scope selector */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                        Who to include
                    </label>
                    <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
                        {(
                            [
                                { key: "all", label: "All Students" },
                                { key: "classroom", label: "By Class" },
                                { key: "group", label: "By Group" },
                            ] as { key: Scope; label: string }[]
                        ).map((opt) => (
                            <button
                                key={opt.key}
                                onClick={() => setScope(opt.key)}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${scope === opt.key
                                    ? "text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                                style={
                                    scope === opt.key ? { backgroundColor: "#e07b39" } : {}
                                }
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Classroom picker */}
                {scope === "classroom" && (
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Select classroom
                        </label>
                        <select
                            value={selectedClassroomId}
                            onChange={(e) => setSelectedClassroomId(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                        >
                            <option value="">Select classroom…</option>
                            {classrooms?.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} — {c.level} · {c.student_count} students
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Group picker */}
                {scope === "group" && (
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                            Select group
                        </label>
                        <select
                            value={selectedGroupId}
                            onChange={(e) => setSelectedGroupId(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                        >
                            <option value="">Select group…</option>
                            {!groups?.length && (
                                <option disabled>No groups created yet</option>
                            )}
                            {groups?.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name} · {g.student_count} members
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Scope summary */}
                <div className="bg-orange-50 rounded-xl p-3 text-xs text-orange-700">
                    {scope === "all" && (
                        <span>
                            Will generate report cards for{" "}
                            <strong>all active students</strong> in the institution.
                        </span>
                    )}
                    {scope === "classroom" && selectedClassroomId && (
                        <span>
                            Will generate for all students in{" "}
                            <strong>
                                {classrooms?.find((c) => c.id === selectedClassroomId)?.name}
                            </strong>
                            .
                        </span>
                    )}
                    {scope === "group" && selectedGroupId && (
                        <span>
                            Will generate for all members of{" "}
                            <strong>
                                {groups?.find((g) => g.id === selectedGroupId)?.name}
                            </strong>
                            .
                        </span>
                    )}
                    {scope !== "all" && !scopeId && (
                        <span className="text-gray-400">Select a {scope} above.</span>
                    )}
                </div>

                {generateReports.isPending && (
                    <div className="bg-orange-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
                            <span className="text-xs font-medium text-orange-700">
                                Generating report cards…
                            </span>
                        </div>
                        <div className="w-full bg-orange-100 rounded-full h-1.5">
                            <div
                                className="h-1.5 rounded-full animate-pulse"
                                style={{ backgroundColor: "#e07b39", width: "60%" }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}