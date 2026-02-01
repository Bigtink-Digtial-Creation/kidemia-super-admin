import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import OverviewTab from './components/OverviewTab';
import PerformanceTab from './components/PerformanceTab';
import FinancialTab from './components/FinancialTab';
import EngagementTab from './components/EngagementTab';
import { QueryKeys } from '../../utils/queryKeys';
import { ApiSDK } from '../../sdk';
import DashboardHeader from './components/DashboardHeader';

export default function AnalyticsDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState('30d');
    const [activeTab, setActiveTab] = useState('overview');

    const { data: dashboardData, isLoading } = useQuery({
        queryKey: [QueryKeys.reportDashboard, selectedPeriod],
        queryFn: () => ApiSDK.AnalyticsService.getAdminDashboardApiV1AnalyticsReportAdminGet(),
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-kidemia-white p-4 md:p-8 font-sans text-slate-200">
            <DashboardHeader
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
            />

            {/* Responsive Tab Navigation */}
            <nav className="flex gap-2 border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
                {['overview', 'performance', 'financial', 'engagement'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 px-6 text-sm font-medium transition-all capitalize ${activeTab === tab
                            ? 'text-kidemia-secondary border-b-2 border-kidemia-secondary'
                            : 'text-kidemia-primary hover:text-kidemia-primary/10'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            <main className="animate-in fade-in duration-700">
                {activeTab === 'overview' && <OverviewTab data={dashboardData} />}
                {activeTab === 'performance' && <PerformanceTab data={dashboardData} />}
                {activeTab === 'financial' && <FinancialTab data={dashboardData} />}
                {activeTab === 'engagement' && <EngagementTab data={dashboardData} />}
            </main>
        </div>
    );
}

const LoadingSpinner = () => (
    <div className="min-h-screen bg-kidemia-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-kidemia-primary rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-light tracking-widest">Analyzing Patterns...</p>
    </div>
);