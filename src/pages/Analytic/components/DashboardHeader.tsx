import { Download } from 'lucide-react';
import { useNavigate } from 'react-router';
import { SidebarRoutes } from '../../../routes';

export default function DashboardHeader({ selectedPeriod, setSelectedPeriod }: any) {
    const navigate = useNavigate();
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
                <h1 className="text-xl md:text-3xl font-bold  text-kidemia-black">
                    Analytics Center
                </h1>
                <p className="text-slate-500 text-sm md:text-base font-light tracking-wide">Command & Control Platform Insights</p>
            </div>

            <div className="flex items-center gap-3">
                <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-medium t
                    ext-slate-300 outline-none focus:ring-2 ring-kidemia-secondary/50"
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last Quarter</option>
                </select>

                <button
                    onClick={() => navigate(SidebarRoutes.generateReport)}
                    className="flex items-center gap-2 bg-kidemia-secondary hover:bg-kidemia-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-kidemia-primary/20 active:scale-95"
                >
                    <Download size={16} />
                    <span className="hidden sm:inline">GENERATE REPORT</span>
                </button>

            </div>
        </header>
    );
}