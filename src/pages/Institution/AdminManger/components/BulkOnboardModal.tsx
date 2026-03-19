import { AlertCircle, CheckCircle, Download, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import type { BulkInstitutionOnboardResult } from "../../../../sdk/generated";
import { downloadInstitutionTemplate, useBulkOnboardInstitutions } from "../../../../hooks/useInstitutions";

interface BulkOnboardModalProps {
    onClose: () => void;
}

export default function BulkOnboardModal({ onClose }: BulkOnboardModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [result, setResult] = useState<BulkInstitutionOnboardResult | null>(null);

    const bulkOnboard = useBulkOnboardInstitutions();




    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f?.name.endsWith(".csv")) setFile(f);
    };

    const handleSubmit = async () => {
        if (!file) return;
        try {
            const data = await bulkOnboard.mutateAsync({ file });
            setResult(data);
        } catch (err: any) {
            // surface API validation error if present
            setResult({
                total: 0,
                success: 0,
                failed: 1,
                errors: [{ row: 0, name: "—", code: "—", reason: err?.message ?? "Upload failed. Please try again." }],
                created_institution_ids: [],
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-kidemia-secondary">
                            <Upload size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-kidemia-primary text-sm sm:text-base">Bulk Onboard Institutions</h2>
                            <p className="text-xs text-gray-400">Upload a CSV to create multiple institutions</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                    {!result ? (
                        <>
                            <button
                                onClick={downloadInstitutionTemplate}
                                className="flex items-center gap-3 p-3 bg-kidemia-secondary rounded-xl border border-blue-100 w-full text-left hover:opacity-90 transition-opacity"
                            >
                                <Download size={16} className="text-white flex-shrink-0" />
                                <p className="text-sm text-white flex-1">
                                    First time? <span className="font-semibold underline">Download the CSV template</span>
                                </p>
                            </button>
                            <div
                                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors cursor-pointer ${dragging ? "border-[#e07b39] bg-orange-50" : file ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-[#e07b39] hover:bg-orange-50"}`}
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById("csv-input")?.click()}
                            >
                                <input
                                    id="csv-input"
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={e => setFile(e.target.files?.[0] ?? null)}
                                />
                                {file ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                                        <div className="text-left min-w-0">
                                            <p className="font-semibold text-gray-800 truncate">{file.name}</p>
                                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB · Ready to upload</p>
                                        </div>
                                        <button
                                            onClick={e => { e.stopPropagation(); setFile(null); }}
                                            className="ml-2 p-1 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
                                        >
                                            <X size={14} className="text-gray-400" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={28} className="mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-600 font-medium text-sm">Drop CSV here or <span className="text-kidemia-secondary">click to browse</span></p>
                                        <p className="text-xs text-gray-400 mt-1">name, code, email, city, state, tier, owner_email…</p>
                                    </>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 font-mono leading-relaxed">
                                <span className="font-semibold text-kidemia-secondary">Required:</span> name, code, owner_email, owner_first_name, owner_last_name
                                <br />
                                <span className="text-gray-400">Optional:</span> email, phone, city, state, country, tier, max_students
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Total Rows", value: result.total, color: "text-primary", bg: "bg-gray-50" },
                                    { label: "Succeeded", value: result.success, color: "text-green-700", bg: "bg-green-50" },
                                    { label: "Failed", value: result.failed, color: "text-red-600", bg: "bg-red-50" },
                                ].map(s => (
                                    <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            {result.errors.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Errors</p>
                                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                                        {result.errors.map((err, i) => (
                                            <div key={i} className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                                                <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                                                <div className="text-xs text-red-700 min-w-0">
                                                    <span className="font-semibold">Row {err.row} · {err.name || "—"}</span>
                                                    <p className="text-red-500 mt-0.5">{err.reason}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 px-4 sm:px-6 pb-4 sm:pb-6">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm">
                        {result ? "Close" : "Cancel"}
                    </button>
                    {!result && (
                        <button
                            onClick={handleSubmit}
                            disabled={!file || bulkOnboard.isPending}
                            className="flex-1 py-2.5 rounded-xl font-medium text-sm text-white disabled:opacity-40 flex items-center justify-center gap-2 bg-kidemia-secondary"
                        >
                            {bulkOnboard.isPending
                                ? <><Loader2 size={15} className="animate-spin" /> Processing…</>
                                : "Upload & Process"
                            }
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}