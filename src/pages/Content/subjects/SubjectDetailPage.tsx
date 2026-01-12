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
import { ArrowLeft, Plus, Search, SlidersHorizontal, Trash2, Eye } from 'lucide-react';
import { useParams, useNavigate } from 'react-router';

import { useDeleteTopic, useSubject, useTopics } from '../../../hooks/useSubjects';
import BallSpinner from '../../../components/Spinner/BallSpinner';
import { CreateTopicModal } from '../components/modals/CreateTopicModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { SidebarRoutes } from '../../../routes';

export default function SubjectDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteTopicId, setDeleteTopicId] = useState<string>('');
    const [deleteTopicName, setDeleteTopicName] = useState<string>('');

    const createTopicModal = useDisclosure();
    const editSubjectModal = useDisclosure();
    const deleteTopicModal = useDisclosure();

    const { subject, isLoading: subjectLoading } = useSubject(id);
    const { topics } = useTopics(id);
    const deleteTopic = useDeleteTopic();

    const filteredTopics = topics?.filter((topic) =>
        topic.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleViewTopic = (topicId: string, topicName: string) => {
        navigate(
            SidebarRoutes.singleTopic
                .replace(':subjectId', id!)
                .replace(':topicId', topicId),
            {
                state: {
                    subjectName: subject?.name,
                    topicName,
                },
            }
        );
    };

    const handleDeleteTopic = (topicId: string, topicName: string) => {
        setDeleteTopicId(topicId);
        setDeleteTopicName(topicName);
        deleteTopicModal.onOpen();
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteTopic.mutateAsync(deleteTopicId);
            addToast({
                title: 'Success',
                description: 'Topic deleted successfully',
                color: 'success',
            });
            deleteTopicModal.onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to delete topic',
                color: 'danger',
            });
        }
    };

    if (subjectLoading || !subject) {
        return (
            <div className="h-screen flex items-center justify-center">
                <BallSpinner />
            </div>
        );
    }

    return (
        <>
            <section className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            isIconOnly
                            variant="flat"
                            size="sm"
                            className="bg-white shadow-sm"
                            onPress={() => navigate(SidebarRoutes.subjects)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
                            {subject.name}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            className="flex-1 sm:flex-none bg-white text-kidemia-secondary border border-kidemia-secondary font-medium"
                            size="md"
                            radius="sm"
                            onPress={editSubjectModal.onOpen}
                        >
                            Edit
                        </Button>
                        <Button
                            className="flex-1 sm:flex-none bg-kidemia-secondary text-white font-medium"
                            size="md"
                            radius="sm"
                            startContent={<Plus className="h-4 w-4" />}
                            onPress={createTopicModal.onOpen}
                        >
                            Add Topic
                        </Button>
                    </div>
                </div>

                {/* Search & Filters Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-6 lg:col-span-8">
                        <Input
                            placeholder="Search topics..."
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
                    <div className="grid grid-cols-2 md:col-span-6 lg:col-span-4 gap-2">
                        <Button
                            variant="flat"
                            size="lg"
                            radius="sm"
                            className="bg-white border-1 border-gray-100 shadow-sm"
                            startContent={<SlidersHorizontal className="h-4 w-4" />}
                        >
                            Filter
                        </Button>
                        <Select
                            placeholder="Sort"
                            selectedKeys={['most_recent']}
                            variant="flat"
                            size="lg"
                            radius="sm"
                            classNames={{
                                trigger: 'bg-white border-1 border-gray-100 shadow-sm',
                            }}
                        >
                            <SelectItem key="most_recent" textValue="Most Recent">
                                Most recent
                            </SelectItem>
                            <SelectItem key="alphabetical" textValue="A - Z">
                                A - Z
                            </SelectItem>
                        </Select>
                    </div>
                </div>

                {/* List/Grid View */}
                <div className="space-y-3">
                    {/* Desktop Table Header (Hidden on Mobile) */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 rounded-t-lg border-b border-gray-200 text-sm font-semibold text-gray-600">
                        <div className="col-span-1">S/N</div>
                        <div className="col-span-6">Topic & Description</div>
                        <div className="col-span-3 text-center">Questions</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {filteredTopics.map((topic, index) => (
                        <div
                            key={topic.id}
                            className={`group flex flex-col md:grid md:grid-cols-12 gap-4 p-4 md:px-6 md:py-4 rounded-lg border border-gray-100 transition-all hover:shadow-md ${index % 2 === 1 ? 'bg-pink-50/20' : 'bg-white'
                                }`}
                        >
                            {/* Mobile Top Row: S/N and Badge */}
                            <div className="flex justify-between items-center md:col-span-1">
                                <span className="text-xs font-bold text-gray-400 md:text-sm">
                                    #{index + 1}
                                </span>
                                <div className="md:hidden">
                                    <Chip size="sm" variant="flat" className="bg-blue-50 text-blue-600">
                                        {topic.questions_count || 0} Questions
                                    </Chip>
                                </div>
                            </div>

                            {/* Content Row */}
                            <div className="md:col-span-6 space-y-1">
                                <h3 className="font-bold text-gray-900 group-hover:text-kidemia-secondary transition-colors">
                                    {topic.name}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 md:line-clamp-1">
                                    {topic.description || 'No description provided for this topic.'}
                                </p>
                            </div>

                            {/* Desktop Stats */}
                            <div className="hidden md:flex md:col-span-3 items-center justify-center">
                                <Chip variant="flat" className="bg-gray-100 text-gray-700 font-medium">
                                    {topic.questions_count || 0} Questions
                                </Chip>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-50 md:border-none md:pt-0 md:col-span-2 md:justify-end">
                                <Button
                                    className="flex-1 md:flex-none bg-kidemia-secondary text-white"
                                    size="sm"
                                    radius="sm"
                                    startContent={<Eye className="h-4 w-4" />}
                                    onPress={() => handleViewTopic(topic.id, topic.name)}
                                >
                                    View
                                </Button>
                                <Button
                                    isIconOnly
                                    className="bg-red-50 text-red-600"
                                    size="sm"
                                    radius="sm"
                                    onPress={() => handleDeleteTopic(topic.id, topic.name)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {filteredTopics.length === 0 && (
                        <div className="py-20 text-center bg-white rounded-xl border-2 border-dashed border-gray-100">
                            <p className="text-gray-400">No topics found matching your search.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Modals remain same as they are already mobile-responsive in HeroUI */}
            <CreateTopicModal
                isOpen={createTopicModal.isOpen}
                onClose={createTopicModal.onClose}
                subjectId={id}
                subjectName={subject.name}
            />
            <DeleteConfirmModal
                isOpen={deleteTopicModal.isOpen}
                onClose={deleteTopicModal.onClose}
                title="Delete Topic"
                message={`Are you sure you want to delete "${deleteTopicName}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                isLoading={deleteTopic.isPending}
            />
        </>
    );
}