import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import {
    ArrowLeft, BookOpen, Settings, Shield, Calendar,
    ChevronRight, ChevronLeft, Check,
} from "lucide-react";
import { ApiSDK } from "../../sdk";
import { useInstitution } from "../../context/InstitutionContext";
import { useCreateInstitutionAssessment } from "../../hooks/useSchools";
import { useSubjects } from "../../hooks/useSubjects";


type Tab = "content" | "behavior" | "proctoring" | "schedule";

const TABS: { key: Tab; label: string; icon: typeof BookOpen }[] = [
    { key: "content", label: "Content", icon: BookOpen },
    { key: "behavior", label: "Behavior", icon: Settings },
    { key: "proctoring", label: "Proctoring", icon: Shield },
    { key: "schedule", label: "Schedule", icon: Calendar },
];

function Toggle({
    value,
    onChange,
    label,
    description,
}: {
    value: boolean;
    onChange: (v: boolean) => void;
    label: string;
    description?: string;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">{label}</p>
                {description && (
                    <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                )}
            </div>
            <button
                onClick={() => onChange(!value)}
                className="w-10 h-5 rounded-full transition-colors flex items-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: value ? "#e07b39" : "#e5e7eb" }}
            >
                <span
                    className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${value ? "translate-x-5" : "translate-x-0"
                        }`}
                />
            </button>
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-800/50 last:border-0">
            <span className="text-sm text-slate-400">{label}</span>
            <span className="text-sm font-semibold text-white truncate max-w-[160px]">
                {value}
            </span>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────
export default function CreateInstitutionAssessment() {
    const navigate = useNavigate();
    const { institutionId } = useInstitution();
    const createAssessment = useCreateInstitutionAssessment();

    const [activeTab, setActiveTab] = useState<Tab>("content");

    // Content
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
    const [numberOfQuestions, setNumberOfQuestions] = useState("20");
    const [instructions, setInstructions] = useState("");

    // Behavior
    const [duration, setDuration] = useState("60");
    const [passingPercentage, setPassingPercentage] = useState("50");
    const [maxAttempts, setMaxAttempts] = useState("1");
    const [shuffleQuestions, setShuffleQuestions] = useState(true);
    const [shuffleOptions, setShuffleOptions] = useState(true);
    const [allowNavigation, setAllowNavigation] = useState(true);
    const [allowReview, setAllowReview] = useState(true);
    const [resultDisplayMode, setResultDisplayMode] = useState("immediate");
    const [showCorrectAnswers, setShowCorrectAnswers] = useState(true);
    const [showExplanations, setShowExplanations] = useState(true);
    const [autoSubmit, setAutoSubmit] = useState(true);

    // Proctoring
    const [enableProctoring, setEnableProctoring] = useState(false);
    const [requireWebcam, setRequireWebcam] = useState(false);
    const [fullscreenRequired, setFullscreenRequired] = useState(true);
    const [detectTabSwitching, setDetectTabSwitching] = useState(true);
    const [maxTabSwitches, setMaxTabSwitches] = useState("3");

    // Schedule
    const [availableFrom, setAvailableFrom] = useState("");
    const [availableUntil, setAvailableUntil] = useState("");
    const [publishNow, setPublishNow] = useState(true);

    // Subjects + topics
    const { subjects, setFilters: setSubjectFilters, isLoading: subjectsLoading } =
        useSubjects();

    const { data: topicsData, isLoading: topicsLoading } = useQuery({
        queryKey: ["topics", selectedSubjectId],
        queryFn: () =>
            ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(
                selectedSubjectId
            ),
        enabled: !!selectedSubjectId,
    });

    const topics = topicsData?.items ?? [];

    const toggleTopic = (id: string) =>
        setSelectedTopicIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    const currentTabIndex = TABS.findIndex((t) => t.key === activeTab);
    const isFirst = currentTabIndex === 0;
    const isLast = currentTabIndex === TABS.length - 1;

    const goNext = () => {
        if (!isLast) setActiveTab(TABS[currentTabIndex + 1].key);
    };
    const goPrev = () => {
        if (!isFirst) setActiveTab(TABS[currentTabIndex - 1].key);
    };

    const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

    const handleSubmit = () => {
        if (!selectedSubjectId || selectedTopicIds.length === 0) {
            addToast({
                title: "Missing required fields",
                description: "Please select a subject and at least one topic.",
                color: "warning",
            });
            setActiveTab("content");
            return;
        }

        createAssessment.mutate(
            {
                subject_id: selectedSubjectId,
                topic_ids: selectedTopicIds,
                number_of_questions: parseInt(numberOfQuestions),
                instructions: instructions || undefined,
                duration_minutes: parseInt(duration),
                available_from: availableFrom || undefined,
                available_until: availableUntil || undefined,
                passing_percentage: parseFloat(passingPercentage),
                max_attempts: parseInt(maxAttempts),
                shuffle_questions: shuffleQuestions,
                shuffle_options: shuffleOptions,
                allow_question_navigation: allowNavigation,
                allow_backward_navigation: allowReview,
                result_display_mode: resultDisplayMode as any,
                show_correct_answers: showCorrectAnswers,
                show_explanations: showExplanations,
                proctoring_enabled: enableProctoring,
                require_webcam: requireWebcam,
                fullscreen_required: fullscreenRequired,
                detect_tab_switching: detectTabSwitching,
                max_tab_switches: parseInt(maxTabSwitches),
                auto_submit_on_time_up: autoSubmit,
                publish: publishNow,
            },
            {
                onSuccess: () => {
                    addToast({
                        title: "Assessment created",
                        description: publishNow
                            ? "Assessment published and ready to assign."
                            : "Assessment saved as draft.",
                        color: "success",
                    });
                    navigate(`/institution/${institutionId}/dashboard`);
                },
                onError: (err: any) => {
                    addToast({
                        title: "Failed to create assessment",
                        description: err?.body?.detail || err?.message,
                        color: "danger",
                    });
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-6xl mx-auto px-4 pt-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(`/institution/${institutionId}/dashboard`)}
                        className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={18} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Create Assessment
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Build a test for your students
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Tab nav */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1">
                            {TABS.map((tab, i) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.key;
                                const isDone = i < currentTabIndex;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${isActive
                                            ? "text-white shadow-sm"
                                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                            }`}
                                        style={isActive ? { backgroundColor: "#e07b39" } : {}}
                                    >
                                        {isDone ? (
                                            <Check size={13} className="text-green-500" />
                                        ) : (
                                            <Icon size={13} />
                                        )}
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab content */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                            {/* ── CONTENT ── */}
                            {activeTab === "content" && (
                                <div className="space-y-5">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <BookOpen size={16} className="text-orange-500" />
                                        Subject & Topics
                                    </h3>

                                    {/* Subject */}
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Search subjects…"
                                            onChange={(e) =>
                                                setSubjectFilters((f) => ({
                                                    ...f,
                                                    search: e.target.value,
                                                }))
                                            }
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 mb-2"
                                        />
                                        {subjectsLoading ? (
                                            <div className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                                                {subjects.map((s) => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => {
                                                            setSelectedSubjectId(s.id);
                                                            setSelectedTopicIds([]);
                                                        }}
                                                        className={`px-3 py-2 rounded-xl text-sm text-left transition-all border ${selectedSubjectId === s.id
                                                            ? "border-orange-300 bg-orange-50 text-orange-700 font-medium"
                                                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                                                            }`}
                                                    >
                                                        {s.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Topics */}
                                    {selectedSubjectId && (
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                    Topics *
                                                </label>
                                                <span className="text-xs text-orange-600 font-medium">
                                                    {selectedTopicIds.length} selected
                                                </span>
                                            </div>
                                            {topicsLoading ? (
                                                <div className="space-y-2">
                                                    {Array.from({ length: 4 }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="h-9 bg-gray-50 rounded-xl animate-pulse"
                                                        />
                                                    ))}
                                                </div>
                                            ) : topics.length === 0 ? (
                                                <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-xl">
                                                    No topics found for this subject.
                                                </p>
                                            ) : (
                                                <div className="space-y-1 max-h-52 overflow-y-auto">
                                                    {/* Select all */}
                                                    <label className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedTopicIds.length === topics.length}
                                                            onChange={() =>
                                                                setSelectedTopicIds(
                                                                    selectedTopicIds.length === topics.length
                                                                        ? []
                                                                        : topics.map((t: any) => t.id)
                                                                )
                                                            }
                                                            className="w-4 h-4 rounded accent-orange-500"
                                                        />
                                                        <span className="text-xs font-semibold text-gray-500">
                                                            Select all ({topics.length})
                                                        </span>
                                                    </label>
                                                    {topics.map((t: any) => (
                                                        <label
                                                            key={t.id}
                                                            className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${selectedTopicIds.includes(t.id)
                                                                ? "border-orange-200 bg-orange-50"
                                                                : "border-transparent hover:bg-gray-50"
                                                                }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedTopicIds.includes(t.id)}
                                                                onChange={() => toggleTopic(t.id)}
                                                                className="w-4 h-4 rounded accent-orange-500"
                                                            />
                                                            <span className="text-sm text-gray-700">
                                                                {t.name}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Question count */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                                                Number of questions
                                            </label>
                                            <input
                                                type="number"
                                                min={5}
                                                max={100}
                                                value={numberOfQuestions}
                                                onChange={(e) => setNumberOfQuestions(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">5 – 100</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                                                Duration (minutes)
                                            </label>
                                            <input
                                                type="number"
                                                min={10}
                                                max={300}
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">10 – 300 mins</p>
                                        </div>
                                    </div>

                                    {/* Instructions */}
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                                            Instructions
                                            <span className="normal-case font-normal text-gray-400 ml-1">
                                                (optional)
                                            </span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Any specific guidelines for students…"
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ── BEHAVIOR ── */}
                            {activeTab === "behavior" && (
                                <div className="space-y-6">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Settings size={16} className="text-orange-500" />
                                        Assessment Behavior
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                                                Passing score (%)
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={passingPercentage}
                                                onChange={(e) => setPassingPercentage(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                                                Max attempts
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={5}
                                                value={maxAttempts}
                                                onChange={(e) => setMaxAttempts(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Question settings
                                        </p>
                                        <Toggle
                                            value={shuffleQuestions}
                                            onChange={setShuffleQuestions}
                                            label="Shuffle questions"
                                            description="Randomise question order for each student"
                                        />
                                        <Toggle
                                            value={shuffleOptions}
                                            onChange={setShuffleOptions}
                                            label="Shuffle answer options"
                                            description="Randomise answer choices"
                                        />
                                        <Toggle
                                            value={allowNavigation}
                                            onChange={setAllowNavigation}
                                            label="Allow question navigation"
                                            description="Students can jump between questions"
                                        />
                                        <Toggle
                                            value={allowReview}
                                            onChange={setAllowReview}
                                            label="Allow backward navigation"
                                            description="Students can go back to previous questions"
                                        />
                                        <Toggle
                                            value={autoSubmit}
                                            onChange={setAutoSubmit}
                                            label="Auto-submit on time up"
                                            description="Automatically submit when time expires"
                                        />
                                    </div>

                                    {/* Result display */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                            Results display
                                        </p>
                                        <div className="space-y-2">
                                            {[
                                                {
                                                    value: "immediate",
                                                    label: "Immediately after submission",
                                                },
                                                {
                                                    value: "after_submission",
                                                    label: "After manual review",
                                                },
                                                {
                                                    value: "after_due_date",
                                                    label: "After due date passes",
                                                },
                                            ].map((opt) => (
                                                <label
                                                    key={opt.value}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${resultDisplayMode === opt.value
                                                        ? "border-orange-300 bg-orange-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        value={opt.value}
                                                        checked={resultDisplayMode === opt.value}
                                                        onChange={() => setResultDisplayMode(opt.value)}
                                                        className="accent-orange-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {opt.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            After results shown
                                        </p>
                                        <Toggle
                                            value={showCorrectAnswers}
                                            onChange={setShowCorrectAnswers}
                                            label="Show correct answers"
                                        />
                                        <Toggle
                                            value={showExplanations}
                                            onChange={setShowExplanations}
                                            label="Show explanations"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ── PROCTORING ── */}
                            {activeTab === "proctoring" && (
                                <div className="space-y-5">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Shield size={16} className="text-orange-500" />
                                        Proctoring
                                    </h3>

                                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-sm text-orange-800">
                                        Enable monitoring features to maintain academic integrity during
                                        this assessment.
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-4">
                                        <Toggle
                                            value={enableProctoring}
                                            onChange={setEnableProctoring}
                                            label="Enable proctoring"
                                            description="Turn on all monitoring features"
                                        />
                                    </div>

                                    {enableProctoring && (
                                        <div className="pl-4 border-l-4 border-orange-200 space-y-4">
                                            <Toggle
                                                value={requireWebcam}
                                                onChange={setRequireWebcam}
                                                label="Require webcam"
                                                description="Student must grant camera access to start"
                                            />
                                            <Toggle
                                                value={fullscreenRequired}
                                                onChange={setFullscreenRequired}
                                                label="Fullscreen mode"
                                                description="Assessment must run in fullscreen"
                                            />
                                            <Toggle
                                                value={detectTabSwitching}
                                                onChange={setDetectTabSwitching}
                                                label="Detect tab switching"
                                                description="Monitor when student leaves the tab"
                                            />
                                            {detectTabSwitching && (
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                                                        Max tab switches allowed
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={10}
                                                        value={maxTabSwitches}
                                                        onChange={(e) => setMaxTabSwitches(e.target.value)}
                                                        className="w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                                    />
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        0 = zero tolerance
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── SCHEDULE ── */}
                            {activeTab === "schedule" && (
                                <div className="space-y-5">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Calendar size={16} className="text-orange-500" />
                                        Schedule
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Set when this assessment becomes available and expires.
                                        Leave blank to make it available immediately with no expiry.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                                                Available from
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={availableFrom}
                                                onChange={(e) => setAvailableFrom(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                                                Available until
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={availableUntil}
                                                onChange={(e) => setAvailableUntil(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-4">
                                        <Toggle
                                            value={publishNow}
                                            onChange={setPublishNow}
                                            label="Publish immediately"
                                            description="Assessment is live and ready to assign. Turn off to save as draft."
                                        />
                                    </div>

                                    {!publishNow && (
                                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                                            Saved as draft — students won't see this until you publish
                                            it from the Assessments view.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab navigation */}
                            <div className="flex justify-between mt-8 pt-5 border-t border-gray-100">
                                <button
                                    onClick={goPrev}
                                    disabled={isFirst}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={15} /> Previous
                                </button>

                                {isLast ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setPublishNow(false);
                                                handleSubmit();
                                            }}
                                            disabled={createAssessment.isPending}
                                            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            Save as draft
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPublishNow(true);
                                                handleSubmit();
                                            }}
                                            disabled={createAssessment.isPending}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                                             bg-kidemia-secondary text-white disabled:opacity-50 transition-colors"

                                        >
                                            {createAssessment.isPending ? "Creating…" : "Create & Publish"}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={goNext}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium 
                                        bg-kidemia-secondary text-white transition-colors"

                                    >
                                        Next <ChevronRight size={15} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Summary sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 bg-slate-900 rounded-2xl p-6 text-white space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                                    <BookOpen size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Summary</h3>
                                    <p className="text-xs text-slate-400">Review before creating</p>
                                </div>
                            </div>

                            <div className="border-t border-slate-700 pt-4 space-y-1">
                                <SummaryRow
                                    label="Subject"
                                    value={selectedSubject?.name ?? "—"}
                                />
                                <SummaryRow
                                    label="Topics"
                                    value={
                                        selectedTopicIds.length
                                            ? `${selectedTopicIds.length} selected`
                                            : "—"
                                    }
                                />
                                <SummaryRow label="Questions" value={numberOfQuestions} />
                                <SummaryRow label="Duration" value={`${duration} mins`} />
                                <SummaryRow
                                    label="Passing score"
                                    value={`${passingPercentage}%`}
                                />
                                <SummaryRow label="Max attempts" value={maxAttempts} />
                                <SummaryRow
                                    label="Proctoring"
                                    value={enableProctoring ? "Enabled" : "Off"}
                                />
                                <SummaryRow
                                    label="Publish"
                                    value={publishNow ? "Immediately" : "Draft"}
                                />
                            </div>

                            <div className="border-t border-slate-700 pt-4">
                                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-semibold">
                                    After creation
                                </p>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Use the <span className="text-orange-400 font-medium">Assign</span>{" "}
                                    button in the Assessments view to assign this to a classroom,
                                    group, or individual students.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}