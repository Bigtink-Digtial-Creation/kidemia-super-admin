export default function AssessmentRow({ assessment, index, isDifficult }: any) {
    return (
        <div className={`flex items-center justify-between p-4 bg-kidemia-biege border rounded-xl transition-all hover:translate-x-1 ${isDifficult ? 'border-rose-500/20' : 'border-slate-800'}`}>
            <div className="flex items-center gap-4">
                <span className="w-8 h-8 flex items-center justify-center bg-kidemia-primary
                 rounded-lg text-xs font-bold text-white">
                    {index + 1}
                </span>
                <div>
                    <h4 className="text-sm font-semibold text-slate-900">{assessment.title}</h4>
                    <p className="text-[10px] text-slate-900 uppercase tracking-tighter">{assessment.category}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`text-sm font-bold ${isDifficult ? 'text-slate-900' : 'text-slate-900'}`}>
                    {isDifficult ? assessment.pass_rate : assessment.average_score}%
                </p>
                <p className="text-[10px] text-slate-900 uppercase">Avg Score</p>
            </div>
        </div>
    );
}