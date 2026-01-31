

import { AlertCircle, Target, Timer, CheckCircle2 } from 'lucide-react';
import AssessmentRow from './AssessmentRow';

export default function PerformanceTab({ data }: { data: any }) {
    const perf = data?.assessment_performance;

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Avg. Platform Score', value: `${perf?.average_score || 0}%`, icon: Target, color: 'text-indigo-400' },
                    { label: 'Overall Pass Rate', value: `${perf?.pass_rate || 0}%`, icon: CheckCircle2, color: 'text-emerald-400' },
                    { label: 'Avg. Duration', value: `${(perf?.average_completion_time_minutes / 60).toFixed(2) || 0}m`, icon: Timer, color: 'text-amber-400' },
                ].map((item, i) => (
                    <div key={i} className="bg-kidemia-primary/10 p-6 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-3xl font-semibold text-kidemia-black ">{item.value}</p>
                        </div>
                        <item.icon className="text-kidemia-secondary" size={32} />
                    </div>
                ))}
            </div>

            {/* Difficult Assessments Table */}
            <div className="bg-white border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-500">Attention Required</h3>
                        <p className="text-sm text-slate-500">Assessments with the lowest success rates</p>
                    </div>
                    <AlertCircle className="text-rose-500" size={24} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.assessments?.most_difficult?.map((item: any, i: number) => (
                        <AssessmentRow key={i} assessment={item} index={i} isDifficult={true} />
                    ))}
                </div>
            </div>
        </div>
    );
}