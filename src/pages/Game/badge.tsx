import { useState } from 'react';
import {
    Button,
    Input,
    Select,
    SelectItem,
    useDisclosure,
    Pagination,
} from '@heroui/react';
import { Plus, Search, SlidersHorizontal, Award, Trophy } from 'lucide-react';
import { addToast } from '@heroui/react';
import BallSpinner from '../../components/Spinner/BallSpinner';
import { useBadges, useDeleteBadge } from '../../hooks/useBadges';
import { CreateBadgeModal } from './components/modals/CreateBadgeModal';
import { EditBadgeModal } from './components/modals/EditBadgeModal';
import { DeleteConfirmModal } from '../Content/components/modals/DeleteConfirmModal';

export default function BadgesPage() {
    const [selectedBadge, setSelectedBadge] = useState<any | null>(null);
    const [deleteBadgeId, setDeleteBadgeId] = useState<string>('');
    const [deleteBadgeName, setDeleteBadgeName] = useState<string>('');

    const createModal = useDisclosure();
    const editModal = useDisclosure();
    const deleteModal = useDisclosure();

    const {
        badges,
        totalPages,
        isLoading,
        filters,
        setFilters,
        pagination,
        setPagination,
    } = useBadges();

    const deleteBadge = useDeleteBadge();

    const handleSearchChange = (value: string) => {
        setFilters((prev) => ({ ...prev, search: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleCategoryChange = (value: string) => {
        setFilters((prev) => ({ ...prev, category: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleEdit = (badge: any) => {
        setSelectedBadge(badge);
        editModal.onOpen();
    };

    const handleDelete = (badgeId: string, badgeName: string) => {
        setDeleteBadgeId(badgeId);
        setDeleteBadgeName(badgeName);
        deleteModal.onOpen();
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteBadge.mutateAsync(deleteBadgeId);
            addToast({
                title: 'Success',
                description: 'Badge deleted successfully',
                color: 'success',
            });
            deleteModal.onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to delete badge',
                color: 'danger',
            });
        }
    };

    if (isLoading && !badges) {
        return (
            <div className="h-screen flex items-center justify-center">
                <BallSpinner />
            </div>
        );
    }

    return (
        <>
            <section className="space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-kidemia-primary/10 rounded-lg">
                            <Award className="h-6 w-6 text-kidemia-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                                Badges & Achievements
                            </h1>
                            <p className="text-sm text-gray-600">
                                Manage gamification badges and rewards
                            </p>
                        </div>
                    </div>

                    <Button
                        className="bg-kidemia-secondary text-kidemia-white font-medium w-full sm:w-auto"
                        size="md"
                        radius="sm"
                        startContent={<Plus className="h-4 w-4" />}
                        onPress={createModal.onOpen}
                    >
                        Add Badge
                    </Button>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col lg:flex-row gap-3">
                    <Input
                        placeholder="Search badges..."
                        value={filters.search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        startContent={<Search className="h-5 w-5 text-gray-400" />}
                        variant="flat"
                        size="lg"
                        radius="sm"
                        isClearable
                        onClear={() => handleSearchChange('')}
                        className="w-full"
                        classNames={{
                            inputWrapper: 'bg-gray-50 border-none',
                        }}
                    />

                    <Button
                        variant="flat"
                        size="lg"
                        radius="sm"
                        className="bg-gray-50 w-full sm:w-auto"
                        startContent={<SlidersHorizontal className="h-5 w-5" />}
                    >
                        Filters
                    </Button>

                    <Select
                        placeholder="Category"
                        selectedKeys={[filters.category]}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        variant="flat"
                        size="lg"
                        radius="sm"
                        className="w-full sm:w-60"
                        classNames={{
                            trigger: 'bg-gray-50 border-none',
                        }}
                    >
                        <SelectItem key="all">All Categories</SelectItem>
                        <SelectItem key="achievement">Achievement</SelectItem>
                        <SelectItem key="milestone">Milestone</SelectItem>
                        <SelectItem key="special">Special</SelectItem>
                        <SelectItem key="skill">Skill</SelectItem>
                    </Select>


                </div>



                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {badges.map((badge) => (
                        <div
                            key={badge.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                {/* Icon */}
                                <div className="relative">
                                    {badge.icon_url ? (
                                        <img
                                            src={badge.icon_url}
                                            alt={badge.name}
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-kidemia-secondary flex items-center justify-center">
                                            <Trophy className="h-10 w-10 text-white" />
                                        </div>
                                    )}
                                    {badge.is_active !== false && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                                    )}
                                </div>

                                {/* Info */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        {badge.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {badge.description || 'No description'}
                                    </p>
                                </div>

                                {/* Meta */}


                                {/* Footer */}
                                <div className="flex gap-2 w-full pt-3">
                                    <Button
                                        size="sm"
                                        radius="sm"
                                        className="flex-1 bg-kidemia-secondary text-white"
                                        onPress={() => handleEdit(badge)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        radius="sm"
                                        className="flex-1 bg-pink-100 text-red-600"
                                        onPress={() =>
                                            handleDelete(badge.id, badge.name)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty */}
                {badges.length === 0 && !isLoading && (
                    <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
                        <Award className="h-14 w-14 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">
                            No badges found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Create your first badge to get started
                        </p>
                        <Button
                            className="bg-kidemia-secondary text-white"
                            onPress={createModal.onOpen}
                        >
                            Create Badge
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center py-4">
                        <Pagination
                            total={totalPages}
                            page={pagination.page}
                            onChange={(page) =>
                                setPagination((prev) => ({ ...prev, page }))
                            }
                            showControls
                            radius="sm"
                            classNames={{
                                cursor: 'bg-kidemia-secondary text-white',
                            }}
                        />
                    </div>
                )}
            </section>

            {/* Modals */}
            <CreateBadgeModal
                isOpen={createModal.isOpen}
                onClose={createModal.onClose}
            />
            <EditBadgeModal
                isOpen={editModal.isOpen}
                onClose={editModal.onClose}
                badge={selectedBadge}
            />
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
                title="Delete Badge"
                message={`Are you sure you want to delete "${deleteBadgeName}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                isLoading={deleteBadge.isPending}
            />
        </>
    );
}
