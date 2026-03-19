import { Users, BookOpen, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from './MetricCard';
import AssessmentRow from './AssessmentRow';

export default function OverviewTab({ data }: { data: any }) {
    const metrics = [
        { label: 'Total Users', value: data?.overview?.total_users, change: '+12.5%', trend: 'up', icon: Users, color: '#ffffff' },
        { label: 'Active Students', value: data?.overview?.total_students, icon: BookOpen, color: '#ffffff' },
        { label: 'Total Revenue', value: `₦${(data?.overview?.total_revenue || 0).toLocaleString()}`, icon: DollarSign, color: '#ffffff' },
        { label: 'Completion Rate', value: `${data?.overview?.completion_rate || 0}%`, change: '-2.4%', trend: 'down', icon: Activity, color: '#ffffff' }
    ];


    // Helper to render chart content or empty state
    const renderChart = (chartData: any[], color: string, key: string = 'count') => {
        if (!chartData || chartData.length === 0) {
            return (
                <div className="h-full w-full flex flex-col items-center justify-center text-slate-400">
                    <TrendingUp size={32} className="opacity-20 mb-2" />
                    <p className="text-xs">No data available for this trend</p>
                </div>
            );
        }

        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        width={35}
                    />
                    <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Area
                        type="monotone"
                        dataKey={key}
                        stroke={color}
                        fill={`url(#color-${color})`}
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl min-w-0">
                    <h3 className="text-xl font-serif mb-6 text-slate-900">User Growth</h3>
                    <div className="h-72 w-full">
                        {renderChart(data?.trends?.user_growth, '#BF4C20')}
                    </div>
                </div>

                {/* Revenue Growth Chart */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl min-w-0">
                    <h3 className="text-xl font-serif mb-6 text-slate-900">Revenue Growth</h3>
                    <div className="h-72 w-full">
                        {renderChart(data?.trends?.revenue, '#6366F1', 'revenue')}
                    </div>
                </div>
            </div>

            {/* Star Performers Table */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                <h3 className="text-xl text-slate-900 font-semibold mb-6">Star Performers</h3>
                <div className="space-y-3">
                    {data?.assessments?.top_performing?.length > 0 ? (
                        data.assessments.top_performing.map((item: any, i: number) => (
                            <AssessmentRow key={i} assessment={item} index={i} />
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 italic py-4 text-center">No performance data yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}