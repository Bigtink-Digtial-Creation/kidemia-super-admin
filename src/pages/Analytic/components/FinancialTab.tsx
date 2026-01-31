import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, PieChart as PieChartIcon } from 'lucide-react';

export default function FinancialTab({ data }: { data: any }) {
    const rev = data?.revenue;

    const chartData = [
        { name: 'Subscriptions', value: rev?.subscription_revenue || 0, color: '#3B0875' },
        { name: 'Assessments', value: rev?.assessment_revenue || 0, color: '#F28729' },
        { name: 'Wallet Topup', value: rev?.wallet_topup || 0, color: "#BF4C20" }
    ];


    // Check if we actually have data to display
    const hasData = chartData.some(item => item.value > 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {/* Revenue Metrics List */}
            <div className="lg:col-span-1 space-y-4">
                {[
                    { label: 'Total Revenue', value: rev?.total_revenue, sub: 'All-time' },
                    { label: 'Monthly Revenue', value: rev?.monthly_revenue, sub: 'Current period' },
                    { label: 'Avg. Transaction', value: rev?.average_transaction_value, sub: 'Per user' }
                ].map((item, i) => (
                    <div key={i} className="bg-kidemia-primary/10 p-6 rounded-2xl shadow-sm">
                        <p className="text-xs text-slate-500 uppercase tracking-tighter mb-1">{item.label}</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-kidemia-black">₦{item.value?.toLocaleString() ?? '0'}</span>
                            <span className="text-[10px] text-kidemia-black flex items-center"><ArrowUpRight size={10} /> 12%</span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-2 italic">{item.sub}</p>
                    </div>
                ))}
            </div>

            {/* Distribution Chart Section */}
            <div className="lg:col-span-2 bg-white  p-8 rounded-2xl flex flex-col items-center min-w-0">
                <h3 className="text-lg text-slate-900 font-semibold mb-4">Revenue Distribution</h3>

                <div className="h-64 w-full flex items-center justify-center">
                    {hasData ? (
                        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    animationBegin={200}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#260640',
                                        fontSize: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        /* Empty State UI */
                        <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                            <div className="p-4 bg-slate-50 rounded-full">
                                <PieChartIcon size={32} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-medium">No revenue data available</p>
                            <p className="text-xs">Transactions will appear here once processed.</p>
                        </div>
                    )}
                </div>

                {/* Legend - Only show if there's data */}
                {hasData && (
                    <div className="flex flex-wrap justify-center gap-6 mt-6">
                        {chartData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs text-slate-500 font-medium">{item.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}