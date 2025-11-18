import React, { useMemo, useState } from "react";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  DatePicker,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
  Switch
} from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdAssessment, MdOutlineDashboard } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import QuestionsTable from "./components/QuestionsTable";
import TopicsSelect from "./components/TopicsSelect";
import PreviewModal from "./components/PreviewModal";
import SectionCard from "./components/SectionCard";
import AdaptiveModeConfig from "./components/AdaptiveModConfig";
import RandomModeConfig from "./components/RandomModeConfig";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { type AssessmentCreate } from "../../sdk/generated";
import { type QuestionSelectionMode } from "../../sdk/generated/models/QuestionSelectionMode";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";


function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

interface SelectedQuestion {
  id: string;
  question_text: string;
  topic_name?: string;
  points?: number;
}

type ExamSession = "May June" | "Nov Dec" | "Continuous" | "";

type SelectionMode = QuestionSelectionMode | "manual" | "random" | "adaptive";

type SectionShape = {
  id: string;
  title: string;
  description?: string;
  number_of_questions: number;
  topic_ids: string[];
  difficulty_distribution: { easy: number; medium: number; hard: number };
};


export default function CreateAssessment() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  // Basic details
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState<string>("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [examYear, setExamYear] = useState<number>(new Date().getFullYear());
  const [examSession, setExamSession] = useState<ExamSession>("");
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  // const [timePerQuestion, setTimePerQuestion] = useState<number | null>(null);

  // Pricing & availability
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("NGN");
  const [discountPrice, setDiscountPrice] = useState<number | null>(null);
  const [availableFrom, setAvailableFrom] = useState<any>(null);
  const [availableUntil, setAvailableUntil] = useState<any>(null);
  // const [bannerImageId, setBannerImageId] = useState<string | null>(null);
  const [bannerImageId] = useState<string | null>(null);


  const [questionSelectionMode, setQuestionSelectionMode] = useState<SelectionMode>("manual");
  // const [questionFilterMode, setQuestionFilterMode] = useState<"by-subject" | "by-topic" | "manual">(
  //   "by-subject"
  // );
  const [questionFilterMode] = useState<"by-subject" | "by-topic" | "manual">(
    "by-subject"
  );
  // const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery] = useState("");

  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // Behaviour
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [allowQuestionNavigation, setAllowQuestionNavigation] = useState(true);
  const [allowBackwardNavigation, setAllowBackwardNavigation] = useState(true);

  // Result & feedback
  const [resultDisplayMode, setResultDisplayMode] = useState<string>("immediate");
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true);
  const [showExplanations, setShowExplanations] = useState(true);

  // Proctoring
  const [proctoringEnabled, setProctoringEnabled] = useState(false);
  const [requireWebcam, setRequireWebcam] = useState(false);
  const [fullscreenRequired, setFullscreenRequired] = useState(false);
  const [detectTabSwitching, setDetectTabSwitching] = useState(false);
  const [maxTabSwitches, setMaxTabSwitches] = useState<number>(0);

  // Attempts and passing
  // const [passingPercentage, setPassingPercentage] = useState<number>(50);
  const [passingPercentage] = useState<number>(50);

  // const [maxAttempts, setMaxAttempts] = useState<number>(10);
  const [maxAttempts] = useState<number>(10);


  // Status & visibility
  const [isPublic, setIsPublic] = useState(true);
  const [requireEnrollment, setRequireEnrollment] = useState(false);
  const [status, setStatus] = useState<string>("draft");

  // Sections
  const [sections, setSections] = useState<SectionShape[]>([]);

  // Random/adaptive mode configs
  const [randomConfig, setRandomConfig] = useState({
    number_of_questions: 20,
    topic_distribution: [] as { topic_id: string; percent: number }[],
    difficulty_distribution: { easy: 30, medium: 50, hard: 20 },
  });

  const [adaptiveConfig, setAdaptiveConfig] = useState({
    starting_difficulty: "medium",
    sensitivity: 1,
    min_difficulty: "easy",
    max_difficulty: "hard",
  });

  // Queries
  const { data: subjects = [] } = useQuery({
    queryKey: [QueryKeys.subjects],
    queryFn: async () => {
      try {
        const resp = await ApiSDK.SubjectsService.getSubjectsApiV1SubjectsGet?.();
        if (resp && "items" in resp) {
          return resp.items.map((s) => ({ id: s.id, name: s.name }));
        }
        return (resp as any[]) ?? [];
      } catch (error) {
        console.error("Failed to load subjects", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
  const { data: categories = [] } = useQuery({
    queryKey: [QueryKeys.assessmentCategories],
    queryFn: async () => {
      try {
        return (await ApiSDK.AssessmentCategoriesService?.getCategoryConfigsApiV1CategoriesGet?.()) || [];
      } catch (error) {
        console.error("Failed to load categories", error);
        return [];
      }
    },
  });
  const examSessions = ["May June", "Nov Dec", "Continuous"];

  // Mutation
  const createAssessmentMutation = useMutation({
    mutationFn: async (payload: AssessmentCreate) => {
      const resp = await ApiSDK.AssessmentsService?.createAssessmentApiV1AssessmentsPost?.(payload);
      return resp;
    },
    onSuccess: () => {
      showToastMessage("Assessment created successfully!", "success");
      qc.invalidateQueries({ queryKey: [QueryKeys.allAssessment] });
      navigate(SidebarRoutes.assessment);
    },
    onError: (err) => {
      console.error("Failed to create assessment", err);
      showToastMessage("Failed to create assessment. Please check and try again.", "error");
    },
  });

  /* -------------------------
     Derived / validation
     ------------------------- */
  // const selectedCount = selectedQuestionIds.length;
  // const totalMarks = selectedQuestionIds.length; // placeholder

  const sectionsValid = useMemo(() => {
    for (const s of sections) {
      const d = s.difficulty_distribution;
      if (d.easy + d.medium + d.hard !== 100) return false;
      if (!s.title || s.number_of_questions <= 0) return false;
    }
    return true;
  }, [sections]);

  /* -------------------------
     Build payload
     ------------------------- */
  const buildPayload = (): AssessmentCreate => {
    const payload: AssessmentCreate = {
      title,
      code,
      description: description || undefined,
      instructions: instructions || undefined,
      assessment_type: "exam" as any,
      category: category as any,
      subject_id: subjectId,
      topic_ids: topicIds.length ? topicIds : [],
      exam_year: examYear,
      exam_session: examSession || null,
      price: price,
      currency: currency || "NGN",
      discount_price: discountPrice ?? null,
      duration_minutes: durationMinutes,
      available_from: availableFrom
        ? new Date(availableFrom.year, availableFrom.month - 1, availableFrom.day).toISOString()
        : null,
      available_until: availableUntil
        ? new Date(availableUntil.year, availableUntil.month - 1, availableUntil.day).toISOString()
        : null,
      question_selection_mode: (questionSelectionMode as unknown) as any,
      passing_percentage: passingPercentage,
      shuffle_questions: shuffleQuestions,
      shuffle_options: shuffleOptions,
      allow_question_navigation: allowQuestionNavigation,
      allow_backward_navigation: allowBackwardNavigation,
      result_display_mode: resultDisplayMode as any,
      show_correct_answers: showCorrectAnswers,
      show_explanations: showExplanations,
      proctoring_enabled: proctoringEnabled,
      require_webcam: requireWebcam,
      fullscreen_required: fullscreenRequired,
      detect_tab_switching: detectTabSwitching,
      max_tab_switches: maxTabSwitches,
      is_public: isPublic,
      require_enrollment: requireEnrollment,
      question_ids: selectedQuestionIds.length ? selectedQuestionIds : [],
      duration_minutes_override: undefined as any,
      max_attempts: maxAttempts,
      sections: sections.map((s) => ({
        title: s.title,
        description: s.description ?? null,
        number_of_questions: s.number_of_questions,
        topic_ids: s.topic_ids,
        difficulty_distribution: s.difficulty_distribution,
      })) as any[],
      banner_image_id: bannerImageId ?? null,
    } as unknown as AssessmentCreate;

    return payload;
  };

  /* -------------------------
     Handlers
     ------------------------- */
  const onQuestionsSelectionChange = (rows: SelectedQuestion[]) => {
    const ids = rows.map((r) => r.id);
    setSelectedQuestionIds(ids);
  };

  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Client validation
    if (!title.trim()) {
      showToastMessage("Please provide a title", "error");
      return;
    }
    if (!code.trim()) {
      showToastMessage("Please provide a code", "error");
      return;
    }
    if (!subjectId) {
      showToastMessage("Please choose a subject", "error");
      return;
    }
    if (questionSelectionMode === "manual" && selectedQuestionIds.length === 0) {
      showToastMessage("Select at least one question for manual mode", "error");
      return;
    }
    if (sections.length === 0 && questionSelectionMode !== "manual") {
      // random/adaptive should have sections or config
      // not strictly required by api but good UX
      // allow it, but warn
      // showToastMessage("Add at least one section or switch to manual selection", "error");
      // return;
    }
    if (!sectionsValid) {
      showToastMessage("Please ensure each section has valid difficulty distribution (sums to 100) and questions", "error");
      return;
    }

    const payload = buildPayload();
    console.log("Payload ->", payload);
    // show preview for confirmation
    // setPreviewOpen(true);
    // const payload = buildPayload();
    createAssessmentMutation.mutate(payload);
  };

  const confirmCreate = () => {
    const payload = buildPayload();
    createAssessmentMutation.mutate(payload);
    setPreviewOpen(false);
  };

  /* -------------------------
     UI
     ------------------------- */
  return (
    <section className="space-y-8 bg-kidemia-white">
      <div>
        <Breadcrumbs variant="light" color="foreground">
          <BreadcrumbItem href={SidebarRoutes.dashboard} startContent={<MdOutlineDashboard />}>
            Dashboard
          </BreadcrumbItem>
          <BreadcrumbItem href={SidebarRoutes.assessment} startContent={<MdAssessment />}>
            Assessment
          </BreadcrumbItem>
          <BreadcrumbItem startContent={<MdAssessment />} color="warning">
            Create Assessment
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* MAIN */}
          <div className="col-span-3 p-6 border border-kidemia-grey/30 rounded-xl space-y-4 bg-white">
            <h3 className="text-xl font-semibold text-kidemia-dark">Assessment Details</h3>

            <div className="flex flex-col md:flex-row gap-4">
              <Input
                variant="underlined"
                size="md"
                radius="sm"
                label="Title"
                labelPlacement="outside"
                type="text"
                placeholder="Assessment Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <Input
                variant="underlined"
                size="md"
                radius="sm"
                label="Code"
                labelPlacement="outside"
                type="text"
                placeholder="Assessment Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div>
              <Textarea
                variant="underlined"
                size="md"
                radius="sm"
                label="Description"
                labelPlacement="outside"
                placeholder="Comprehensive description for the assessment"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Textarea
                  variant="underlined"
                  size="md"
                  radius="sm"
                  label="Instructions"
                  labelPlacement="outside"
                  placeholder="Exam instructions (no negative marking, use calculator, etc.)"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <div className="w-60 space-y-6 p-4 border border-kidemia-grey/30 rounded-xl bg-white">
                <div className="mt-2">
                  <Select
                    variant="underlined"
                    size="md"
                    radius="sm"
                    label="Category"
                    labelPlacement="outside"
                    placeholder="Category"
                    selectedKeys={category ? [category] : []}
                    onSelectionChange={(keys) => setCategory(Array.from(keys)[0] as string)}
                  >
                    {categories.map((c: any) => (
                      <SelectItem key={c.category_name ?? c.category_name}>
                        {c.display_name ?? c.display_name ?? c.category_name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="mt-2">
                  <Select
                    variant="underlined"
                    size="md"
                    radius="sm"
                    label="Subject"
                    labelPlacement="outside"
                    placeholder="Subject"
                    selectedKeys={subjectId ? [subjectId] : []}
                    onSelectionChange={(keys) => setSubjectId(Array.from(keys)[0] as string)}
                  >
                    {subjects.map((s: any) => (
                      <SelectItem key={s.id}>{s.name ?? s.title ?? s.label}</SelectItem>
                    ))}
                  </Select>
                </div>

                <Input
                  variant="underlined"
                  size="md"
                  radius="sm"
                  label="Exam Year"
                  labelPlacement="outside"
                  type="number"
                  placeholder="2024"
                  value={examYear.toString()}
                  onChange={(e) => setExamYear(Number(e.target.value))}
                />

                <Select
                  variant="underlined"
                  size="md"
                  radius="sm"
                  label="Exam Session"
                  labelPlacement="outside"
                  placeholder="Exam Session"
                  selectedKeys={examSession ? [examSession] : []}
                  onSelectionChange={(keys) => setExamSession(Array.from(keys)[0] as ExamSession)}
                >
                  {examSessions.map((s) => (
                    <SelectItem key={s}>{s}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <Divider />

            {/* Topics multi-select */}
            <TopicsSelect
              selectedTopicIds={topicIds}
              onChange={(ids) => setTopicIds(ids)}
              subjectId={subjectId}
            />

            <Divider />

            {/* Selection mode and configs */}
            <div>
              <RadioGroup
                label="Question Selection Mode"
                orientation="horizontal"
                classNames={{
                  wrapper: "space-x-4",
                  label: "text-base font-semibold text-kidemia-black",
                }}
                value={questionSelectionMode}
                onValueChange={(val) => setQuestionSelectionMode(val as SelectionMode)}
              >
                <Radio size="sm" value="manual" className="text-kidemia-grey font-normal text-sm">
                  Manual
                </Radio>
                <Radio size="sm" value="random" className="text-kidemia-grey font-normal text-sm">
                  Random
                </Radio>
                <Radio size="sm" value="adaptive" className="text-kidemia-grey font-normal text-sm">
                  Adaptive
                </Radio>
              </RadioGroup>

              <div className="mt-4">
                {questionSelectionMode === "manual" && (
                  <>
                    <div className="text-sm text-kidemia-grey mb-2">Pick questions manually</div>
                    <div className="pt-4">
                      <QuestionsTable
                        subjectId={subjectId}
                        topicIds={topicIds}
                        filterMode={questionFilterMode}
                        searchQuery={searchQuery}
                        onSelectionChange={onQuestionsSelectionChange}
                      />
                    </div>
                  </>
                )}

                {questionSelectionMode === "random" && (
                  <RandomModeConfig config={randomConfig} onChange={setRandomConfig} topics={topicIds} />
                )}

                {questionSelectionMode === "adaptive" && (
                  <AdaptiveModeConfig config={adaptiveConfig} onChange={setAdaptiveConfig} />
                )}
              </div>
            </div>

            <Divider />

            {/* Sections */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Sections</h4>
                <div>
                  <Button
                    type="button"
                    variant="flat"
                    size="sm"
                    startContent={<FiPlus />}
                    onClick={() =>
                      setSections((s) => [
                        ...s,
                        {
                          id: uid("sec_"),
                          title: `Section ${s.length + 1}`,
                          description: "",
                          number_of_questions: 10,
                          topic_ids: [],
                          difficulty_distribution: { easy: 30, medium: 50, hard: 20 },
                        },
                      ])
                    }
                  >
                    Add Section
                  </Button>
                </div>
              </div>

              <div className="space-y-3 mt-3">
                {sections.map((s, idx) => (
                  <SectionCard
                    key={s.id}
                    section={s}
                    topics={topicIds}
                    onChange={(next) =>
                      setSections((prev) => prev.map((p) => (p.id === s.id ? { ...p, ...next } : p)))
                    }
                    onDelete={() => setSections((prev) => prev.filter((p) => p.id !== s.id))}
                    index={idx}
                  />
                ))}
                {sections.length === 0 && <div className="text-sm text-kidemia-grey">No sections added yet.</div>}
              </div>
            </div>
          </div>

          {/* RIGHT - controls */}
          <div className="space-y-4">
            {/* Proctoring Panel */}
            <div className="p-4 border border-kidemia-grey/30 rounded-xl bg-white sticky">
              <h3 className="text-sm font-semibold text-kidemia-black mb-3">Proctoring</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enable Proctoring</span>

                  <Switch checked={proctoringEnabled} onChange={(v) => setProctoringEnabled(Boolean(v))} />
                </div>

                {proctoringEnabled && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Require Webcam</span>
                      <Switch checked={requireWebcam} onChange={(v) => setRequireWebcam(Boolean(v))} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fullscreen Required</span>
                      <Switch checked={fullscreenRequired} onChange={(v) => setFullscreenRequired(Boolean(v))} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Detect Tab Switching</span>
                        <Switch checked={detectTabSwitching} onChange={(v) => setDetectTabSwitching(Boolean(v))} />
                      </div>
                      {detectTabSwitching && (
                        <div className="mt-2">
                          <Input
                            variant="flat"
                            label="Max Tab Switches"
                            value={String(maxTabSwitches)}
                            onChange={(e) => setMaxTabSwitches(Number(e.target.value))}
                            type="number"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  className="bg-kidemia-primary text-kidemia-white font-semibold w-full"
                  radius="sm"
                  isLoading={createAssessmentMutation.isPending}
                >
                  {createAssessmentMutation.isPending ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
            <div className="p-4 border border-kidemia-grey/30 rounded-xl bg-white sticky top-20">
              <h3 className="text-sm font-semibold text-kidemia-black mb-3">Assessment Behaviour</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    id="shuffleQuestions"
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                    className="h-3 w-3"
                  />
                  <label htmlFor="shuffleQuestions" className="text-kidemia-grey font-normal text-sm">
                    Shuffle Questions
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="shuffleOptions"
                    type="checkbox"
                    checked={shuffleOptions}
                    onChange={(e) => setShuffleOptions(e.target.checked)}
                    className="h-3 w-3"
                  />
                  <label htmlFor="shuffleOptions" className="text-kidemia-grey font-normal text-sm">
                    Shuffle Options
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="allowQuestionNavigation"
                    type="checkbox"
                    checked={allowQuestionNavigation}
                    onChange={(e) => setAllowQuestionNavigation(e.target.checked)}
                    className="h-3 w-3"
                  />
                  <label htmlFor="allowQuestionNavigation" className="text-kidemia-grey font-normal text-sm">
                    Allow Question Navigation
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="allowBackwardNavigation"
                    type="checkbox"
                    checked={allowBackwardNavigation}
                    onChange={(e) => setAllowBackwardNavigation(e.target.checked)}
                    className="h-3 w-3"
                  />
                  <label htmlFor="allowBackwardNavigation" className="text-kidemia-grey font-normal text-sm">
                    Allow Backward Navigation
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 border border-kidemia-grey/30 rounded-xl bg-white sticky top-40">
              <h3 className="text-sm font-semibold text-kidemia-black mb-3">Result Display & Feedback</h3>

              <div className="space-y-3">
                <Select
                  variant="flat"
                  size="md"
                  radius="sm"
                  placeholder="Result Display Mode"
                  selectedKeys={[resultDisplayMode]}
                  onSelectionChange={(keys) => setResultDisplayMode(Array.from(keys)[0] as string)}
                >
                  <SelectItem key="immediate">Immediate</SelectItem>
                  <SelectItem key="after_submission">After Submission</SelectItem>
                  <SelectItem key="manual">Manual Review</SelectItem>
                </Select>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      id="showCorrect"
                      type="checkbox"
                      checked={showCorrectAnswers}
                      onChange={(e) => setShowCorrectAnswers(e.target.checked)}
                      className="h-3 w-3"
                    />
                    <label htmlFor="showCorrect" className="text-kidemia-grey font-normal text-sm">
                      Show Correct Answers
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="showExplanation"
                      type="checkbox"
                      checked={showExplanations}
                      onChange={(e) => setShowExplanations(e.target.checked)}
                      className="h-3 w-3"
                    />
                    <label htmlFor="showExplanation" className="text-kidemia-grey font-normal text-sm">
                      Show Explanations
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability & Pricing */}
            <div className="p-4 border border-kidemia-grey/30 rounded-xl bg-white sticky top-60">
              <h3 className="text-sm font-semibold text-kidemia-black mb-3">Availability & Pricing</h3>

              <div className="flex flex-col gap-3">
                <label className="text-sm text-kidemia-grey">Available From</label>
                <DatePicker variant="flat" size="sm" radius="sm" value={availableFrom} onChange={setAvailableFrom} />
                <label className="text-sm text-kidemia-grey">Available Until</label>
                <DatePicker
                  variant="flat"
                  size="md"
                  radius="sm"
                  value={availableUntil}
                  onChange={setAvailableUntil}
                />
              </div>

              <div className="mt-4">
                <Input
                  variant="flat"
                  size="md"
                  radius="sm"
                  label="Duration (minutes)"
                  labelPlacement="outside"
                  type="number"
                  placeholder="Duration"
                  value={String(durationMinutes)}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                />
              </div>

              <div className="mt-4">
                <Input
                  variant="flat"
                  size="md"
                  radius="sm"
                  label="Price"
                  labelPlacement="outside"
                  type="number"
                  placeholder="0"
                  value={String(price)}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>

              {price > 0 && (
                <div className="mt-3">
                  <Input
                    variant="flat"
                    size="md"
                    radius="sm"
                    label="Discount Price (optional)"
                    labelPlacement="outside"
                    type="number"
                    placeholder="Discount Price"
                    value={discountPrice === null ? "" : String(discountPrice)}
                    onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : null)}
                  />
                  <div className="mt-2">
                    <Select
                      variant="flat"
                      size="md"
                      radius="sm"
                      label="Currency"
                      labelPlacement="outside"
                      placeholder="Currency"
                      selectedKeys={[currency]}
                      onSelectionChange={(keys) => setCurrency(Array.from(keys)[0] as string)}
                    >
                      <SelectItem key="NGN">NGN</SelectItem>
                      <SelectItem key="USD">USD</SelectItem>
                      <SelectItem key="GHS">GHS</SelectItem>
                    </Select>
                  </div>
                </div>
              )}

              <div className="mt-3">
                <div className="flex items-center gap-4">
                  <div>
                    <input
                      id="isPublic"
                      type="radio"
                      name="visibility"
                      checked={isPublic}
                      onChange={() => {
                        setIsPublic(true);
                        setRequireEnrollment(false);
                      }}
                    />
                    <label htmlFor="isPublic" className="ml-2 text-kidemia-grey font-normal text-sm">
                      Public
                    </label>
                  </div>
                  <div>
                    <input
                      id="requireEnrollment"
                      type="radio"
                      name="visibility"
                      checked={requireEnrollment}
                      onChange={() => {
                        setIsPublic(false);
                        setRequireEnrollment(true);
                      }}
                    />
                    <label htmlFor="requireEnrollment" className="ml-2 text-kidemia-grey font-normal text-sm">
                      Invite Only
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Select
                  variant="flat"
                  size="md"
                  radius="sm"
                  label="Status"
                  labelPlacement="outside"
                  placeholder="Status"
                  selectedKeys={[status]}
                  onSelectionChange={(keys) => setStatus(Array.from(keys)[0] as string)}
                >
                  <SelectItem key="draft">Draft</SelectItem>
                  <SelectItem key="published">Published</SelectItem>
                  <SelectItem key="archived">Archived</SelectItem>
                </Select>
              </div>
            </div>


          </div>
        </div>
      </form>

      {/* Preview Modal */}
      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        payload={buildPayload()}
        onConfirm={confirmCreate}
      />
    </section>
  );
}


function showToastMessage(message: string, type: "success" | "error") {
  // Replace with your toast system
  // e.g. toast[type](message)
  // For now console
  // eslint-disable-next-line no-console
  console.log(`[${type.toUpperCase()}] ${message}`);
}
