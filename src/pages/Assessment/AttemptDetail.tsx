import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Chip,
    Divider,
} from "@heroui/react";
import { MdAssessment, MdOutlineDashboard, MdArrowBack } from "react-icons/md";
import { FaCheck, FaClock, FaCalendar, FaShieldAlt } from "react-icons/fa";
import { SidebarRoutes } from "../../routes";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import BallSpinner from "../../components/Spinner/BallSpinner";
import { formatDateToDDMMYYYY } from "../../utils";

export default function AttemptDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: attemptDetail, isLoading } = useQuery({
        queryKey: [QueryKeys.attemptDetail, id],
        queryFn: async () => {
            const response = await ApiSDK.AttemptsService?.getAttemptDetailApiV1AttemptsAttemptIdDetailGet(id!);
            return response;
        },
        enabled: !!id,
    });

    if (isLoading || !attemptDetail) {
        return (
            <div className="h-screen flex justify-center items-center">
                <BallSpinner />
            </div>
        );
    }

    const formatTime = (seconds: number | null) => {
        if (!seconds) return "N/A";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return hours > 0 ? `${hours}h ${minutes}m ${secs}s` : `${minutes}m ${secs}s`;
    };



    const getStatusColor = (status: string) => {
        const colors: any = { completed: "success", in_progress: "warning", abandoned: "danger" };
        return colors[status] || "default";
    };

    const hasViolations = attemptDetail.violations_summary?.total > 0;

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

                {/* --- NAVIGATION --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Breadcrumbs size="sm" variant="light" className="mb-2">
                            <BreadcrumbItem href={SidebarRoutes.dashboard} startContent={<MdOutlineDashboard />}>Dashboard</BreadcrumbItem>
                            <BreadcrumbItem href={SidebarRoutes.assessment} startContent={<MdAssessment />}>Assessments</BreadcrumbItem>
                            <BreadcrumbItem>Attempt Detail</BreadcrumbItem>
                        </Breadcrumbs>
                        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                            {attemptDetail.assessment_title}
                        </h1>
                        <p className="text-neutral-500 text-sm mt-1">Attempt ID: <span className="font-mono">{id?.slice(0, 8)}</span></p>
                    </div>
                    <Button
                        variant="flat"
                        onPress={() => navigate(-1)}
                        startContent={<MdArrowBack />}
                        className="w-full md:w-auto bg-kidemia-secondary text-white"
                    >
                        Back to List
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* --- MAIN CONTENT (LEFT) --- */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* Section: Stats Grid */}
                        <section>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatBox label="Score" value={`${attemptDetail.score_percentage?.toFixed(1)}`} subValue={`${attemptDetail.score}/${attemptDetail.total_points} pts`} highlight />
                                <StatBox label="Duration" value={formatTime(attemptDetail.time_taken)} icon={<FaClock className="text-blue-500" />} />
                                <StatBox label="Status" value={attemptDetail.status.replace('_', ' ')} statusColor={getStatusColor(attemptDetail.status)} />
                                <StatBox label="Result" value={attemptDetail.passed ? "Passed" : "Failed"} statusColor={attemptDetail.passed ? "success" : "danger"} />
                            </div>
                        </section>

                        {/* Section: Student Profile */}
                        <section className="bg-neutral-50 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-kidemia-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {attemptDetail.user_name?.charAt(0)}
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h3 className="text-lg font-bold text-neutral-900">{attemptDetail.user_name}</h3>
                                <p className="text-neutral-600">{attemptDetail.user_email}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-xs text-neutral-500">
                                    <span className="flex items-center gap-1"><FaCalendar /> Started: {formatDateToDDMMYYYY(attemptDetail.started_at)}</span>
                                    {attemptDetail.ip_address && <span className="font-mono">IP: {attemptDetail.ip_address}</span>}
                                </div>
                            </div>
                        </section>

                        {/* Section: Proctoring */}
                        {attemptDetail.proctoring_enabled && (
                            <section className="border-t border-neutral-100 pt-8">
                                <div className="flex items-center gap-2 mb-6">
                                    <FaShieldAlt className="text-neutral-900 w-5 h-5" />
                                    <h2 className="text-xl font-bold">Integrity Report</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <ViolationMetric label="Tab Switches" count={attemptDetail.violations_summary?.tab_switches} color="orange" />
                                    <ViolationMetric label="Webcam Issues" count={attemptDetail.violations_summary?.webcam_violations} color="red" />
                                    <ViolationMetric label="FS Exits" count={attemptDetail.violations_summary?.fullscreen_exits} color="purple" />
                                </div>

                                {hasViolations ? (
                                    <div className="space-y-4">
                                        {attemptDetail.violations.map((v: any, i: number) => (
                                            <div key={i} className="flex gap-4 group">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-2 h-2 rounded-full bg-neutral-300 mt-2 group-hover:bg-red-500 transition-colors" />
                                                    <div className="w-px h-full bg-neutral-100" />
                                                </div>
                                                <div className="pb-6">
                                                    <p className="text-sm font-semibold capitalize text-neutral-800">
                                                        {v.event_type.replace(/_/g, " ")}
                                                    </p>
                                                    <p className="text-xs text-neutral-500 mb-2">
                                                        {formatDateToDDMMYYYY(v.timestamp)}
                                                    </p>

                                                    {v.details && (
                                                        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-2">
                                                            {typeof v.details === 'object' ? (
                                                                Object.entries(v.details).map(([key, value]) => (
                                                                    <div key={key} className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-neutral-200/50 last:border-0 pb-1 last:pb-0">
                                                                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                                                                            {key.replace(/_/g, " ")}
                                                                        </span>
                                                                        <span className="text-xs text-neutral-700 font-medium">
                                                                            {String(value)}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-sm text-neutral-600">{v.details}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-green-50/50 rounded-xl border border-dashed border-green-200">
                                        <FaCheck className="mx-auto text-green-500 mb-2" />
                                        <p className="text-green-700 font-medium">No violations recorded</p>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>

                    {/* --- SIDEBAR (RIGHT) --- */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-neutral-50 rounded-2xl p-6 sticky top-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">Assessment Specs</h3>
                            <div className="space-y-4">
                                <SidebarRow label="Subject Code" value={attemptDetail.assessment_code} />
                                <SidebarRow label="Total Questions" value={attemptDetail.total_questions} />
                                <SidebarRow label="Duration" value={`${attemptDetail.duration_minutes}m`} />
                                <SidebarRow label="Passing Mark" value={`${attemptDetail.passing_percentage}%`} />
                                <Divider className="my-2" />
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-sm text-neutral-500">Proctoring</span>
                                    <Chip size="sm" variant="dot" color={attemptDetail.proctoring_enabled ? "warning" : "default"}>
                                        {attemptDetail.proctoring_enabled ? "Active" : "Off"}
                                    </Chip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function StatBox({ label, value, subValue, statusColor, highlight }: any) {
    return (
        <div className={`p-4 rounded-2xl border ${highlight ? 'border-blue-100 bg-blue-50/30' : 'border-neutral-100'}`}>
            <p className="text-xs font-medium text-neutral-500 mb-1">{label}</p>
            <div className="flex items-baseline gap-1">
                {statusColor ? (
                    <Chip size="sm" color={statusColor} variant="flat" className="font-bold uppercase text-[10px]">
                        {value}
                    </Chip>
                ) : (
                    <span className="text-xl font-bold text-neutral-900">{value}</span>
                )}
            </div>
            {subValue && <p className="text-[10px] text-neutral-400 mt-1">{subValue}</p>}
        </div>
    );
}

function ViolationMetric({ label, count, color }: any) {
    const colors: any = {
        orange: "bg-orange-50 text-orange-700 border-orange-100",
        red: "bg-red-50 text-red-700 border-red-100",
        purple: "bg-purple-50 text-purple-700 border-purple-100",
    };
    return (
        <div className={`p-3 rounded-xl border ${colors[color]} flex justify-between items-center`}>
            <span className="text-xs font-semibold">{label}</span>
            <span className="text-lg font-bold">{count || 0}</span>
        </div>
    );
}

function SidebarRow({ label, value }: { label: string; value: any }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-500">{label}</span>
            <span className="text-sm font-semibold text-neutral-800">{value}</span>
        </div>
    );
}