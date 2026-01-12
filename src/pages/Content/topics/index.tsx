import { useState } from 'react';
import {
    Button,
    Input,
    Select,
    SelectItem,
    useDisclosure,
    Chip,
    addToast,
} from '@heroui/react';
import { ArrowLeft, Plus, Search, SlidersHorizontal, Trash2, HelpCircle } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router';

import { useDeleteQuestion, useQuestions } from '../../../hooks/useSubjects';
import BallSpinner from '../../../components/Spinner/BallSpinner';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { SidebarRoutes } from '../../../routes';

export default function TopicDetailPage() {
    const { subjectId, topicId } = useParams<{
        subjectId: string;
        topicId: string;
    }>();

    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteQuestionId, setDeleteQuestionId] = useState<string>('');

    const deleteQuestionModal = useDisclosure();

    const { questions = [], isLoading } = useQuestions(topicId);
    const deleteQuestion = useDeleteQuestion();

    // Get subject and topic names from navigation state
    const subjectName = location.state?.subjectName || 'Subject';
    const topicName = location.state?.topicName || 'Topic';

    const filteredQuestions = questions.filter((question) =>
        question.question_text?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewQuestion = (questionId: string) => {
        navigate(SidebarRoutes.editQuestion.replace(':id', questionId), {
            state: { subjectId },
        });
    };

    const handleAddQuestion = () => {
        navigate(SidebarRoutes.addQuestionsSubject.replace(":id", subjectId!), {
            state: { topicId, subjectId },
        });
    };

    const handleDeleteQuestion = (questionId: string) => {
        setDeleteQuestionId(questionId);
        deleteQuestionModal.onOpen();
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteQuestion.mutateAsync(deleteQuestionId);
            addToast({
                title: 'Success',
                description: 'Question deleted successfully',
                color: 'success',
            });
            deleteQuestionModal.onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to delete question',
                color: 'danger',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <BallSpinner />
            </div>
        );
    }

    return (
        <>
            <section className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            isIconOnly
                            variant="flat"
                            size="sm"
                            className="bg-white shadow-sm"
                            onPress={() => navigate(SidebarRoutes.singleSubject.replace(":id", subjectId!))}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                                {topicName}
                            </h1>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                {subjectName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select
                            placeholder="Category"
                            selectedKeys={['common_entrance']}
                            variant="flat"
                            size="md"
                            radius="sm"
                            className="hidden lg:block w-48"
                            isDisabled
                        >
                            <SelectItem key="common_entrance" textValue="Common Entrance">
                                Common entrance
                            </SelectItem>
                        </Select>
                        <Button
                            className="flex-1 sm:flex-none bg-kidemia-secondary text-white font-medium"
                            size="md"
                            radius="sm"
                            startContent={<Plus className="h-4 w-4" />}
                            onPress={handleAddQuestion}
                        >
                            Add Question
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-8">
                        <Input
                            placeholder="Search question text..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startContent={<Search className="h-5 w-5 text-gray-400" />}
                            variant="flat"
                            size="lg"
                            radius="sm"
                            isClearable
                            className="w-full"
                            classNames={{
                                input: 'bg-white',
                                inputWrapper: 'bg-white shadow-sm border-1 border-gray-100',
                            }}
                        />
                    </div>
                    <div className="flex gap-2 md:col-span-4">
                        <Button
                            variant="flat"
                            size="lg"
                            radius="sm"
                            className="flex-1 bg-white border-1 border-gray-100 shadow-sm"
                            startContent={<SlidersHorizontal className="h-5 w-5" />}
                        >
                            Filter
                        </Button>
                        <Select
                            placeholder="Sort"
                            selectedKeys={['most_recent']}
                            variant="flat"
                            size="lg"
                            radius="sm"
                            className="flex-1"
                            classNames={{
                                trigger: 'bg-white border-1 border-gray-100 shadow-sm',
                            }}
                        >
                            <SelectItem key="most_recent" textValue="Newest">Most recent</SelectItem>
                            <SelectItem key="oldest" textValue="Oldest">Oldest</SelectItem>
                        </Select>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-3">
                    {/* Desktop Table Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 rounded-t-lg border-b border-gray-200 text-sm font-semibold text-gray-600">
                        <div className="col-span-1">No.</div>
                        <div className="col-span-8">Question Content</div>
                        <div className="col-span-3 text-right">Actions</div>
                    </div>

                    {filteredQuestions.map((question, index) => (
                        <div
                            key={question.id}
                            className={`flex flex-col md:grid md:grid-cols-12 gap-4 p-4 md:px-6 md:py-5 rounded-xl border border-gray-100 transition-all hover:shadow-md bg-white`}
                        >
                            {/* Mobile Top Row */}
                            <div className="flex justify-between items-center md:col-span-1">
                                <span className="flex items-center gap-2 text-xs font-bold text-gray-400 md:text-sm">
                                    <HelpCircle className="h-3 w-3 md:hidden" />
                                    Q{index + 1}
                                </span>
                                <Chip size="sm" variant="flat" className="md:hidden bg-gray-100 text-gray-600">
                                    {topicName}
                                </Chip>
                            </div>

                            {/* Question Text */}
                            <div className="md:col-span-8">
                                <p className="text-gray-900 font-medium line-clamp-3 md:line-clamp-2">
                                    {question.question_text || 'No question text available'}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-50 md:border-none md:pt-0 md:col-span-3 md:justify-end">
                                <Button
                                    className="flex-1 md:flex-none bg-kidemia-secondary text-white"
                                    size="sm"
                                    radius="sm"
                                    onPress={() => handleViewQuestion(question.id)}
                                >
                                    Edit Question
                                </Button>
                                <Button
                                    isIconOnly
                                    className="bg-red-50 text-red-600"
                                    size="sm"
                                    radius="sm"
                                    onPress={() => handleDeleteQuestion(question.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {filteredQuestions.length === 0 && (
                        <div className="py-16 text-center bg-white rounded-xl border-2 border-dashed border-gray-100">
                            <HelpCircle className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-500 mb-4">No questions found</p>
                            <Button
                                className="bg-kidemia-secondary text-white"
                                size="md"
                                radius="sm"
                                onPress={handleAddQuestion}
                            >
                                Add First Question
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            <DeleteConfirmModal
                isOpen={deleteQuestionModal.isOpen}
                onClose={deleteQuestionModal.onClose}
                title="Delete Question"
                message="Are you sure you want to delete this question? This action cannot be undone and will remove all associated options."
                onConfirm={handleConfirmDelete}
                isLoading={deleteQuestion.isPending}
            />
        </>
    );
}