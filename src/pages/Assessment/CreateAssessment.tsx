import React, { useMemo, useState } from "react";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  DatePicker,
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
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { type AssessmentCreate, type AssessmentStatus, type AssessmentType, type ResultDisplayMode } from "../../sdk/generated";
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

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState<string>("");
  const [categoryConfigId, setCategoryConfigId] = useState<string>("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [examYear, setExamYear] = useState<number>(new Date().getFullYear());
  const [examSession, setExamSession] = useState<string>("May/June");
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("NGN");
  const [discountPrice, setDiscountPrice] = useState<number | null>(null);
  const [availableFrom, setAvailableFrom] = useState<any>(null);
  const [availableUntil, setAvailableUntil] = useState<any>(null);
  const [bannerImageId] = useState<string | null>(null);
  const [questionSelectionMode, setQuestionSelectionMode] = useState<SelectionMode>("manual");
  const [questionFilterMode] = useState<"by-subject" | "by-topic" | "manual">("by-subject");
  const [searchQuery] = useState("");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [allowQuestionNavigation, setAllowQuestionNavigation] = useState(true);
  const [allowBackwardNavigation, setAllowBackwardNavigation] = useState(true);
  const [resultDisplayMode, setResultDisplayMode] = useState<string>("immediate");
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true);
  const [showExplanations, setShowExplanations] = useState(true);
  const [proctoringEnabled, setProctoringEnabled] = useState(false);
  const [requireWebcam, setRequireWebcam] = useState(false);
  const [fullscreenRequired, setFullscreenRequired] = useState(false);
  const [detectTabSwitching, setDetectTabSwitching] = useState(false);
  const [maxTabSwitches, setMaxTabSwitches] = useState<number>(0);
  const [passingPercentage] = useState<number>(50);
  const [maxAttempts] = useState<number>(10);
  const [isPublic, setIsPublic] = useState(true);
  const [requireEnrollment, setRequireEnrollment] = useState(false);
  const [status, setStatus] = useState<string>("draft");
  const [sections, setSections] = useState<SectionShape[]>([]);
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


  const createAssessmentMutation = useMutation({
    mutationFn: async (payload: AssessmentCreate) => {
      try {
        const resp = await ApiSDK.AssessmentsService?.createAssessmentApiV1AssessmentsPost?.(payload);
        return resp;
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: () => {
      addToast({
        title: "Successful",
        description: "Assessment Created Successfully"
      })
      qc.invalidateQueries({ queryKey: [QueryKeys.allAssessment] });
      navigate(SidebarRoutes.assessment);
    },
    onError: (err: any) => {
      addToast({
        title: "Error",
        description: err?.body?.detail || err?.body?.message
      })
    },
  });

  const sectionsValid = useMemo(() => {
    for (const s of sections) {
      const d = s.difficulty_distribution;
      if (d.easy + d.medium + d.hard !== 100) return false;
      if (!s.title || s.number_of_questions <= 0) return false;
    }
    return true;
  }, [sections]);

  const buildPayload = (): AssessmentCreate => {
    const payload: AssessmentCreate = {
      title,
      code,
      description: description?.trim() || null,
      instructions: instructions?.trim() || null,
      assessment_type: "exam" as AssessmentType,
      category: category,
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
      result_display_mode: resultDisplayMode as ResultDisplayMode,
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
      // duration_minutes_override: undefined as any,
      max_attempts: maxAttempts,
      category_config_id: categoryConfigId,
      status: (status as AssessmentStatus) || null,
      sections: sections.map((s) => ({
        title: s.title,
        description: s.description ?? null,
        number_of_questions: s.number_of_questions,
        topic_ids: s.topic_ids,
        difficulty_distribution: s.difficulty_distribution,
      })) as any[],
      banner_image_id: bannerImageId ?? null,
    } as unknown as AssessmentCreate;
    console.log(payload)
    return payload;
  };

  const onQuestionsSelectionChange = (rows: SelectedQuestion[]) => {
    const ids = rows.map((r) => r.id);
    setSelectedQuestionIds(ids);
  };

  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!title.trim()) {
      addToast({
        title: "Warning",
        description: "Please provide a title"
      })
      return;
    }
    if (!code.trim()) {
      addToast({
        title: "Warning",
        description: "Please provide a code"
      })
      return;
    }
    if (!subjectId) {
      addToast({
        title: "Warning",
        description: "Please choose a subject"
      })
      return;
    }
    if (questionSelectionMode === "manual" && selectedQuestionIds.length === 0) {
      addToast({
        title: "Warning",
        description: "Select at least one question"
      })
      return;
    }
    if (!sectionsValid) {
      addToast({
        title: "Warning",
        description: "Please ensure each section has valid difficulty distribution (sums to 100) and questions"
      })
      return;
    }

    const payload = buildPayload();
    createAssessmentMutation.mutate(payload);
  };

  const confirmCreate = () => {
    const payload = buildPayload();
    createAssessmentMutation.mutate(payload);
    setPreviewOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumbs size="sm" className="mb-3">
            <BreadcrumbItem href={SidebarRoutes.dashboard} startContent={<MdOutlineDashboard className="w-4 h-4" />}>
              Dashboard
            </BreadcrumbItem>
            <BreadcrumbItem href={SidebarRoutes.assessment} startContent={<MdAssessment className="w-4 h-4" />}>
              Assessments
            </BreadcrumbItem>
            <BreadcrumbItem>Create Assessment</BreadcrumbItem>
          </Breadcrumbs>
          <h1 className="text-2xl font-semibold text-neutral-900">Create Assessment</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-6">
            {/* Main Content */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Basic Information */}
              <div className=" p-6">
                <h2 className="text-base font-medium text-neutral-900 mb-5">Basic Information</h2>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Title"
                      labelPlacement="outside"
                      placeholder="Enter assessment title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      classNames={{ label: "text-sm font-medium mb-1.5" }}
                    />
                    <Input
                      label="Code"
                      labelPlacement="outside"
                      placeholder="Enter assessment code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      classNames={{ label: "text-sm font-medium mb-1.5" }}
                    />
                  </div>

                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Provide a description for this assessment"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    minRows={3}
                    classNames={{ label: "text-sm font-medium mb-1.5" }}
                  />

                  <Textarea
                    label="Instructions"
                    labelPlacement="outside"
                    placeholder="Enter exam instructions (e.g., no negative marking, calculators allowed)"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    minRows={3}
                    classNames={{ label: "text-sm font-medium mb-1.5" }}
                  />

                  <div className="grid grid-cols-2 gap-4">

                    <Select
                      label="Category"
                      labelPlacement="outside"
                      placeholder="Select category"
                      selectedKeys={category ? [category] : []}
                      onSelectionChange={(keys) => {
                        const selectedId = Array.from(keys)[0] as string;
                        const selectedCategory = categories.find((c: any) => c.id === selectedId);

                        if (selectedCategory) {
                          setCategoryConfigId(selectedCategory.id);
                          setCategory(selectedCategory.category_name);
                        }
                      }}
                      classNames={{ label: "text-sm font-medium mb-1.5" }}
                    >
                      {categories.map((c: any) => (
                        <SelectItem key={c.id}>
                          {c.display_name ?? c.category_name}
                        </SelectItem>
                      ))}
                    </Select>


                    <Select
                      label="Subject"
                      labelPlacement="outside"
                      placeholder="Select subject"
                      selectedKeys={subjectId ? [subjectId] : []}
                      onSelectionChange={(keys) => setSubjectId(Array.from(keys)[0] as string)}
                      classNames={{ label: "text-sm font-medium mb-1.5" }}
                      required
                    >
                      {subjects.map((s: any) => (
                        <SelectItem key={s.id}>{s.name ?? s.title}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Exam Year (optional)"
                      labelPlacement="outside"
                      type="number"
                      value={examYear.toString()}
                      onChange={(e) => setExamYear(Number(e.target.value))}
                      classNames={{ label: "text-sm font-medium mb-1.5" }}
                    />
                    <Input
                      label="Exam Session (Optional)"
                      labelPlacement="outside"
                      placeholder="e.g., May June, Nov Dec, Continuous"
                      value={examSession}
                      onChange={(e) => setExamSession(e.target.value)}
                      classNames={{ label: "text-sm font-medium mb-1.5" }}
                    />
                  </div>
                </div>
              </div>

              {/* Topics */}
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <TopicsSelect selectedTopicIds={topicIds} onChange={(ids) => setTopicIds(ids)} subjectId={subjectId} />
              </div>

              {/* Sections */}
              <div className="hidden bg-white rounded-lg border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-medium text-neutral-900">Sections</h2>
                  <Button
                    type="button"
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

                <div className="space-y-3">
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
                  {sections.length === 0 && (
                    <p className="text-sm text-neutral-500 text-center py-8">No sections yet. Click "Add Section" to create one.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Publish */}
              <div className="hidden md:block bg-white rounded-lg border border-neutral-200 p-5">
                <Button
                  type="submit"
                  color="primary"
                  size="md"
                  className="w-full font-medium bg-kidemia-secondary text-white"
                  isLoading={createAssessmentMutation.isPending}
                >
                  {createAssessmentMutation.isPending ? "Publishing..." : "Publish Assessment"}
                </Button>
              </div>

              {/* Behavior */}
              <div className="bg-white rounded-lg border border-neutral-200 p-5">
                <h3 className="text-sm font-medium text-neutral-900 mb-4">Behavior</h3>
                <div className="space-y-3">
                  {[
                    { id: "shuffle-q", label: "Shuffle questions", checked: shuffleQuestions, onChange: setShuffleQuestions },
                    { id: "shuffle-o", label: "Shuffle options", checked: shuffleOptions, onChange: setShuffleOptions },
                    { id: "nav-q", label: "Allow question navigation", checked: allowQuestionNavigation, onChange: setAllowQuestionNavigation },
                    { id: "nav-b", label: "Allow backward navigation", checked: allowBackwardNavigation, onChange: setAllowBackwardNavigation },
                  ].map((item) => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => item.onChange(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300"
                      />
                      <span className="text-sm text-neutral-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="bg-white rounded-lg border border-neutral-200 p-5">
                <h3 className="text-sm font-medium text-neutral-900 mb-4">Results & Feedback</h3>
                <div className="space-y-4">
                  <Select
                    label="Display mode"
                    labelPlacement="outside"
                    size="sm"
                    selectedKeys={[resultDisplayMode]}
                    onSelectionChange={(keys) => setResultDisplayMode(Array.from(keys)[0] as string)}
                    classNames={{ label: "text-sm font-medium mb-1.5" }}
                  >
                    <SelectItem key="immediate">Immediate</SelectItem>
                    <SelectItem key="after_submission">After submission</SelectItem>
                    <SelectItem key="manual">Manual review</SelectItem>
                  </Select>

                  <div className="space-y-3">
                    {[
                      { id: "show-ans", label: "Show correct answers", checked: showCorrectAnswers, onChange: setShowCorrectAnswers },
                      { id: "show-exp", label: "Show explanations", checked: showExplanations, onChange: setShowExplanations },
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(e) => item.onChange(e.target.checked)}
                          className="w-4 h-4 rounded border-neutral-300"
                        />
                        <span className="text-sm text-neutral-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Proctoring */}
              <div className="bg-white rounded-lg border border-neutral-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-neutral-900">Proctoring</h3>
                  <Switch size="sm" classNames={{ wrapper: ["group-data-[selected=true]:bg-kidemia-primary"] }} isSelected={proctoringEnabled} onValueChange={setProctoringEnabled} />
                </div>

                {proctoringEnabled && (
                  <div className="space-y-3 pt-2 border-t border-neutral-100">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-neutral-700">Require webcam</span>
                      <Switch size="sm" classNames={{ wrapper: ["group-data-[selected=true]:bg-kidemia-secondary"] }} isSelected={requireWebcam} onValueChange={setRequireWebcam} />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-neutral-700">Fullscreen required</span>
                      <Switch size="sm" classNames={{ wrapper: ["group-data-[selected=true]:bg-kidemia-secondary"] }} isSelected={fullscreenRequired} onValueChange={setFullscreenRequired} />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-neutral-700">Detect tab switching</span>
                      <Switch size="sm" classNames={{ wrapper: ["group-data-[selected=true]:bg-kidemia-secondary"] }} isSelected={detectTabSwitching} onValueChange={setDetectTabSwitching} />
                    </label>
                    {detectTabSwitching && (
                      <Input
                        label="Max tab switches"
                        labelPlacement="outside"
                        type="number"
                        size="sm"
                        value={String(maxTabSwitches)}
                        onChange={(e) => setMaxTabSwitches(Number(e.target.value))}
                        classNames={{ label: "text-sm font-medium mb-1.5" }}
                      />
                    )}
                  </div>
                )}
              </div>


            </div>

            {/* Question Selection */}
            <div className="col-span-12 bg-white rounded-lg border border-neutral-200 p-6">

              <h2 className="text-base font-md text-kidemia-gray mb-2">Question Selection</h2>

              <RadioGroup
                orientation="horizontal"
                value={questionSelectionMode}
                onValueChange={(val) => setQuestionSelectionMode(val as SelectionMode)}
                classNames={{ wrapper: "gap-4" }}
              >
                <Radio value="manual">Manual</Radio>
                <Radio value="random">Random</Radio>
                <Radio value="adaptive">Adaptive</Radio>
              </RadioGroup>
              <div className="mt-2">
                {questionSelectionMode === "manual" && (
                  <QuestionsTable
                    subjectId={subjectId}
                    topicIds={topicIds}
                    filterMode={questionFilterMode}
                    searchQuery={searchQuery}
                    onSelectionChange={onQuestionsSelectionChange}
                  />
                )}
                {questionSelectionMode === "random" && (
                  <RandomModeConfig config={randomConfig} onChange={setRandomConfig} topics={topicIds} />
                )}
                {questionSelectionMode === "adaptive" && (
                  <AdaptiveModeConfig config={adaptiveConfig} onChange={setAdaptiveConfig} />
                )}
              </div>
            </div>

            {/* Availability & Pricing */}
            <div className="col-span-12 bg-white rounded-lg border border-neutral-200 p-5 md:p-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-6">Availability & Pricing</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

                {/* --- Date Group --- */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Available from (optional)</label>
                    <DatePicker className="w-full" size="sm" value={availableFrom} onChange={setAvailableFrom} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Available until (optional)</label>
                    <DatePicker className="w-full" size="sm" value={availableUntil} onChange={setAvailableUntil} />
                  </div>
                  <Input
                    label="Duration (minutes)"
                    labelPlacement="outside"
                    type="number"
                    size="sm"
                    placeholder="60"
                    value={String(durationMinutes)}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    classNames={{ label: "text-sm font-medium mb-1.5" }}
                  />
                </div>

                {/* --- Pricing Group --- */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Price"
                      labelPlacement="outside"
                      type="number"
                      size="sm"
                      value={String(price)}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      classNames={{ label: "text-sm font-medium mb-1.5" }}
                    />
                    <Select
                      label="Currency"
                      labelPlacement="outside"
                      size="sm"
                      selectedKeys={[currency]}
                      onSelectionChange={(keys) => setCurrency(Array.from(keys)[0] as string)}
                      classNames={{ label: "text-sm font-medium mb-1.5" }}
                    >
                      <SelectItem key="NGN">NGN</SelectItem>
                      <SelectItem key="USD">USD</SelectItem>
                      <SelectItem key="GHS">GHS</SelectItem>
                    </Select>
                  </div>

                  {price > 0 && (
                    <Input
                      label="Discount price"
                      labelPlacement="outside"
                      type="number"
                      size="sm"
                      placeholder="Optional"
                      value={discountPrice === null ? "" : String(discountPrice)}
                      onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : null)}
                      classNames={{ label: "text-sm font-medium mb-1.5" }}
                    />
                  )}

                  <Select
                    label="Status"
                    labelPlacement="outside"
                    size="sm"
                    selectedKeys={[status]}
                    onSelectionChange={(keys) => setStatus(Array.from(keys)[0] as string)}
                    classNames={{ label: "text-sm font-medium mb-1.5" }}
                  >
                    <SelectItem key="published">Published</SelectItem>
                    <SelectItem key="review">Review</SelectItem>
                    <SelectItem key="scheduled">Scheduled</SelectItem>
                    <SelectItem key="draft">Draft</SelectItem>
                    <SelectItem key="archived">Archived</SelectItem>
                  </Select>
                </div>

                {/* --- Full Width Visibility Section --- */}
                <div className="md:col-span-2 pt-2 border-t border-neutral-100 mt-2">
                  <label className="text-sm font-medium text-neutral-700 mb-3 block">Visibility</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={isPublic}
                        onChange={() => {
                          setIsPublic(true);
                          setRequireEnrollment(false);
                        }}
                        className="peer sr-only"
                      />
                      <div className="border border-neutral-200 rounded-lg px-4 py-3 text-sm text-center transition-all peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-600 hover:bg-neutral-50">
                        <span className="font-medium">Public</span>
                        <p className="text-[11px] opacity-70 hidden sm:block">Visible to everyone</p>
                      </div>
                    </label>

                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={requireEnrollment}
                        onChange={() => {
                          setIsPublic(false);
                          setRequireEnrollment(true);
                        }}
                        className="peer sr-only"
                      />
                      <div className="border border-neutral-200 rounded-lg px-4 py-3 text-sm text-center transition-all peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-600 hover:bg-neutral-50">
                        <span className="font-medium">Invite only</span>
                        <p className="text-[11px] opacity-70 hidden sm:block">Requires manual enrollment</p>
                      </div>
                    </label>

                    <div className="block md:hidden mt-4 px-4">
                      <Button
                        type="submit"
                        color="primary"
                        size="lg" // Slightly larger for better mobile tap target
                        className="w-full font-medium bg-kidemia-secondary text-white shadow-lg"
                        isLoading={createAssessmentMutation.isPending}
                      >
                        {createAssessmentMutation.isPending ? "Publishing..." : "Publish Assessment"}
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </form>
      </div>

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} payload={buildPayload()} onConfirm={confirmCreate} />
    </div>
  );
}
