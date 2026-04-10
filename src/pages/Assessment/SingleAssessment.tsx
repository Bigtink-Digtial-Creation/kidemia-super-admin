import { BreadcrumbItem, Breadcrumbs, Button, Chip, Tab, Tabs, Pagination, addToast } from "@heroui/react";
import { useParams, useNavigate } from "react-router";
import { SidebarRoutes } from "../../routes";
import { MdAssessment, MdOutlineDashboard } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import StatCard from "../../components/Dashboard/StatCard";
import { BsFillQuestionSquareFill, BsHandThumbsDownFill } from "react-icons/bs";
import { LiaFilePowerpointSolid } from "react-icons/lia";
import { FaCheck, FaCheckDouble, FaClock, FaCalendar, FaEye, FaLock, FaMedal, FaTrophy } from "react-icons/fa";
import { SiSpeedtest } from "react-icons/si";
import BallSpinner from "../../components/Spinner/BallSpinner";
import { useMemo, useState } from "react";
import { formatDateToDDMMYYYY, getAssessmentStatusColor, getFullName2 } from "../../utils";
import type { AssessmentLeaderboardResponse, AttemptResponse } from "../../sdk/generated";
import QuestionRenderer from "../../components/editor/QuestionRenderer";

export default function SingleAssessment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: [QueryKeys.assessmentLeaderboard, id],
    queryFn: async () => {
      try {
        const response =
          await ApiSDK.AdminGamificationService.getAssessmentLeaderboardAdminApiV1AdminGamificationAssessmentIdLeaderboardAdminGet(
            id!,
          );
        return response;
      } catch (error: any) {
        addToast({
          title: "Failed to load leaderboard",
          description:
            error?.body?.message ||
            error?.body?.detail ||
            error?.message ||
            "Network Error",
          color: "danger",
        });
        return null;
      }
    },
    enabled: !!id && selectedTab === "leaderboard",
  });

  const { data: singleAssessment, isLoading } = useQuery({
    queryKey: [QueryKeys.singleAssessment, id],
    queryFn: () =>
      ApiSDK.AssessmentsService.getAssessmentApiV1AssessmentsAssessmentIdGet(
        id!,
        false,
      ),
    enabled: !!id,
  });

  const { data: attempts, isLoading: attemptsLoading } = useQuery({
    queryKey: [QueryKeys.assessmentAttempts, id],
    queryFn: async () => {
      try {
        const response = await ApiSDK.AttemptsService.getAssessmentAttemptsApiV1AttemptsAssessmentAssessmentIdGet(
          id!,
        );
        // Normalise — API may return an object with items/data, or a plain array
        if (Array.isArray(response)) return response;
        if (Array.isArray((response as any)?.items)) return (response as any).items;
        if (Array.isArray((response as any)?.data)) return (response as any).data;
        return [];
      } catch (error: any) {
        addToast({
          title: "An error occurred",
          description: error?.body?.message || error?.body?.detail || error?.message || "Network Error",
          color: "danger",
        });
        return [];
      }
    },
    enabled: !!id && selectedTab === "attempts",
  });

  // Client-side pagination logic
  const paginatedAttempts = useMemo(() => {
    if (!Array.isArray(attempts)) return [];
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return attempts.slice(start, end);
  }, [attempts, currentPage]);

  const totalPages = Math.ceil((Array.isArray(attempts) ? attempts.length : 0) / rowsPerPage);

  if (isLoading && !singleAssessment) {
    return (
      <div className="h-screen flex justify-center items-center">
        <BallSpinner />
      </div>
    );
  }

  return (
    <section className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Breadcrumbs variant="light" color="foreground">
          <BreadcrumbItem
            href={SidebarRoutes.dashboard}
            startContent={<MdOutlineDashboard />}
          >
            Dashboard
          </BreadcrumbItem>
          <BreadcrumbItem
            href={SidebarRoutes.assessment}
            startContent={<MdAssessment />}
          >
            Assessments
          </BreadcrumbItem>
          <BreadcrumbItem startContent={<MdAssessment />}>
            {singleAssessment?.title}
          </BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-semibold text-neutral-900">
                {singleAssessment?.title}
              </h1>
              <Chip
                size="sm"
                color={getAssessmentStatusColor(singleAssessment?.status || "draft")}
                variant="flat"
              >
                {singleAssessment?.status}
              </Chip>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3 md:gap-4">
        <StatCard
          icon={BsFillQuestionSquareFill}
          title="Total Questions"
          figure={singleAssessment?.total_questions || "0"}
        />
        <StatCard
          icon={LiaFilePowerpointSolid}
          title="Total Points"
          figure={singleAssessment?.total_points || "0"}
        />
        <StatCard
          icon={SiSpeedtest}
          title="Total Attempts"
          figure={singleAssessment?.total_attempts || "0"}
        />
        <StatCard
          icon={FaCheckDouble}
          title="Completions"
          figure={singleAssessment?.total_completions || "0"}
        />
        <StatCard
          icon={FaCheck}
          title="Passes"
          figure={singleAssessment?.total_passes || "0"}
        />
        <StatCard
          icon={BsHandThumbsDownFill}
          title="Fails"
          figure={singleAssessment?.total_fails || "0"}
        />
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          classNames={{
            tabList: "w-full relative rounded-none p-0 border-b border-neutral-200 overflow-x-auto flex-nowrap scrollbar-hide",
            cursor: "w-full bg-kidemia-secondary",
            tab: "max-w-fit px-4 md:px-6 h-11 md:h-12 shrink-0 text-sm",
            tabContent: "group-data-[selected=true]:text-white whitespace-nowrap",
          }}
        >
          {/* ── OVERVIEW ── */}
          <Tab key="overview" title="Overview">
            <div className="p-4 md:p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <InfoItem label="Assessment Code" value={singleAssessment?.code} />
                  <InfoItem label="Assessment Type" value={singleAssessment?.assessment_type} />
                  <InfoItem label="Category" value={singleAssessment?.category} />
                  <InfoItem label="Subject" value={singleAssessment?.subject?.name} />
                  <InfoItem label="Exam Year" value={singleAssessment?.exam_year} />
                  <InfoItem label="Exam Session" value={singleAssessment?.exam_session} />
                </div>
              </div>

              {singleAssessment?.instructions && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                  <div className="bg-neutral-50 rounded-lg p-4 text-sm text-neutral-700">
                    {singleAssessment.instructions}
                  </div>
                </div>
              )}
            </div>
          </Tab>

          {/* ── CONFIGURATION ── */}
          <Tab key="configuration" title="Configuration">
            <div className="p-4 md:p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Timing & Availability</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <InfoItem
                    label="Duration"
                    value={`${singleAssessment?.duration_minutes} minutes`}
                    icon={FaClock}
                  />
                  <InfoItem
                    label="Available From"
                    value={formatDateToDDMMYYYY(singleAssessment?.available_from)}
                    icon={FaCalendar}
                  />
                  <InfoItem
                    label="Available Until"
                    value={formatDateToDDMMYYYY(singleAssessment?.available_until)}
                    icon={FaCalendar}
                  />
                  <InfoItem
                    label="Max Attempts"
                    value={singleAssessment?.max_attempts || "Unlimited"}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <InfoItem
                    label="Price"
                    value={`${singleAssessment?.currency} ${singleAssessment?.price || 0}`}
                  />
                  {singleAssessment?.discount_price && (
                    <InfoItem
                      label="Discount Price"
                      value={`${singleAssessment?.currency} ${singleAssessment?.discount_price}`}
                    />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Question Selection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <InfoItem
                    label="Selection Mode"
                    value={singleAssessment?.question_selection_mode}
                  />
                  <InfoItem
                    label="Passing Percentage"
                    value={`${singleAssessment?.passing_percentage}%`}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Behavior Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SettingItem label="Shuffle Questions" enabled={singleAssessment?.shuffle_questions} />
                  <SettingItem label="Shuffle Options" enabled={singleAssessment?.shuffle_options} />
                  <SettingItem label="Question Navigation" enabled={singleAssessment?.allow_question_navigation} />
                  <SettingItem label="Backward Navigation" enabled={singleAssessment?.allow_backward_navigation} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Results & Feedback</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <InfoItem label="Result Display Mode" value={singleAssessment?.result_display_mode} />
                  <SettingItem label="Show Correct Answers" enabled={singleAssessment?.show_correct_answers} />
                  <SettingItem label="Show Explanations" enabled={singleAssessment?.show_explanations} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Proctoring Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SettingItem label="Proctoring Enabled" enabled={singleAssessment?.proctoring_enabled} />
                  <SettingItem label="Require Webcam" enabled={singleAssessment?.require_webcam} />
                  <SettingItem label="Fullscreen Required" enabled={singleAssessment?.fullscreen_required} />
                  <SettingItem label="Detect Tab Switching" enabled={singleAssessment?.detect_tab_switching} />
                  {singleAssessment?.detect_tab_switching && (
                    <InfoItem label="Max Tab Switches" value={singleAssessment?.max_tab_switches} />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Visibility</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SettingItem label="Public" enabled={singleAssessment?.is_public} icon={FaEye} />
                  <SettingItem label="Require Enrollment" enabled={singleAssessment?.require_enrollment} icon={FaLock} />
                </div>
              </div>
            </div>
          </Tab>

          {/* ── QUESTIONS ── */}
          <Tab key="questions" title="Questions">
            <div className="p-4 md:p-6">
              {singleAssessment?.questions && singleAssessment.questions.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Questions ({singleAssessment.questions.length})
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {singleAssessment.questions.map((question: any, index: number) => (
                      <div
                        key={question.id}
                        className="border border-neutral-200 rounded-lg p-3 md:p-4 hover:border-kidemia-primary/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-kidemia-primary/10 text-kidemia-primary flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                              <QuestionRenderer
                                question_content={question.question_content}
                                question_text={question.question_text}
                                className="text-base font-medium text-gray-900"
                              />
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Chip size="sm" variant="flat" color="primary">
                                  {question.points} pts
                                </Chip>
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  color={
                                    question.difficulty === "easy" ? "success" :
                                      question.difficulty === "medium" ? "warning" : "danger"
                                  }
                                >
                                  {question.difficulty}
                                </Chip>
                              </div>
                            </div>

                            {question.options && question.options.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {question.options.map((option: any, optIndex: number) => (
                                  <div
                                    key={option.id}
                                    className={`flex items-start gap-2 p-2 rounded text-xs ${option.is_correct
                                      ? "bg-green-50 border border-green-200"
                                      : "bg-neutral-50"
                                      }`}
                                  >
                                    <span className="font-medium text-neutral-600 flex-shrink-0">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    <QuestionRenderer
                                      question_content={option.option_content}
                                      question_text={option.option_text}
                                      className="text-sm text-gray-700"
                                    />
                                    {option.is_correct && (
                                      <FaCheck className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {question.explanation && (
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded text-xs">
                                <p className="font-medium text-blue-900 mb-1">Explanation:</p>
                                <p
                                  className="text-blue-800"
                                  dangerouslySetInnerHTML={{ __html: question.explanation }}
                                />
                              </div>
                            )}

                            {question.topic_name && (
                              <div className="mt-2">
                                <Chip size="sm" variant="bordered">
                                  {question.topic_name}
                                </Chip>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-500">
                  <BsFillQuestionSquareFill className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No questions added yet</p>
                  <p className="text-sm mt-1">Add questions to this assessment to get started</p>
                </div>
              )}
            </div>
          </Tab>

          {/* ── ATTEMPTS ── */}
          <Tab key="attempts" title="Attempts">
            <div className="p-4 md:p-6">
              {attemptsLoading ? (
                <div className="text-center py-12">
                  <BallSpinner />
                </div>
              ) : Array.isArray(attempts) && attempts.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h3 className="text-lg font-semibold">
                      Assessment Attempts ({attempts.length})
                    </h3>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={() => console.log("Export attempts data")}
                    >
                      Export Report
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-green-700 mb-1">Average Score</p>
                          <p className="text-2xl font-bold text-green-900">
                            {singleAssessment?.average_score || "0"}%
                          </p>
                        </div>
                        <FaCheckDouble className="w-8 h-8 text-green-600 opacity-50" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-blue-700 mb-1">Highest Score</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {singleAssessment?.highest_score || "0"}%
                          </p>
                        </div>
                        <FaCheck className="w-8 h-8 text-blue-600 opacity-50" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-orange-700 mb-1">Lowest Score</p>
                          <p className="text-2xl font-bold text-orange-900">
                            {singleAssessment?.lowest_score || "0"}%
                          </p>
                        </div>
                        <BsHandThumbsDownFill className="w-8 h-8 text-orange-600 opacity-50" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-neutral-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px]">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Student</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Score</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Time Taken</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Started At</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">Completed At</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-700 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                          {paginatedAttempts.map((attempt: AttemptResponse) => (
                            <tr key={attempt.id} className="hover:bg-neutral-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-kidemia-primary/10 flex items-center justify-center">
                                    <span className="text-xs font-medium text-kidemia-primary">
                                      {attempt?.user?.first_name?.charAt(0) || "S"}
                                    </span>
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-neutral-900">
                                      {getFullName2(attempt?.user) || "Anonymous"}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                      {attempt.user?.email || ""}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Chip
                                  size="sm"
                                  color={
                                    attempt.status === "graded"
                                      ? "success"
                                      : attempt.status === "in_progress"
                                        ? "warning"
                                        : "default"
                                  }
                                  variant="flat"
                                  className="capitalize"
                                >
                                  {attempt.status}
                                </Chip>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-neutral-900">
                                    {attempt.percentage || 0}%
                                  </span>
                                  <span className="text-xs text-neutral-500">
                                    ({attempt.score || 0}/{attempt.points_earned || 0})
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                                {attempt.time_spent_seconds
                                  ? `${Math.floor(attempt.time_spent_seconds / 60)}m ${attempt.time_spent_seconds % 60}s`
                                  : "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                                {attempt.started_at ? new Date(attempt.started_at).toLocaleString() : "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                                {attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString() : "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                <Button
                                  size="sm"
                                  variant="light"
                                  color="primary"
                                  className="bg-kidemia-primary text-kidemia-white rounded-lg"
                                  onPress={() => navigate(SidebarRoutes.assessmentAttempt.replace(":id", attempt.id))}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {totalPages > 1 && (
                      <div className="py-3 px-4 flex justify-center border-t border-neutral-200">
                        <Pagination
                          isCompact
                          showControls
                          showShadow
                          color="danger"
                          page={currentPage}
                          total={totalPages}
                          onChange={(page) => setCurrentPage(page)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-500">
                  <SiSpeedtest className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No attempts yet</p>
                  <p className="text-sm mt-1">Students haven't taken this assessment yet</p>
                </div>
              )}
            </div>
          </Tab>

          {/* ── LEADERBOARD ── */}
          <Tab key="leaderboard" title="Leaderboard">
            <LeaderboardTab
              leaderboard={leaderboard}
              isLoading={leaderboardLoading}
              totalQuestions={singleAssessment?.total_questions}
            />
          </Tab>
        </Tabs>
      </div>
    </section>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────────

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="w-5 h-5 text-neutral-400 mt-0.5" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-neutral-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-neutral-900 capitalize">
          {value || "Not set"}
        </p>
      </div>
    </div>
  );
}

function SettingItem({
  label,
  enabled,
  icon: Icon,
}: {
  label: string;
  enabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-neutral-400" />}
        <span className="text-sm text-neutral-700">{label}</span>
      </div>
      <Chip size="sm" color={enabled ? "success" : "default"} variant="flat">
        {enabled ? "Enabled" : "Disabled"}
      </Chip>
    </div>
  );
}

// ─── Leaderboard Tab ──────────────────────────────────────────────────────────

function LeaderboardTab({
  leaderboard,
  isLoading,
}: {
  leaderboard?: AssessmentLeaderboardResponse | null;
  isLoading: boolean;
  totalQuestions?: number;
}) {
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center py-12">
        <BallSpinner />
      </div>
    );
  }

  if (!leaderboard || leaderboard.entries.length === 0) {
    return (
      <div className="p-6 text-center py-12 text-neutral-500">
        <FaTrophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No rankings yet</p>
        <p className="text-sm mt-1">Rankings appear once students submit attempts</p>
      </div>
    );
  }

  const { entries, total_participants, current_user_rank } = leaderboard;
  const [first, second, third] = entries;

  const rankMeta = (rank: number) => {
    if (rank === 1)
      return { icon: <FaTrophy className="w-4 h-4 text-amber-500" /> };
    if (rank === 2)
      return { icon: <FaMedal className="w-4 h-4 text-neutral-400" /> };
    if (rank === 3)
      return { icon: <FaMedal className="w-4 h-4 text-orange-400" /> };
    return {
      icon: (
        <span className="text-xs font-semibold text-neutral-500">#{rank}</span>
      ),
    };
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Summary row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">
          Rankings
          <span className="ml-2 text-sm font-normal text-neutral-500">
            {total_participants} participant{total_participants !== 1 ? "s" : ""}
          </span>
        </h3>
        {current_user_rank != null && (
          <Chip size="sm" color="primary" variant="flat">
            Your rank: #{current_user_rank}
          </Chip>
        )}
      </div>

      {/* Podium — top 3 (hidden on very small screens, shown sm+) */}
      {entries.length >= 3 && (
        <div className="hidden sm:grid grid-cols-3 gap-3">
          {/* visual order: 2nd | 1st | 3rd */}
          {[second, first, third].map((entry, i) => {
            if (!entry) return <div key={i} />;
            const isFirst = entry.rank === 1;
            return (
              <div
                key={entry.user_id}
                className={`flex flex-col items-center p-4 rounded-xl border text-center ${isFirst
                    ? "border-amber-300 bg-amber-50 ring-2 ring-amber-200"
                    : "border-neutral-200 bg-neutral-50"
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 overflow-hidden ${isFirst
                      ? "bg-amber-200 text-amber-800"
                      : "bg-neutral-200 text-neutral-700"
                    }`}
                >
                  {entry.student_avatar ? (
                    <img
                      src={entry.student_avatar}
                      alt={entry.student_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    entry.student_name.charAt(0).toUpperCase()
                  )}
                </div>
                <p className="text-xs font-medium text-neutral-800 truncate w-full px-1">
                  {entry.student_name}
                </p>
                <p className="text-base md:text-lg font-bold text-neutral-900 mt-1">
                  {Number(entry.score).toFixed(1)}%
                </p>
                <span className="text-xs text-neutral-500 mt-0.5">
                  #{entry.rank}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Full table */}
      <div className="rounded-lg border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider w-14">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {entries.map((entry) => {
                const meta = rankMeta(entry.rank);
                return (
                  <tr
                    key={entry.user_id}
                    className={`hover:bg-neutral-50 transition-colors ${entry.is_current_user ? "bg-kidemia-primary/5" : ""
                      }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">{meta.icon}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-kidemia-primary/10 flex items-center justify-center text-xs font-medium text-kidemia-primary flex-shrink-0 overflow-hidden">
                          {entry.student_avatar ? (
                            <img
                              src={entry.student_avatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            entry.student_name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-900 flex items-center gap-1 flex-wrap">
                            {entry.student_name}
                            {entry.is_current_user && (
                              <Chip size="sm" color="primary" variant="flat" className="text-xs">
                                You
                              </Chip>
                            )}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Attempt #{entry.attempt_number}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 md:w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${entry.score >= 70
                                ? "bg-green-500"
                                : entry.score >= 50
                                  ? "bg-amber-400"
                                  : "bg-red-400"
                              }`}
                            style={{ width: `${Math.min(entry.score, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-neutral-900">
                          {Number(entry.score).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                      {Number(entry.points_earned).toFixed(0)} pts
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">
                      {entry.submitted_at
                        ? new Date(entry.submitted_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}