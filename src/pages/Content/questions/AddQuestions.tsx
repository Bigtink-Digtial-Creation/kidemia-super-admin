import { useState } from 'react';
import { ChevronLeft, FileUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
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
    subject_id: id || "",
    question_text: "",
    question_content: null,
    topic_id: "",
    question_type: "multiple_choice",
    difficulty_level: "easy",
    points: 1,
    time_limit_seconds: null,
    explanation: "",
    explanation_content: null,
    options: [],
    audio_url: "",
    image_url: "",
    video_url: "",
    tag_ids: [],
  });

  const [questions, setQuestions] = useState<QuestionLocal[]>([blankQuestion()]);

  const addQuestion = () => setQuestions((p) => [...p, blankQuestion()]);


  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const { data: topicsData, isLoading: loadingTopics } = useQuery({
    queryKey: [QueryKeys.singleSubject, id],
    queryFn: () => ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(id || ''),
    enabled: !!id,
  });

  // Fetch Tags for the dropdown
  const { data: tagsData } = useQuery<QuestionTagResponse[]>({
    queryKey: ['all-tags'],
    queryFn: () => ApiSDK.TagsService.getTagsApiV1TagsGet(),
  });

  const topics: Topic[] = topicsData?.items || [];
  const availableTags = tagsData || [];

  const saveQuestionsMutation = useMutation({
    mutationFn: (payload: QuestionCreate[]) =>
      ApiSDK.TopicQuestionsService.createBulkQuestionApiV1QuestionsBulkQuestionsPost(payload),
    onSuccess: () => {
      addToast({ title: 'Questions saved successfully!', color: 'success' })
      setTimeout(() => navigate(SidebarRoutes.singleSubject.replace(':id', id!)), 1000);
    },
    onError: () => {
      addToast({ title: 'Failed to save questions', color: 'danger' })

    }
  });


  const updateQuestion = (qid: string, updates: Partial<QuestionLocal>) => {
    setQuestions(prev => prev.map(q => q.id === qid ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (qid: string) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter(q => q.id !== qid));
  };

  const handleBulkUpload = async (file: File) => {
    try {
      const newQuestions = await parseCsvFile(file, id || '');
      setQuestions(prev => [...prev, ...newQuestions]);
    } catch (err) {
      addToast({
        title: "Failed to parse CSV",
        color: "danger",
      });
    }
  };

  const saveQuestions = () => {
    if (!validateQuestions(questions, (msg, type) => {
      addToast({ title: msg, color: type })
    })) return;
    // Since tag_ids is already string[], mapToApiPayload should handle it directly
    const payload = mapToApiPayload(questions);
    saveQuestionsMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-kidemia-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600"><ChevronLeft className="w-5 h-5" /> Back</button>
          <button onClick={() => setShowBulkUpload(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg"><FileUp className="w-4 h-4" /> Bulk Upload</button>
        </div>

        {loadingTopics ? (
          <div className="text-center py-12"><div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full inline-block"></div></div>
        ) : (
          <div className="space-y-6">
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
            <div className="flex justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <button onClick={addQuestion} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">+ Add Question</button>
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
      {showBulkUpload && <BulkUploadModal isOpen={showBulkUpload} onClose={() => setShowBulkUpload(false)} onUpload={handleBulkUpload} />}
    </div>
  );
}