import { useState } from 'react';
import {
    Button,
    Input,
    Select,
    SelectItem,
    useDisclosure,
    Pagination,
    Chip,
    addToast,
} from '@heroui/react';
import { Plus, Search, SlidersHorizontal, Tag, Edit2, Trash2 } from 'lucide-react';
import { useDeleteTag, useTags } from '../../../hooks/useTag';
import BallSpinner from '../../../components/Spinner/BallSpinner';
import { CreateTagModal } from '../components/modals/CreateTagModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { EditTagModal } from '../components/modals/EditTagModal';

export default function TagsPage() {
    const [selectedTag, setSelectedTag] = useState<any | null>(null);
    const [deleteTagId, setDeleteTagId] = useState<string>('');
    const [deleteTagName, setDeleteTagName] = useState<string>('');

    const createModal = useDisclosure();
    const editModal = useDisclosure();
    const deleteModal = useDisclosure();

    const {
        tags,
        totalCount,
        totalPages,
        isLoading,
        filters,
        setFilters,
        pagination,
        setPagination,
    } = useTags();

    const deleteTag = useDeleteTag();

    const handleSearchChange = (value: string) => {
        setFilters((prev) => ({ ...prev, search: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleEdit = (tag: any) => {
        setSelectedTag(tag);
        editModal.onOpen();
    };

    const handleDelete = (tagId: string, tagName: string) => {
        setDeleteTagId(tagId);
        setDeleteTagName(tagName);
        deleteModal.onOpen();
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteTag.mutateAsync(deleteTagId);
            addToast({
                title: 'Success',
                description: 'Tag deleted successfully',
                color: 'success',
            });
            deleteModal.onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to delete tag',
                color: 'danger',
            });
        }
    };

    if (isLoading && !tags) {
        return (
            <div className="h-screen flex items-center justify-center">
                <BallSpinner />
            </div>
        );
    }

    return (
        <>
            <section className="space-y-6 p-4 md:p-6 max-w-[1400px] mx-auto">
                {/* Header - Stacks on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-kidemia-primary/10 rounded-lg shrink-0">
                            <Tag className="h-6 w-6 text-kidemia-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tags</h1>
                            <p className="text-sm text-gray-600">
                                Manage question and content tags
                            </p>
                        </div>
                    </div>
                    <Button
                        className="bg-kidemia-secondary text-white font-medium w-full sm:w-auto"
                        size="md"
                        radius="sm"
                        startContent={<Plus className="h-4 w-4" />}
                        onPress={createModal.onOpen}
                    >
                        Add Tag
                    </Button>
                </div>

                {/* Search and Filters - Stacked/Wrapping */}
                <div className="flex flex-col lg:flex-row gap-3">
                    <Input
                        placeholder="Search tags..."
                        value={filters.search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        startContent={<Search className="h-5 w-5 text-gray-400" />}
                        variant="flat"
                        size="lg"
                        radius="sm"
                        isClearable
                        onClear={() => handleSearchChange('')}
                        className="w-full lg:flex-1"
                        classNames={{
                            input: 'bg-gray-50',
                            inputWrapper: 'bg-gray-50 border-none',
                        }}
                    />
                    <div className="flex flex-row gap-2">
                        <Button
                            variant="flat"
                            size="lg"
                            radius="sm"
                            className="bg-gray-50 flex-1 sm:flex-none"
                            startContent={<SlidersHorizontal className="h-5 w-5" />}
                        >
                            Filter
                        </Button>
                        <Select
                            placeholder="Sort by"
                            selectedKeys={['most_recent']}
                            variant="flat"
                            size="lg"
                            radius="sm"
                            className="w-full sm:w-48 flex-1"
                            classNames={{
                                trigger: 'bg-gray-50 border-none',
                            }}
                        >
                            <SelectItem key="most_recent">Most recent</SelectItem>
                            <SelectItem key="oldest">Oldest</SelectItem>
                            <SelectItem key="name_asc">Name (A-Z)</SelectItem>
                        </Select>
                    </div>
                </div>

                {/* Stats - Grid layout for responsiveness */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="border-b sm:border-b-0 sm:border-r border-gray-100 pb-4 sm:pb-0">
                            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">Total Tags</p>
                            <p className="text-2xl md:text-3xl font-bold text-kidemia-primary mt-1">{totalCount}</p>
                        </div>
                        <div className="border-b sm:border-b-0 sm:border-r border-gray-100 pb-4 sm:pb-0">
                            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">Active Tags</p>
                            <p className="text-2xl md:text-3xl font-bold text-kidemia-secondary mt-1">
                                {tags.filter((t) => t).length}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">Question Count</p>
                            <p className="text-2xl md:text-3xl font-bold text-kidemia-primary mt-1">
                                {tags.reduce((acc, tag) => acc + (tag.questions_count || 0), 0)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Responsive Content: Table on Desktop, Cards on Mobile */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">S/N</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Tag Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Description</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Questions</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tags.map((tag, index) => (
                                    <tr key={tag.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {(pagination.page - 1) * pagination.pageSize + index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Chip variant="flat" size="sm" className="bg-kidemia-primary/10 text-kidemia-primary font-medium">
                                                {tag.name}
                                            </Chip>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="max-w-xs truncate">{tag.description || 'No description'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold text-gray-700">
                                            {tag.questions_count || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Button isIconOnly size="sm" variant="light" onPress={() => handleEdit(tag)}>
                                                    <Edit2 className="h-4 w-4 text-gray-600" />
                                                </Button>
                                                <Button isIconOnly size="sm" variant="light" onPress={() => handleDelete(tag.id, tag.name)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {tags.map((tag, index) => (
                            <div key={tag.id} className="p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <Chip variant="flat" size="sm" className="bg-kidemia-primary/10 text-kidemia-primary font-bold">
                                        {tag.name}
                                    </Chip>
                                    <span className="text-xs text-gray-400">
                                        #{(pagination.page - 1) * pagination.pageSize + index + 1}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {tag.description || 'No description'}
                                </p>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                                        Questions: <span className="font-bold">{tag.questions_count || 0}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="flat" onPress={() => handleEdit(tag)}>Edit</Button>
                                        <Button size="sm" variant="flat" color="danger" className='bg-kidemia-secondary text-white' onPress={() => handleDelete(tag.id, tag.name)}>Delete</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {tags.length === 0 && !isLoading && (
                        <div className="px-6 py-12 text-center">
                            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No tags found</p>
                            <Button className="bg-kidemia-secondary text-white" size="sm" onPress={createModal.onOpen}>
                                Create First Tag
                            </Button>
                        </div>
                    )}

                    {/* Pagination - Optimized for Mobile */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200">
                            <p className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                                Showing {(pagination.page - 1) * pagination.pageSize + 1} to {Math.min(pagination.page * pagination.pageSize, totalCount)} of {totalCount}
                            </p>
                            <div className="order-1 sm:order-2">
                                <Pagination
                                    total={totalPages}
                                    page={pagination.page}
                                    onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                                    showControls
                                    size="sm"
                                    radius="sm"
                                    classNames={{ cursor: 'bg-kidemia-secondary text-white' }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Modals */}
            <CreateTagModal isOpen={createModal.isOpen} onClose={createModal.onClose} />
            <EditTagModal isOpen={editModal.isOpen} onClose={editModal.onClose} tag={selectedTag} />
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
                title="Delete Tag"
                message={`Are you sure you want to delete "${deleteTagName}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                isLoading={deleteTag.isPending}
            />
        </>
    );
}