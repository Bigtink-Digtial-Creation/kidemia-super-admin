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
import { Plus, Search, SlidersHorizontal, FolderOpen, Edit2, Trash2 } from 'lucide-react';
import { useAssessmentCategories, useDeleteAssessmentCategory } from '../../../hooks/useAssessmentCategories';
import BallSpinner from '../../../components/Spinner/BallSpinner';
import { CreateAssessmentCategoryModal } from '../components/modals/CreateAssessmentCategoryModal';
import { EditAssessmentCategoryModal } from '../components/modals/EditAssessmentCategoryModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';

export default function AssessmentCategoriesPage() {
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [deleteCategoryId, setDeleteCategoryId] = useState<string>('');
    const [deleteCategoryName, setDeleteCategoryName] = useState<string>('');

    const createModal = useDisclosure();
    const editModal = useDisclosure();
    const deleteModal = useDisclosure();

    const {
        categories,
        totalCount,
        totalPages,
        isLoading,
        filters,
        setFilters,
        pagination,
        setPagination,
    } = useAssessmentCategories();

    const deleteCategory = useDeleteAssessmentCategory();

    const handleSearchChange = (value: string) => {
        setFilters((prev) => ({ ...prev, search: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleEdit = (category: any) => {
        setSelectedCategory(category);
        editModal.onOpen();
    };

    const handleDelete = (categoryId: string, categoryName: string) => {
        setDeleteCategoryId(categoryId);
        setDeleteCategoryName(categoryName);
        deleteModal.onOpen();
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteCategory.mutateAsync(deleteCategoryId);
            addToast({
                title: 'Success',
                description: 'Assessment category deleted successfully',
                color: 'success',
            });
            deleteModal.onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to delete category',
                color: 'danger',
            });
        }
    };

    if (isLoading && !categories) {
        return (
            <div className="h-screen flex items-center justify-center">
                <BallSpinner />
            </div>
        );
    }

    return (
        <>
            <section className="space-y-6 p-4 md:p-6 max-w-[1400px] mx-auto">
                {/* Header - Stacked on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-kidemia-primary/10 rounded-lg shrink-0">
                            <FolderOpen className="h-6 w-6 text-kidemia-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                                Assessment Categories
                            </h1>
                            <p className="text-sm text-gray-600">
                                Organize assessments into categories
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
                        Add Category
                    </Button>
                </div>

                {/* Search and Filters - Grid/Wrap on mobile */}
                <div className="flex flex-col lg:flex-row gap-3">
                    <Input
                        placeholder="Search categories..."
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
                    <div className="flex flex-wrap items-center gap-2">
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

                {/* Stats - Horizontal scroll on very small screens, 3 cols on tablet */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-6">
                        <div className="border-b sm:border-b-0 sm:border-r border-gray-100 pb-4 sm:pb-0">
                            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">Total</p>
                            <p className="text-2xl md:text-3xl font-bold text-kidemia-primary mt-1">{totalCount}</p>
                        </div>
                        <div className="border-b sm:border-b-0 sm:border-r border-gray-100 pb-4 sm:pb-0">
                            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">Active</p>
                            <p className="text-2xl md:text-3xl font-bold text-kidemia-secondary mt-1">
                                {categories.filter((c) => c.is_active !== false).length}
                            </p>
                        </div>
                        {/* <div>
                            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">Assessments</p>
                            <p className="text-2xl md:text-3xl font-bold text-kidemia-secondary mt-1">
                                {categories.reduce((acc, cat) => acc + (cat.assessments_count || 0), 0)}
                            </p>
                        </div> */}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">S/N</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Category Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Description</th>
                                    {/* <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Assessments</th> */}
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {(pagination.page - 1) * pagination.pageSize + index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color_code || '#BF4C20' }} />
                                                <span className="font-semibold text-gray-900">{category.display_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="max-w-xs truncate">{category.description || 'No description'}</div>
                                        </td>
                                        {/* <td className="px-6 py-4 text-center">
                                            <Chip variant="flat" size="sm">{category.assessments_count || 0}</Chip>
                                        </td> */}
                                        <td className="px-6 py-4">
                                            <Chip variant="flat" size="sm" color={category.is_active !== false ? 'success' : 'default'}>
                                                {category.is_active !== false ? 'Active' : 'Inactive'}
                                            </Chip>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Button size="sm" variant="light" isIconOnly onPress={() => handleEdit(category)}>
                                                    <Edit2 className="h-4 w-4 text-gray-600" />
                                                </Button>
                                                <Button size="sm" variant="light" isIconOnly onPress={() => handleDelete(category.id, category.display_name)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {categories.map((category, _) => (
                            <div key={category.id} className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color_code || '#BF4C20' }} />
                                        <span className="font-bold text-gray-900">{category.display_name}</span>
                                    </div>
                                    <Chip size="sm" variant="flat" color={category.is_active !== false ? 'success' : 'default'}>
                                        {category.is_active !== false ? 'Active' : 'Inactive'}
                                    </Chip>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">{category.description || 'No description'}</p>
                                <div className="flex items-center justify-between pt-2">
                                    {/* <div className="text-xs text-gray-500">
                                        Assessments: <span className="font-bold">{category.assessments_count || 0}</span>
                                    </div> */}
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="flat" onPress={() => handleEdit(category)}>Edit</Button>
                                        <Button size="sm" variant="flat" color="danger" className='bg-kidemia-secondary text-white' onPress={() => handleDelete(category.id, category.display_name)}>Delete</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {categories.length === 0 && !isLoading && (
                        <div className="px-6 py-12 text-center">
                            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No categories found</p>
                        </div>
                    )}

                    {/* Pagination - Stacked on mobile */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600 order-2 sm:order-1">
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
                                    classNames={{
                                        cursor: 'bg-kidemia-secondary text-white',
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Modals remain the same */}
            <CreateAssessmentCategoryModal isOpen={createModal.isOpen} onClose={createModal.onClose} />
            <EditAssessmentCategoryModal isOpen={editModal.isOpen} onClose={editModal.onClose} category={selectedCategory} />
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
                title="Delete Assessment Category"
                message={`Are you sure you want to delete "${deleteCategoryName}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                isLoading={deleteCategory.isPending}
            />
        </>
    );
}