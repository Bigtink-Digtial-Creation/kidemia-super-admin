import { useState } from 'react';
import { ChevronLeft, FileUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { QuestionLocal, Topic } from './question.types';
import { QueryKeys } from '../../../utils/queryKeys';
import { ApiSDK } from '../../../sdk';
import type { QuestionCreate, QuestionTagResponse } from '../../../sdk/generated';
import { parseCsvFile } from './csvParser';
import { QuestionCard } from '../components/QuestionCard';
import { mapToApiPayload, validateQuestions } from './questionUtils';
import { BulkUploadModal } from '../../../components/Modals/BulkQuestionUploadModal';
import { SidebarRoutes } from '../../../routes';
import { addToast } from '@heroui/react';

export default function QuestionCreationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const blankQuestion = (): QuestionLocal => ({
    id: `q-${Date.now()}`,
    subject_id: id || '',
    question_text: '',
    question_content: null,
    topic_id: '',
    question_type: 'multiple_choice',
    difficulty_level: 'easy',
    points: 1,
    time_limit_seconds: null,
    explanation: '',
    explanation_content: null,
    options: [],
    audio_url: '',
    image_url: '',
    video_url: '',
    tag_ids: [],
  });

  const [questions, setQuestions] = useState<QuestionLocal[]>([blankQuestion()]);
  const [globalTopicId, setGlobalTopicId] = useState('');
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const addQuestion = () => setQuestions((p) => [...p, blankQuestion()]);

  const { data: topicsData, isLoading: loadingTopics } = useQuery({
    queryKey: [QueryKeys.singleSubject, id],
    queryFn: () =>
      ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(id || ''),
    enabled: !!id,
  });

  const { data: tagsData } = useQuery<QuestionTagResponse[]>({
    queryKey: ['all-tags'],
    queryFn: () => ApiSDK.TagsService.getTagsApiV1TagsGet(),
  });

  const topics: Topic[] = topicsData?.items || [];
  const availableTags = tagsData || [];
  const queryClient = useQueryClient();

  const saveQuestionsMutation = useMutation({
    mutationFn: (payload: QuestionCreate[]) =>
      ApiSDK.TopicQuestionsService.createBulkQuestionApiV1QuestionsBulkQuestionsPost(payload),
    onSuccess: () => {
      addToast({ title: 'Questions saved successfully!', color: 'success' });
      setTimeout(() => navigate(SidebarRoutes.singleSubject.replace(':id', id!)), 1000);
      queryClient.invalidateQueries({ queryKey: [QueryKeys.subjectTopics] });

    },
    onError: () => {
      addToast({ title: 'Failed to save questions', color: 'danger' });
    },
  });

  const updateQuestion = (qid: string, updates: Partial<QuestionLocal>) => {
    setQuestions((prev) => prev.map((q) => (q.id === qid ? { ...q, ...updates } : q)));
  };

  const deleteQuestion = (qid: string) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== qid));
  };

  // Apply the selected global topic to every question at once
  const applyTopicToAll = () => {
    if (!globalTopicId) return;
    setQuestions((prev) => prev.map((q) => ({ ...q, topic_id: globalTopicId })));
    addToast({ title: 'Topic applied to all questions', color: 'success' });
  };

  const handleBulkUpload = async (file: File) => {
    try {
      const newQuestions = await parseCsvFile(file, id || '');
      setQuestions((prev) => [...prev, ...newQuestions]);
    } catch {
      addToast({ title: 'Failed to parse CSV', color: 'danger' });
    }
  };

  const saveQuestions = () => {
    if (
      !validateQuestions(questions, (msg, type) => {
        addToast({ title: msg, color: type });
      })
    )
      return;
    const payload = mapToApiPayload(questions);
    saveQuestionsMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-kidemia-white">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* ── Top nav ──────────────────────────────────────────────── */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <button
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            <FileUp className="w-4 h-4" /> Bulk Upload
          </button>
        </div>

        {loadingTopics ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full inline-block" />
          </div>
        ) : (
          <div className="space-y-6">

            {/* ── Global topic bar ────────────────────────────────── */}
            {topics.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 bg-orange-50 border border-orange-100 rounded-xl">
                <span className="text-sm font-semibold text-orange-700 whitespace-nowrap">
                  Apply topic to all:
                </span>
                <select
                  value={globalTopicId}
                  onChange={(e) => setGlobalTopicId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-orange-200 rounded-xl bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                >
                  <option value="">Select a topic…</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={applyTopicToAll}
                  disabled={!globalTopicId}
                  className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors whitespace-nowrap"
                >
                  Apply to all
                </button>
              </div>
            )}

            {/* ── Question cards ───────────────────────────────────── */}
            {questions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                topics={topics}
                tags={availableTags}
                onUpdate={(fields) => updateQuestion(q.id, fields)}
                onDelete={() => deleteQuestion(q.id)}
              />
            ))}

            {/* ── Footer actions ───────────────────────────────────── */}
            <div className="flex justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <button
                onClick={addQuestion}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium"
              >
                + Add Question
              </button>
              <button
                onClick={saveQuestions}
                disabled={saveQuestionsMutation.isPending}
                className="px-8 py-2 bg-orange-500 text-white rounded-lg font-bold"
              >
                {saveQuestionsMutation.isPending ? 'Saving...' : 'Save All'}
              </button>
            </div>
          </div>
        )}
      </div>

      {showBulkUpload && (
        <BulkUploadModal
          isOpen={showBulkUpload}
          onClose={() => setShowBulkUpload(false)}
          onUpload={handleBulkUpload}
        />
      )}
    </div>
  );
}