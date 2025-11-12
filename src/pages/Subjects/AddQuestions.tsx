import { useState } from 'react';
import { ChevronLeft, Plus, FileUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ApiSDK } from '../../sdk';
import { QueryKeys } from "../../utils/queryKeys";
import type { QuestionCreate } from "../../sdk/generated";
import type { QuestionLocal, Topic, ToastType } from './question.types';
import { Toast } from '../../components/Toast/Toast';
import { BulkUploadModal } from '../../components/Modals/BulkQuestionUploadModal';
import { QuestionCard } from '../../components/QuestionCard/QuestionCard';
import { validateQuestions, mapToApiPayload } from './questionUtils';
import { parseCsvFile } from './csvParser';

export default function QuestionCreationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuestionLocal[]>([
    {
      id: `q-${Date.now()}`,
      subject_id: id || '',
      question_text: '',
      topic_id: '',
      question_type: 'multiple_choice',
      difficulty_level: 'easy',
      points: 1,
      time_limit_seconds: null,
      explanation: '',
      options: [],
      audio_url: '',
      image_url: '',
      video_url: '',
      tag_ids: null
    }
  ]);

  const [toast, setToast] = useState<ToastType>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const { data: topicsData, isLoading: loadingTopics } = useQuery({
    queryKey: [QueryKeys.singleSubject, id],
    queryFn: () => ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(id || ''),
    enabled: !!id,
  });

  const topics: Topic[] = topicsData?.items || [];

  const saveQuestionsMutation = useMutation({
    mutationFn: (payload: QuestionCreate[]) =>
      ApiSDK.TopicQuestionsService.createBulkQuestionApiV1QuestionsBulkQuestionsPost(payload),
    onSuccess: () => {
      showToastMessage('Questions saved successfully!', 'success');
      setTimeout(() => navigate(`/dashboard/subjects/${id}`), 1000);
    },
    onError: (err) => {
      console.error('Save questions error', err);
      showToastMessage('Failed to save questions. Please check your data and try again.', 'error');
    }
  });

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const addQuestion = () => {
    const q: QuestionLocal = {
      id: `q-${Date.now()}`,
      subject_id: id || '',
      question_text: '',
      topic_id: '',
      question_type: 'multiple_choice',
      difficulty_level: 'easy',
      points: 1,
      time_limit_seconds: null,
      explanation: '',
      options: [],
      audio_url: '',
      image_url: '',
      video_url: '',
      tag_ids: null
    };
    setQuestions(prev => [...prev, q]);
    showToastMessage('New question added', 'info');
  };

  const updateQuestion = (qid: string, updates: Partial<QuestionLocal>) => {
    setQuestions(prev => prev.map(q => q.id === qid ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (qid: string) => {
    if (questions.length <= 1) {
      showToastMessage('You must have at least one question', 'error');
      return;
    }
    setQuestions(prev => prev.filter(q => q.id !== qid));
    showToastMessage('Question deleted', 'info');
  };

  const handleBulkUpload = async (file: File) => {
    showToastMessage('Processing CSV file...', 'info');
    try {
      const newQuestions = await parseCsvFile(file, id || '');
      setQuestions(prev => [...prev, ...newQuestions]);
      showToastMessage(`Imported ${newQuestions.length} questions`, 'success');
    } catch (err) {
      console.error('CSV parse error', err);
      showToastMessage(err instanceof Error ? err.message : 'Failed to parse CSV', 'error');
    }
  };

  const saveQuestions = () => {
    if (!validateQuestions(questions, showToastMessage)) return;
    const payload = mapToApiPayload(questions);
    console.log('payload', payload);
    saveQuestionsMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Toast toast={toast} onClose={() => setToast(null)} />

        <div className="mb-8">
          <button
            onClick={() => navigate(`/dashboard/subjects/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Subject</span>
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-600 mb-2">Create Questions</h1>
              <p className="text-gray-600 text-sm">Build engaging questions for your students</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkUpload(true)}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold"
              >
                <FileUp className="w-5 h-5" />
                Bulk Upload
              </button>
            </div>
          </div>
        </div>

        {loadingTopics ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading topics...</p>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-6">
              {questions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  topics={topics}
                  onUpdate={(fields) => updateQuestion(q.id, fields)}
                  onDelete={() => deleteQuestion(q.id)}
                />
              ))}
            </div>

            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-100 px-6 py-4">
              <button
                onClick={addQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Question
              </button>

              <div className="flex gap-3">
                <button
                  onClick={saveQuestions}
                  disabled={saveQuestionsMutation.isPending}
                  className={`px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 font-medium transition-all shadow-lg ${saveQuestionsMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {saveQuestionsMutation.isPending ? 'Saving...' : 'Save Questions'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showBulkUpload && (
        <BulkUploadModal
          isOpen={showBulkUpload}
          onClose={() => setShowBulkUpload(false)}
          onUpload={handleBulkUpload}
        />
      )}

      <style>{`
        @keyframes slideIn { 
          from { transform: translateX(100%); opacity: 0; } 
          to { transform: translateX(0); opacity: 1; } 
        }
        @keyframes fadeIn { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        @keyframes scaleIn { 
          from { transform: scale(0.95); opacity: 0; } 
          to { transform: scale(1); opacity: 1; } 
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}