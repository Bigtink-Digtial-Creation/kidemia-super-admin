import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Button,
    Input,
    Select,
    SelectItem,
    useDisclosure,
    Pagination,
    addToast,
} from '@heroui/react';
import { Plus, Search, SlidersHorizontal, Edit2, Trash2, BookText } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDeleteSubject, useSubjects } from '../../../hooks/useSubjects';
import { useSubjectCategories } from '../../../hooks/useCategories';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { CreateSubjectModal } from '../components/modals/CreateSubjectModal';
import { EditSubjectModal } from '../components/modals/EditSubjectModal';
import { SidebarRoutes } from '../../../routes';

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(
        () => window.innerWidth < breakpoint
    );

    useEffect(() => {
        const onResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [breakpoint]);

    return isMobile;
}

function useDebounce<T>(value: T, delay = 500) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debounced;
}

export default function SubjectsPage() {
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    // UI State (UNCHANGED)
    const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
    const [deleteSubjectId, setDeleteSubjectId] = useState('');
    const [deleteSubjectName, setDeleteSubjectName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearch = useDebounce(searchTerm);

    // Disclosure hooks
    const createModal = useDisclosure();
    const editModal = useDisclosure();
    const deleteModal = useDisclosure();

    // Data Hooks
    const { data: categories = [], isLoading: isLoadingCats } = useSubjectCategories();
    const {
        subjects,
        totalCount,
        totalPages,
        isLoading,
        filters,
        setFilters,
        pagination,
        setPagination,
    } = useSubjects();

    const deleteSubject = useDeleteSubject();


    // Optimized debounced search (NO flicker)
    useEffect(() => {
        setFilters((prev) => ({ ...prev, search: debouncedSearch }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [debouncedSearch]);

    // Cleanup selected subject on modal close
    useEffect(() => {
        if (!editModal.isOpen) {
            setSelectedSubject(null);
        }
    }, [editModal.isOpen]);

    const handleCategoryChange = useCallback((value: string) => {
        setFilters((prev) => ({ ...prev, category: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, []);

    const handleEdit = useCallback((subject: any) => {
        setSelectedSubject(subject);
        editModal.onOpen();
    }, []);

    const handleDelete = useCallback((id: string, name: string) => {
        setDeleteSubjectId(id);
        setDeleteSubjectName(name);
        deleteModal.onOpen();
    }, []);

    const handleConfirmDelete = async () => {
        try {
            await deleteSubject.mutateAsync(deleteSubjectId);
            addToast({ title: 'Success', description: 'Subject deleted', color: 'success' });
            deleteModal.onClose();
        } catch (error: any) {
            addToast({ title: 'Error', description: error.message || 'Failed', color: 'danger' });
        }
    };


    const selectItems = useMemo(
        () => [
            { key: 'all', label: 'All Categories' },
            ...categories.map((c) => ({
                key: String(c.id),
                label: c.display_name,
            })),
        ],
        [categories]
    );

    return (
        <>
            <section className="space-y-6 p-4 md:p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-kidemia-primary/10 rounded-lg shrink-0">
                            <BookText className="h-6 w-6 text-kidemia-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Subjects</h1>
                            <p className="text-sm text-gray-600">
                                Manage subject
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Select
                            items={selectItems}
                            placeholder={isLoadingCats ? 'Loading...' : 'Category:'}
                            selectedKeys={new Set([filters.category || 'all'])}
                            onSelectionChange={(keys) =>
                                handleCategoryChange(Array.from(keys)[0] as string)
                            }
                            variant="flat"
                            className="w-full sm:w-48 md:w-64"
                            classNames={{
                                value: 'text-gray-900',
                                trigger: 'bg-gray-100',
                            }}
                        >
                            {(item) => (
                                <SelectItem key={item.key} textValue={item.label}>
                                    {item.label}
                                </SelectItem>
                            )}
                        </Select>

                        <Button
                            className="bg-kidemia-secondary text-white font-medium"
                            startContent={<Plus className="h-4 w-4" />}
                            onPress={createModal.onOpen}
                        >
                            Add Subject
                        </Button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <Input
                        placeholder="Search subjects by name, code or description..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        startContent={<Search className="h-5 w-5 text-gray-400" />}
                        variant="flat"
                        size="lg"
                        radius="sm"
                        isClearable
                        onClear={() => setSearchTerm('')}
                        className="flex-1"
                        classNames={{ inputWrapper: 'bg-gray-50 border-none' }}
                    />

                    <div className="flex gap-2">
                        <Button
                            variant="flat"
                            size="lg"
                            className="bg-gray-50 text-gray-600"
                            startContent={<SlidersHorizontal className="h-5 w-5" />}
                        >
                            Filter
                        </Button>

                        <Select
                            placeholder="Sort"
                            defaultSelectedKeys={['recent']}
                            variant="flat"
                            size="lg"
                            className="w-40"
                            classNames={{ trigger: 'bg-gray-50 border-none' }}
                        >
                            <SelectItem key="recent">Recent</SelectItem>
                            <SelectItem key="name">Name</SelectItem>
                        </Select>
                    </div>
                </div>


                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

                    {isMobile ? (
                        <div className="block md:hidden">
                            {/* Mobile View */}
                            {isLoading ? (
                                <div className="p-10 text-center text-gray-400">
                                    Loading subjects...
                                </div>
                            ) : subjects.map((subject, index) => (
                                <div
                                    key={subject.id}
                                    className={`p-4 border-b ${index % 2 === 1 ? 'bg-kidemia-biege/20' : 'bg-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor: subject.color_code || '#D1D5DB',
                                            }}
                                        />
                                        <div className='flex gap-2'>
                                            <span className="font-bold text-gray-900">
                                                {subject.name}
                                            </span>

                                            {subject.category && (<span className="inline-flex items-center rounded-full 
                                            bg-kidemia-primary px-2.5 py-0.5 text-xs font-semibold
                                             text-white capitalize">
                                                {subject.category?.display_name}
                                            </span>)}

                                        </div>

                                    </div>

                                    <div className="text-sm text-gray-500 mb-3">
                                        Q: {subject.questions_count || 0} | T:{' '}
                                        {subject.topics_count || 0}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="bg-kidemia-secondary text-white flex-1"
                                            onPress={() =>
                                                navigate(
                                                    SidebarRoutes.singleSubject.replace(
                                                        ':id',
                                                        subject.id
                                                    )
                                                )
                                            }
                                        >
                                            View
                                        </Button>

                                        <Button
                                            size="sm"
                                            isIconOnly
                                            variant="flat"
                                            onPress={() => handleEdit(subject)}
                                        >
                                            <Edit2 size={16} />
                                        </Button>

                                        <Button
                                            size="sm"
                                            isIconOnly
                                            variant="flat"
                                            color="danger"
                                            onPress={() =>
                                                handleDelete(subject.id, subject.name)
                                            }
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <table className="hidden md:table w-full">
                            {/* Desktop Table View */}
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-20">
                                        S/N
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Subject
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                        Questions
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                        Topics
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-10 py-20 text-center text-gray-400"
                                        >
                                            Fetching subjects...
                                        </td>
                                    </tr>
                                ) : subjects.map((subject, index) => (
                                    <tr
                                        key={subject.id}
                                        className={`hover:bg-gray-50 transition-colors ${index % 2 === 1
                                            ? 'bg-kidemia-biege/10'
                                            : 'bg-white'
                                            }`}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {(pagination.page - 1) *
                                                pagination.pageSize +
                                                index +
                                                1}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            subject.color_code || '#D1D5DB',
                                                    }}
                                                />
                                                <span className="text-sm font-medium text-gray-900">
                                                    {subject.name}
                                                </span>
                                            </div>
                                        </td>


                                        <td className="px-6 py-4 text-sm text-center 
                                        ">
                                            <span className='bg-kidemia-primary px-2.5 py-0.5 text-xs font-semibold
                                             text-white capitalize rounded-lg'>
                                                {subject.category?.display_name || "N/A"}

                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-center">
                                            {subject.questions_count || 0}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-center">
                                            {subject.topics_count || 0}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Button
                                                    variant="light"
                                                    size="sm"
                                                    className='bg-kidemia-secondary text-white rounded-xl'
                                                    onPress={() =>
                                                        navigate(
                                                            SidebarRoutes.singleSubject.replace(
                                                                ':id',
                                                                subject.id
                                                            )
                                                        )
                                                    }
                                                >
                                                    View
                                                </Button>

                                                <Button
                                                    isIconOnly
                                                    variant="light"
                                                    size="sm"
                                                    onPress={() => handleEdit(subject)}
                                                >
                                                    <Edit2 size={16} />
                                                </Button>

                                                <Button
                                                    className="bg-red-50 text-red-600"
                                                    size="sm"
                                                    onPress={() =>
                                                        handleDelete(
                                                            subject.id,
                                                            subject.name
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Empty State */}
                    {!isLoading && subjects.length === 0 && (
                        <div className="p-20 text-center text-gray-500">
                            <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <p>No subjects found for "{searchTerm}"</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t bg-gray-50 gap-4">
                            <p className="text-sm text-gray-500">
                                Showing{' '}
                                {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
                                {Math.min(
                                    pagination.page * pagination.pageSize,
                                    totalCount
                                )}{' '}
                                of {totalCount}
                            </p>

                            <Pagination
                                total={totalPages}
                                page={pagination.page}
                                onChange={(page) =>
                                    setPagination((prev) => ({ ...prev, page }))
                                }
                                showControls
                                radius="sm"
                                size="sm"
                                classNames={{
                                    cursor: 'bg-kidemia-secondary text-white',
                                }}
                            />
                        </div>
                    )}
                </div>
            </section >

            {/* Modals */}
            < CreateSubjectModal
                isOpen={createModal.isOpen}
                onClose={createModal.onClose}
            />

            {selectedSubject && (
                <EditSubjectModal
                    isOpen={editModal.isOpen}
                    onClose={editModal.onClose}
                    subject={selectedSubject}
                />
            )
            }

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
                title="Delete Subject"
                message={`Are you sure you want to delete "${deleteSubjectName}"?`}
                onConfirm={handleConfirmDelete}
                isLoading={deleteSubject.isPending}
            />
        </>
    );
}
