export default function MetricCard({ label, value, change, trend, icon: Icon, color }: any) {
    return (
        <div className="bg-kidemia-primary/10 p-5 rounded-2xl vtransition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-kidemia-primary group-hover:bg-kidemia-secondary text-white">
                    <Icon size={20} style={{ color }} />
                </div>
                {change && (
                    <span className={`text-xs font-bold ${trend === 'up' ? 'text-kidemia-primary' : 'text-slate-900'}`}>
                        {change}
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{value || 0}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">{label}</p>
        </div>
    );
}