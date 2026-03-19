import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
    Download, FileText, Table, FileSpreadsheet,
    CheckCircle, Globe, GraduationCap, FileBarChart,
    Wallet, Search, Settings2, CalendarDays, Loader2
} from 'lucide-react';
import { OpenAPI } from '../../sdk/generated';
import { getAuthHeaders } from '../../utils';
import { addToast } from '@heroui/react';


export default function ReportGenerator() {
    const [reportType, setReportType] = useState('platform_overview');
    const [exportFormat, setExportFormat] = useState('pdf');
    const [dateRange, setDateRange] = useState('last_30_days');
    const [selectedFilters, setSelectedFilters] = useState({
        includeCharts: true,
        includeRawData: false,
        includeRecommendations: true
    });
    const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');


    const downloadMutation = useMutation({
        mutationFn: async (payload: any) => {
            setDownloadStatus("downloading");

            const headers = await getAuthHeaders();
            const response = await fetch(`${OpenAPI.BASE}/api/v1/analytics/reports/generate`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Download failed");
            }

            // 1. Get the binary data correctly
            const blob = await response.blob();

            // 2. Extract filename from Content-Disposition header
            const contentDisposition = response.headers.get("content-disposition");
            const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
            const filename = filenameMatch?.[1] ?? `report_${Date.now()}.pdf`;

            // 3. Trigger browser download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();

            // 4. Cleanup
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            setDownloadStatus("success");
        },
        onError: (error: any) => {
            addToast({
                title: "An error occurred",
                description: error?.body.message || error?.body?.detail || error?.message || "Network Error",
                color: "danger",
            });
            setDownloadStatus("error");
        }
    });


    const handleDownload = () => {
        downloadMutation.mutate({
            report_type: reportType,
            format: exportFormat,
            date_range: dateRange,
            filters: selectedFilters
        });
    };

    const reportTypes = [
        { value: 'platform_overview', label: 'Platform Overview', icon: Globe },
        { value: 'student_performance', label: 'Student Performance', icon: GraduationCap },
        { value: 'assessment_analysis', label: 'Assessment Metrics', icon: FileBarChart },
        { value: 'financial', label: 'Financial Report', icon: Wallet },
        { value: 'question_quality', label: 'Question Quality', icon: Search }
    ];

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="mb-8">
                <h2 className="text-2xl text-slate-900">Report Generator</h2>
                <p className="text-slate-500 text-sm">Configure and download detailed analytics reports in multiple formats.</p>
            </div>

            {/* Download Status Banner */}
            {downloadStatus !== 'idle' && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${downloadStatus === 'success' ? 'bg-emerald-50 border-emerald-200' :
                    downloadStatus === 'error' ? 'bg-rose-50 border-rose-200' :
                        'bg-blue-50 border-blue-200'
                    }`}>
                    {downloadStatus === 'downloading' && (
                        <>
                            <Loader2 className="animate-spin text-blue-600" size={20} />
                            <span className="text-sm font-medium text-blue-900">Generating your report...</span>
                        </>
                    )}
                    {downloadStatus === 'success' && (
                        <>
                            <CheckCircle className="text-emerald-600" size={20} />
                            <span className="text-sm font-medium text-emerald-900">Report downloaded successfully!</span>
                        </>
                    )}
                    {downloadStatus === 'error' && (
                        <>
                            <svg className="text-rose-600" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-sm font-medium text-rose-900">Download failed. Please try again.</span>
                        </>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Report Type Selection */}
                <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <Globe className="text-kidemia-primary" size={20} />
                        Select Report Type
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {reportTypes.map((type) => {
                            const Icon = type.icon;
                            const isActive = reportType === type.value;
                            return (
                                <button
                                    key={type.value}
                                    onClick={() => setReportType(type.value)}
                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left
                                        ${isActive
                                            ? 'border-kidemia-primary bg-kidemia-primary/5 ring-1 ring-kidemia-primary'
                                            : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'}`}
                                >
                                    <div className={`p-2 rounded-lg ${isActive ? 'bg-kidemia-primary text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>
                                        <Icon size={18} />
                                    </div>
                                    <span className={`font-medium text-sm ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                                        {type.label}
                                    </span>
                                    {isActive && <CheckCircle size={16} className="ml-auto text-kidemia-primary" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Format Selection */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <Settings2 className="text-kidemia-secondary" size={20} />
                        Export Format
                    </h3>
                    <div className="space-y-3">
                        {[
                            { id: 'pdf', label: 'PDF Document', icon: FileText, desc: 'Professional report' },
                            { id: 'excel', label: 'Excel Spreadsheet', icon: FileSpreadsheet, desc: 'Multi-sheet workbook' },
                            { id: 'csv', label: 'CSV File', icon: Table, desc: 'Raw data export' }
                        ].map((format) => (
                            <button
                                key={format.id}
                                onClick={() => setExportFormat(format.id)}
                                className={`w-full flex items-center p-3.5 rounded-xl border transition-all
                                    ${exportFormat === format.id
                                        ? 'border-kidemia-secondary bg-kidemia-secondary/5 ring-1 ring-kidemia-secondary'
                                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
                            >
                                <format.icon size={18} className={exportFormat === format.id ? 'text-kidemia-secondary' : 'text-slate-400'} />
                                <div className="ml-3 text-left flex-1">
                                    <span className={`text-sm font-medium block ${exportFormat === format.id ? 'text-slate-900' : 'text-slate-600'}`}>
                                        {format.label}
                                    </span>
                                    <span className="text-xs text-slate-400">{format.desc}</span>
                                </div>
                                {exportFormat === format.id && <CheckCircle size={16} className="text-kidemia-secondary" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Parameters */}
                <div className="lg:col-span-3 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                                <CalendarDays size={16} /> Time Period
                            </h3>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3 outline-none focus:ring-2 ring-kidemia-primary/20"
                            >
                                <option value="last_7_days">Past 7 Days</option>
                                <option value="last_30_days">Past 30 Days</option>
                                <option value="last_90_days">Past Quarter</option>
                                <option value="last_year">Past Year</option>
                            </select>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4">Inclusions</h3>
                            <div className="flex flex-wrap gap-6">
                                {Object.entries(selectedFilters).map(([key, value]) => (
                                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={value}
                                            onChange={(e) => setSelectedFilters(prev => ({ ...prev, [key]: e.target.checked }))}
                                            className="w-5 h-5 rounded border-slate-300 text-kidemia-primary focus:ring-kidemia-primary/20 transition-all"
                                        />
                                        <span className="text-sm text-slate-600 group-hover:text-slate-900 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end items-center gap-4">
                        <button
                            onClick={handleDownload}
                            disabled={downloadMutation.isPending || downloadStatus === 'downloading'}
                            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all
                                ${downloadMutation.isPending || downloadStatus === 'downloading'
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-kidemia-secondary hover:bg-kidemia-primary text-white shadow-sm hover:shadow-md'}`}
                        >
                            {downloadMutation.isPending || downloadStatus === 'downloading' ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download size={18} />
                                    Download Report
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Downloads (Optional) */}
            {downloadStatus === 'success' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-tight">Recent Download</h3>
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-100">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <CheckCircle className="text-emerald-600" size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                                {reportTypes.find(t => t.value === reportType)?.label} Report
                            </p>
                            <p className="text-xs text-slate-500">
                                {exportFormat.toUpperCase()} • Downloaded just now
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}