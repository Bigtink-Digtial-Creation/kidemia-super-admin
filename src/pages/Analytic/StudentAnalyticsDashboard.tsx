import { useState } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Target, Trophy, TrendingUp, BookOpen, Award,
  Star, Zap, Flame, CheckCircle,
  BarChart3, AlertCircle, LayoutDashboard, Map, Compass
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ApiSDK } from '../../sdk';
import type {
  PersonalizedRecommendation,
  StudentPerformanceResponse
} from '../../sdk/generated';

export default function EnhancedStudentAnalyticsDashboard() {
  const studentId = "735f68ef-4873-456b-ab29-8e39c0af86d7";
  const [activeView, setActiveView] = useState<'overview' | 'topics' | 'study-plan'>('overview');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['studentAnalytics', studentId],
    queryFn: () => ApiSDK.AnalyticsService.getStudentDashboardApiV1AnalyticsReportStudentStudentIdGet(studentId),
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* 1. Brand Hero Header */}
      <header className="relative overflow-hidden rounded-2xl bg-kidemia-secondary/5 p-6 md:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-black">
              Hello, Scholar!
            </h1>
            <p className="text-slate-900 text-base md:text-lg max-w-md">
              You've mastered <span className="text-kidemia-primary font-semibold">{data.topic_breakdown?.filter(t => t.mastery_level === 'MASTERED').length} topics</span> this month. Keep up the momentum!
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4">
            <GamificationBadge icon={<Award className="text-orange-500" />} label="Level" value={data.performance_summary?.gamification?.level || 1} />
            <GamificationBadge icon={<Flame className="text-orange-500" />} label="Streak" value={`${data.performance_summary?.gamification?.current_streak || 0}d`} />
            <GamificationBadge icon={<Star className="text-orange-500" />} label="Points" value={data.performance_summary?.gamification?.total_points || 0} />
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-kidemia-primary/10 blur-[100px]" />
      </header>

      {/* 2. Professional Navigation Tabs */}
      <nav className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200">
        <TabButton
          active={activeView === 'overview'}
          onClick={() => setActiveView('overview')}
          icon={<LayoutDashboard size={18} />}
          label="Overview"
        />
        <TabButton
          active={activeView === 'topics'}
          onClick={() => setActiveView('topics')}
          icon={<Map size={18} />}
          label="Topics"
        />
        <TabButton
          active={activeView === 'study-plan'}
          onClick={() => setActiveView('study-plan')}
          icon={<Compass size={18} />}
          label="Study Plan"
        />
      </nav>

      {/* 3. Main Content Area */}
      <main className="min-h-[600px]">
        {activeView === 'overview' && <OverviewSection data={data} />}
        {activeView === 'topics' && <TopicSection data={data} />}
        {activeView === 'study-plan' && <StudyPlanSection data={data} />}
      </main>
    </div>
  );
}

// --- View Sections ---

function OverviewSection({ data }: { data: StudentPerformanceResponse }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Target} label="Avg Score" value={`${data.performance_summary?.average_score}%`} trend="+5.2%" color="primary" />
        <MetricCard icon={BookOpen} label="Attempts" value={data.performance_summary?.completed_attempts} color="secondary" />
        <MetricCard icon={TrendingUp} label="Pass Rate" value={`${data.performance_summary?.pass_rate}%`} color="emerald" />
        <MetricCard icon={Trophy} label="Best" value={`${data.performance_summary?.best_score}%`} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Subject Mastery" icon={<Zap className="text-kidemia-primary" />}>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <RadarChart data={data.subject_breakdown?.map(s => ({ name: s.subject_name.slice(0, 10), score: s.average_score }))}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
              <Radar name="Score" dataKey="score" stroke="#BF4C20" fill="#BF4C20"
                fillOpacity={0.5} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Performance Growth" icon={<TrendingUp className="text-kidemia-secondary" />}>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <LineChart data={data.progress_over_time}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" hide />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="average_score" stroke="#6366F1" strokeWidth={3} dot={{ r: 4, fill: '#6366F1' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">Focus Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.personalized_recommendations?.map((rec, i) => (
            <RecommendationCard key={i} rec={rec} />
          ))}
        </div>
      </div>
    </div>
  );
}



function TopicSection({ data }: { data: StudentPerformanceResponse }) {
  const [filter, setFilter] = useState<'ALL' | 'MASTERED' | 'DEVELOPING' | 'NEEDS_ATTENTION'>('ALL');

  // Logic for filtering and sorting
  const filteredTopics = data.topic_breakdown?.filter(topic => {
    if (filter === 'ALL') return true;
    if (filter === 'NEEDS_ATTENTION') return (topic.success_rate || 0) < 60;
    return topic.mastery_level === filter;
  }).sort((a, b) => (a.success_rate || 0) - (b.success_rate || 0)); // Sort by lowest score first to show trouble areas

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TopicStatCard
          icon={<CheckCircle className="text-emerald-600" />}
          label="Mastered"
          count={data.topic_breakdown?.filter(t => t.mastery_level === 'MASTERED').length}
          color="emerald"
        />
        <TopicStatCard
          icon={<AlertCircle className="text-orange-600" />}
          label="Needs Work"
          count={data.topic_breakdown?.filter(t => (t.success_rate || 0) < 60).length}
          color="orange"
        />
        <TopicStatCard
          icon={<BarChart3 className="text-blue-600" />}
          label="Total Topics"
          count={data.topic_breakdown?.length}
          color="blue"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-lg text-slate-800">Topic Proficiency</h3>

          <div className="flex flex-wrap gap-2">
            {['ALL', 'MASTERED', 'DEVELOPING', 'NEEDS_ATTENTION'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filter === f
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTopics && filteredTopics.length > 0 ? (
            filteredTopics.map((topic, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-10 rounded-full ${(topic.success_rate || 0) >= 80 ? 'bg-emerald-500' :
                    (topic.success_rate || 0) >= 60 ? 'bg-kidemia-secondary' : 'bg-orange-500'
                    }`} />
                  <div>
                    <p className="font-bold text-slate-900">{topic.topic_name}</p>
                    <p className="text-xs text-slate-500 font-medium">{topic.subject_name}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8">
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-slate-400 font-black tracking-wider">Accuracy</p>
                    <p className={`font-bold text-lg ${(topic.success_rate || 0) < 60 ? 'text-orange-600' : 'text-slate-900'
                      }`}>
                      {topic.success_rate}%
                    </p>
                  </div>

                  <div className="min-w-[100px] text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${topic.mastery_level === 'MASTERED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                      {topic.mastery_level?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-medium italic">No topics found matching this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function StudyPlanSection({ data }: { data: StudentPerformanceResponse }) {
  if (!data.study_plan) return <div className="p-12 text-center text-slate-500">Plan generating...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-kidemia-primary to-kidemia-secondary rounded-2xl p-6 md:p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">{data.study_plan.duration_days}-Day Growth Path</h3>
        <p className="opacity-90">Focusing on {data.study_plan.focus_areas.length} key areas to improve your score.</p>
        <div className="mt-6 flex gap-8">
          <div>
            <p className="text-xs font-bold opacity-70 uppercase">Daily Goal</p>
            <p className="text-xl font-bold">{data.study_plan.daily_study_minutes} mins</p>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <p className="text-xs font-bold opacity-70 uppercase">Next Milestone</p>
            <p className="text-xl font-bold">{data.study_plan.milestones[0]?.target || 'Keep Going!'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.study_plan.focus_areas.map((area, i) => (
          <div key={i} className="bg-white border-l-4 border-l-kidemia-primary border border-slate-200 p-4 rounded-xl">
            <p className="text-[10px] font-black text-kidemia-primary uppercase mb-1">Priority {area.priority}</p>
            <h4 className="font-bold text-slate-900 leading-tight mb-2">{area.topic}</h4>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Daily Focus:</span>
              <span className="font-bold text-slate-900">{area.daily_minutes}m</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Reusable UI Components ---

function GamificationBadge({ icon, label, value }: any) {
  return (
    <div className="bg-kidemia-primary backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
      <div className="shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] uppercase font-bold text-white leading-none mb-1">{label}</p>
        <p className="text-sm font-bold leading-none">{value}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${active ? 'bg-white text-kidemia-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MetricCard({ icon: Icon, label, value, color }: any) {
  const colors: any = {
    primary: 'bg-kidemia-primary/10 text-kidemia-primary',
    secondary: 'bg-kidemia-secondary/10 text-kidemia-secondary',
    emerald: 'bg-emerald-100 text-emerald-700',
    rose: 'bg-rose-100 text-rose-700',
  };
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ChartCard({ title, icon, children }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>
      <div className="flex-1 w-full min-h-[300px]">
        {children}
      </div>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: PersonalizedRecommendation }) {
  return (
    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl">{rec.icon}</span>
        <h4 className="font-bold text-sm text-slate-900">{rec.title}</h4>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{rec.description}</p>
    </div>
  )
}

function TopicStatCard({ icon, label, count, color }: any) {
  const borders: any = { dark: 'border-slate-900', primary: 'border-kidemia-primary', secondary: 'border-kidemia-secondary' };
  return (
    <div className={`bg-white border ${borders[color]} p-5 rounded-2xl flex items-center gap-4`}>
      {icon}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase">{label}</p>
        <p className="text-2xl font-black text-slate-900">{count}</p>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] animate-pulse">
      <div className="w-12 h-12 border-4 border-kidemia-primary/20 border-t-kidemia-primary rounded-full animate-spin mb-4" />
      <p className="text-slate-400 font-medium">Preparing your personalized dashboard...</p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="text-center p-20 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600">
      <AlertCircle className="mx-auto mb-4" size={48} />
      <h3 className="text-xl font-bold">Failed to load analytics</h3>
      <p>Please check your connection or try again later.</p>
    </div>
  );
}