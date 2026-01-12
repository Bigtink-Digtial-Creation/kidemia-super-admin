import { useState, useEffect } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { QuestionLocal, ToastType, Topic } from './question.types';
import { QueryKeys } from '../../../utils/queryKeys';
import { ApiSDK } from '../../../sdk';
import { QuestionCard } from '../components/QuestionCard';
import { mapToApiPayload, validateQuestions } from './questionUtils';
import { Toast } from '../../../components/Toast/Toast';
import { SidebarRoutes } from '../../../routes';
import type { QuestionTagResponse, TopicListResponse } from '../../../sdk/generated';

export default function QuestionEditPage() {
    const { id: questionId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const subjectIdFromState = location.state?.subjectId;
    const [questions, setQuestions] = useState<QuestionLocal[]>([]);
    const [toast, setToast] = useState<ToastType>(null);

    const { data: questionData, isLoading: loadingQuestion } = useQuery({
        queryKey: [QueryKeys.questionDetails, questionId],
        queryFn: () => ApiSDK.TopicQuestionsService.getQuestionApiV1QuestionsQuestionIdGet(questionId!),
        enabled: !!questionId,
    });

    const effectiveSubjectId = subjectIdFromState || questionData?.subject_id;

    const { data: topicsData, isLoading: loadingTopics } = useQuery<TopicListResponse>({
        queryKey: [QueryKeys.singleSubject, effectiveSubjectId],
        queryFn: () => ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(effectiveSubjectId!),
        enabled: !!effectiveSubjectId,
    });

    const { data: tagsData } = useQuery<QuestionTagResponse[]>({
        queryKey: [QueryKeys.tags,],
        queryFn: () => ApiSDK.TagsService.getTagsApiV1TagsGet(),
    });

    useEffect(() => {
        if (questionData) {
            // 1. Map QuestionTagResponse[] to string[] for the select component
            const initialTagIds = questionData.tags?.map(t => t.id) || [];

            const mappedQuestion: QuestionLocal = {
                id: questionData.id,
                subject_id: questionData.subject_id,
                topic_id: questionData.topic_id,
                question_text: questionData.question_text,
                question_type: questionData.question_type,
                difficulty_level: questionData.difficulty_level,
                points: questionData.points ?? 1,
                // Fix: Convert undefined to null to satisfy QuestionLocal type
                time_limit_seconds: questionData.time_limit_seconds ?? null,
                explanation: questionData.explanation ?? '',
                image_url: questionData.image_url ?? '',
                audio_url: questionData.audio_url ?? '',
                video_url: questionData.video_url ?? '',
                tag_ids: initialTagIds,
                options: (questionData.options ?? []).map(opt => ({
                    option_text: opt.option_text,
                    is_correct: !!opt.is_correct,
                    display_order: opt.option_order ?? 1,
                }))
            };
            setQuestions([mappedQuestion]);
        }
    }, [questionData]);

    const topics: Topic[] = topicsData?.items || [];
    const availableTags = tagsData || [];

    const updateQuestionMutation = useMutation({
        mutationFn: (payload: any) =>
            ApiSDK.TopicQuestionsService.updateQuestionApiV1QuestionsQuestionIdPut(questionId!, payload[0]),
        onSuccess: () => {
            setToast({ message: 'Question updated successfully!', type: 'success' });
            setTimeout(() => navigate(SidebarRoutes.singleSubject.replace(':id', effectiveSubjectId!)), 1000);
        },
        onError: () => setToast({ message: 'Failed to update question.', type: 'error' })
    });

    const handleSave = () => {
        if (!validateQuestions(questions, (msg, type) => setToast({ message: msg, type }))) return;
        const payload = mapToApiPayload(questions);
        updateQuestionMutation.mutate(payload);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <Toast toast={toast} onClose={() => setToast(null)} />
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors">
                    <ChevronLeft className="w-5 h-5" /> Back to Subject
                </button>

                {loadingQuestion || loadingTopics ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {questions.map((q, idx) => (
                            <QuestionCard
                                key={q.id}
                                question={q}
                                index={idx}
                                topics={topics}
                                tags={availableTags}
                                onUpdate={(fields) => setQuestions(prev => prev.map(item => item.id === q.id ? { ...item, ...fields } : item))}
                                onDelete={() => { }}
                            />
                        ))}
                        <div className="flex justify-end p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <button
                                onClick={handleSave}
                                disabled={updateQuestionMutation.isPending}
                                className="flex items-center gap-2 px-10 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 transition-all"
                            >
                                <Save className="w-5 h-5" />
                                {updateQuestionMutation.isPending ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}