import { useState } from "react";
import { Upload, Download, CheckCircle, AlertCircle, X } from "lucide-react";
import { addToast } from "@heroui/react";
import { Modal } from "./modal";
import { Btn } from "..";
import { useBulkUploadStudents } from "../../../../hooks/useSchools";
import type { BulkOnboardResult } from "../../../../sdk/generated";

// CSV columns your backend expects
const CSV_COLUMNS = [
    "email",
    "first_name",
    "last_name",
    "middle_name",
    "phone_number",
    "date_of_birth",
    "guardian_email",
    "classroom_code",
    "category",
];

const CSV_EXAMPLE_ROW = [
    "student@gmail.com",
    "John",
    "Doe",
    "Samuel",
    "08012345678",
    "2008-01-15",
    "parent@example.com",
    "JSS-166",
    "common_entrance",
];

function downloadTemplate() {
    const rows = [CSV_COLUMNS.join(","), CSV_EXAMPLE_ROW.join(",")];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_upload_template.csv";
    a.click();
    URL.revokeObjectURL(url);
}




export function BulkUploadModal({ onClose }: { onClose: () => void }) {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [sendInvite, setSendInvite] = useState(true);
    const [result, setResult] = useState<BulkOnboardResult | null>(null);

    const bulkUpload = useBulkUploadStudents();

    const handleUpload = () => {
        if (!file) return;
        bulkUpload.mutate(
            {
                file: { file: file },
                sendInvite: true,
            },
            {
                onSuccess: (data) => {
                    setResult(data);
                    if (data.failed === 0) {
                        addToast({
                            title: `${data.success} students onboarded successfully`,
                            color: "success",
                        });
                    }
                },
                onError: (err: any) => {
                    addToast({
                        title: "Upload failed",
                        description: err?.body?.detail || err?.message,
                        color: "danger",
                    });
                },
            }
        );
    };

    // Show results view after upload
    if (result) {
        return (
            <Modal
                title="Upload Complete"
                subtitle={`${result.total} rows processed`}
                onClose={onClose}
                footer={
                    <Btn onClick={onClose} fullWidth>
                        Done
                    </Btn>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xl font-bold text-gray-800">{result.total}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Total</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-3">
                            <p className="text-xl font-bold text-green-600">
                                {result.success}
                            </p>
                            <p className="text-xs text-green-500 mt-0.5">Succeeded</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-3">
                            <p className="text-xl font-bold text-red-500">{result.failed}</p>
                            <p className="text-xs text-red-400 mt-0.5">Failed</p>
                        </div>
                    </div>

                    {result.errors.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Errors
                            </p>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                {result.errors.map((e, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2.5 bg-red-50 rounded-xl p-2.5 text-xs"
                                    >
                                        <AlertCircle
                                            size={13}
                                            className="text-red-400 mt-0.5 flex-shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <span className="font-medium text-red-700">
                                                Row {e.row}
                                                {e.email ? ` · ${e.email}` : ""}
                                            </span>
                                            <p className="text-red-500 truncate">{e.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            title="Bulk Student Onboarding"
            subtitle="Import students via CSV template"
            onClose={onClose}
            footer={
                <div className="flex gap-3">
                    <Btn variant="secondary" onClick={onClose} fullWidth>
                        Cancel
                    </Btn>
                    <Btn
                        disabled={!file || bulkUpload.isPending}
                        onClick={handleUpload}
                        fullWidth
                    >
                        Upload & Process
                    </Btn>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Drop zone */}
                <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragging
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                        }`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        const dropped = e.dataTransfer.files[0];
                        if (dropped?.name.endsWith(".csv")) setFile(dropped);
                        else
                            addToast({
                                title: "Only .csv files accepted",
                                color: "danger",
                            });
                    }}
                >
                    {file ? (
                        <div className="flex items-center justify-center gap-3">
                            <CheckCircle size={24} className="text-green-500" />
                            <div className="text-left flex-1 min-w-0">
                                <p className="font-medium text-gray-800 truncate">
                                    {file.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="p-1 rounded-lg hover:bg-gray-100 flex-shrink-0"
                            >
                                <X size={14} className="text-gray-400" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Upload size={32} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-600 font-medium">
                                Drop your CSV here or{" "}
                                <label className="text-orange-500 cursor-pointer hover:underline">
                                    browse
                                    <input
                                        type="file"
                                        accept=".csv"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                </label>
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                Only .csv files accepted · Max 5MB
                            </p>
                        </>
                    )}
                </div>

                {/* Template download */}
                <button
                    onClick={downloadTemplate}
                    className="w-full flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl p-3 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                    <Download size={16} className="text-orange-500 flex-shrink-0" />
                    <span>
                        Need the template?{" "}
                        <span className="text-orange-500 font-medium">
                            Download CSV template
                        </span>
                    </span>
                </button>

                {/* Send invite toggle */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div
                        onClick={() => setSendInvite((v) => !v)}
                        className="w-10 h-5 rounded-full transition-colors flex items-center flex-shrink-0"
                        style={{ backgroundColor: sendInvite ? "#e07b39" : "#e5e7eb" }}
                    >
                        <span
                            className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${sendInvite ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </div>
                    <span className="text-sm text-gray-600">
                        Send invite email to each student
                    </span>
                </label>
            </div>
        </Modal>
    );
}