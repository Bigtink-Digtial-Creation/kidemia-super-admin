import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
    Download, FileText, Table, FileSpreadsheet,
    CheckCircle, Globe, GraduationCap, FileBarChart,
    Wallet, Search, Settings2, CalendarDays
} from 'lucide-react';
import { ApiSDK } from '../../sdk';

export default function ReportGenerator() {
    const [reportType, setReportType] = useState('platform_overview');
    const [exportFormat, setExportFormat] = useState('pdf');
    const [dateRange, setDateRange] = useState('last_30_days');
    const [selectedFilters, setSelectedFilters] = useState({
        includeCharts: true,
        includeRawData: false,
        includeRecommendations: true
    });

    const mutation = useMutation({
        mutationFn: (payload: any) =>
            ApiSDK.AnalyticsService.generateReportApiV1AnalyticsReportsGeneratePost(payload),
        onSuccess: (data) => {
            if (data?.download_url) window.open(data.download_url, '_blank');
        },
        onError: (error) => console.error('Report generation failed:', error)
    });

    const reportTypes = [
        { value: 'platform_overview', label: 'Platform Overview', icon: Globe },
        { value: 'student_performance', label: 'Student Performance', icon: GraduationCap },
        { value: 'assessment_analysis', label: 'Assessment Metrics', icon: FileBarChart },
        { value: 'financial', label: 'Financial Report', icon: Wallet },
        { value: 'question_quality', label: 'Question Quality', icon: Search }
    ];

    return (
        <div className="space-y-6">
            {/* Header section matches OverviewTab text style */}
            <div className="mb-8">
                <h2 className="text-2xl  text-slate-900">Report Generator</h2>
                <p className="text-slate-500 text-sm">Configure and export detailed analytics for your platform.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Report Type Selection (Taking more space) */}
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
                            { id: 'pdf', label: 'PDF Document', icon: FileText },
                            { id: 'excel', label: 'Excel Spreadsheet', icon: FileSpreadsheet },
                            { id: 'csv', label: 'Raw CSV File', icon: Table }
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
                                <span className={`ml-3 text-sm font-medium ${exportFormat === format.id ? 'text-slate-900' : 'text-slate-600'}`}>
                                    {format.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Parameters (Full width bottom row) */}
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
                                            {key.replace(/([A-Z])/g, ' $1')}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end items-center gap-4">
                        {mutation.isError && <span className="text-xs text-red-500 font-medium text-red-500">Generation failed. Please try again.</span>}
                        <button
                            onClick={() => mutation.mutate({
                                report_type: reportType,
                                format: exportFormat,
                                date_range: dateRange,
                                filters: selectedFilters
                            })}
                            disabled={mutation.isPending}
                            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all
                                ${mutation.isPending
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-kidemia-secondary hover:bg-kidemia-primaary text-white shadow-sm'}`}
                        >
                            {mutation.isPending ? (
                                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                            ) : <Download size={18} />}
                            {mutation.isPending ? 'Processing...' : 'Export Report'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}