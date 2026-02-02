import { Users2, Clock, MessageSquare, Zap } from 'lucide-react';

export default function EngagementTab({ data }: { data: any }) {
    const eng = data?.engagement;

    const stats = [
        { label: 'DAU', value: eng?.daily_active_users, desc: 'Daily Active Users', icon: Users2 },
        { label: 'MAU', value: eng?.monthly_active_users, desc: 'Monthly Active Users', icon: Zap },
        { label: 'Discussion', value: eng?.forum_posts_this_week, desc: 'Weekly Forum Posts', icon: MessageSquare },
        { label: 'Session Time', value: `${eng?.average_session_minutes / 60}m`, desc: 'Average Stay', icon: Clock },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in zoom-in-95 duration-500">
            {stats.map((item, i) => (
                <div key={i} className="bg-kidemia-primary/10 p-8 rounded-2xl text-center flex flex-col items-center 
                            group hover:bg-kidemia-primary/15 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-kidemia-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <item.icon className="text-white" size={20} />
                    </div>
                    <p className="text-3xl  font-bold text-kidemia-black mb-1">{item.value || 0}</p>
                    <p className="text-sm text-slate-400 font-medium">{item.label}</p>
                    <p className="text-[10px] text-slate-600 mt-4 uppercase tracking-widest">{item.desc}</p>
                </div>
            ))}
        </div>
    );
}