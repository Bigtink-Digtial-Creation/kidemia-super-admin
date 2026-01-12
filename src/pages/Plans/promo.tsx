import { useState } from 'react';
import {
    Button,
    Input,
    Chip,
    useDisclosure,
    addToast,
    Switch,
} from '@heroui/react';
import { Plus, Search, Percent, Calendar } from 'lucide-react';
import { useDeletePromotion, usePromotions, useTogglePromotion } from '../../hooks/usePlans';
import BallSpinner from '../../components/Spinner/BallSpinner';
import { formatDateToDDMMYYYY } from '../../utils';
import { DeleteConfirmModal } from '../Content/components/modals/DeleteConfirmModal';
import { EditPromotionModal } from './components/modals/EditPromotionModal';
import { CreatePromotionModal } from './components/modals/CreatePromotionModal';

export default function PromotionsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPromotion, setSelectedPromotion] = useState<any | null>(null);
    const [deletePromotionId, setDeletePromotionId] = useState<string>('');
    const [deletePromotionCode, setDeletePromotionCode] = useState<string>('');
    const [optimisticStatus, setOptimisticStatus] = useState<Record<string, boolean>>({});
    const [pendingToggle, setPendingToggle] = useState<Record<string, boolean>>({});


    const createModal = useDisclosure();
    const editModal = useDisclosure();
    const deleteModal = useDisclosure();

    const { promotions, isLoading } = usePromotions();
    const deletePromotion = useDeletePromotion();
    const togglePromotion = useTogglePromotion();

    const filteredPromotions = promotions.filter(
        (promo) =>
            promo.promo_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleStatus = async (id: string, currentValue: boolean) => {

        setPendingToggle((prev) => ({
            ...prev,
            [id]: true,
        }));

        setOptimisticStatus((prev) => ({
            ...prev,
            [id]: !currentValue,
        }));
        try {
            await togglePromotion.mutateAsync(id);
            addToast({
                title: 'Status Updated',
                description: 'Promotion status toggled successfully',
                color: 'success',
            });

            setPendingToggle((prev) => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
        } catch (error: any) {

            setOptimisticStatus((prev) => ({
                ...prev,
                [id]: currentValue,
            }));

            setPendingToggle((prev) => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });

            addToast({
                title: 'Error',
                description: error.message || 'Failed to toggle status',
                color: 'danger',
            });
        }
    };

    const handleEdit = (promotion: any) => {
        setSelectedPromotion(promotion);
        editModal.onOpen();
    };

    const handleDelete = (promotionId: string, promotionCode: string) => {
        setDeletePromotionId(promotionId);
        setDeletePromotionCode(promotionCode);
        deleteModal.onOpen();
    };

    const handleConfirmDelete = async () => {
        try {
            await deletePromotion.mutateAsync(deletePromotionId);
            addToast({
                title: 'Success',
                description: 'Promotion deleted successfully',
                color: 'success',
            });
            deleteModal.onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to delete promotion',
                color: 'danger',
            });
        }
    };

    const getPromotionStatus = (promotion: any) => {
        const now = new Date();
        const startDate = new Date(promotion.start_date);
        const endDate = new Date(promotion.end_date);

        if (now < startDate) return { label: 'Upcoming', color: 'warning' };
        if (now > endDate) return { label: 'Expired', color: 'default' };
        if (!promotion.is_active) return { label: 'Inactive', color: 'default' };
        return { label: 'Active', color: 'success' };
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
            <section className="space-y-6 p-4 md:p-6">
                {/* Header - Stacked on mobile, row on desktop */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-kidemia-primary/10 rounded-lg shrink-0">
                            <Percent className="h-6 w-6 text-kidemia-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Promotions</h1>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                                Manage discount codes and promotional offers
                            </p>
                        </div>
                    </div>
                    <Button
                        className="bg-kidemia-secondary text-white font-medium w-full md:w-auto"
                        radius="sm"
                        startContent={<Plus className="h-4 w-4" />}
                        onPress={createModal.onOpen}
                    >
                        Add Promo Code
                    </Button>
                </div>

                {/* Search */}
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search promotions..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        startContent={<Search className="h-5 w-5 text-gray-400" />}
                        variant="flat"
                        size="lg"
                        radius="sm"
                        isClearable
                        className="flex-1"
                    />
                </div>

                {/* Stats - Horizontal scroll on small mobile, grid on desktop */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 overflow-x-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 min-w-[500px] md:min-w-0">
                        <div>
                            <p className="text-xs md:text-sm text-gray-600">Total Promotions</p>
                            <p className="text-xl md:text-3xl font-bold text-kidemia-primary mt-1">{promotions.length}</p>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-gray-600">Active Promotions</p>
                            <p className="text-xl md:text-3xl font-bold text-green-600 mt-1">
                                {promotions.filter((p) => getPromotionStatus(p).label === 'Active').length}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-gray-600">Total Uses</p>
                            <p className="text-xl md:text-3xl font-bold text-blue-600 mt-1">
                                {promotions.reduce((acc, p) => acc + (p.current_uses || 0), 0)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-gray-600">Avg Discount</p>
                            <p className="text-xl md:text-3xl font-bold text-purple-600 mt-1">
                                {promotions.length > 0 ? Math.round(promotions.reduce((acc, p) => acc + (Number(p.discount_value) || 0), 0) / promotions.length) : 0}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile View - Cards (Hidden on Large) */}
                <div className="grid grid-cols-1 gap-4 lg:hidden">
                    {filteredPromotions.map((promotion) => {
                        const status = getPromotionStatus(promotion);
                        return (
                            <div key={promotion.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                                <div className="flex justify-between items-start">
                                    <Chip
                                        variant="flat"
                                        size="sm"
                                        className="font-mono font-bold bg-kidemia-primary/10 text-kidemia-primary"
                                    >
                                        {promotion.promo_code}
                                    </Chip>
                                    <Switch
                                        size="sm"
                                        color="success"
                                        isSelected={
                                            pendingToggle[promotion.id]
                                                ? optimisticStatus[promotion.id]
                                                : promotion.is_active
                                        }
                                        isDisabled={pendingToggle[promotion.id]}
                                        onValueChange={() =>
                                            handleToggleStatus(
                                                promotion.id,
                                                pendingToggle[promotion.id]
                                                    ? optimisticStatus[promotion.id]
                                                    : promotion.is_active
                                            )
                                        }
                                    />

                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{promotion.description || 'No description'}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                                            <Percent className="h-3 w-3" />
                                            {promotion.discount_value}% OFF
                                        </div>
                                        <Chip variant="flat" size="sm" color={status.color as any}>
                                            {status.label}
                                        </Chip>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatDateToDDMMYYYY(promotion.end_date!)}
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => handleEdit(promotion)} className="text-kidemia-secondary font-bold">Edit</button>
                                        <button onClick={() => handleDelete(promotion.id, promotion.promo_code)} className="text-red-500 font-bold">Delete</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Desktop View - Table (Hidden on Mobile) */}
                <div className="hidden lg:block  overflow-hidden">
                    <table className="w-full">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">S/N</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Promo Code</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Discount</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Valid Period</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Usage</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Toggle</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPromotions.map((promotion, index) => {
                                const status = getPromotionStatus(promotion);
                                return (
                                    <tr
                                        key={promotion.id}
                                        className={`border-b border-gray-100 ${index % 2 === 1 ? 'bg-pink-50/30' : 'bg-white'}`}
                                    >
                                        <td className="px-6 py-6 text-sm text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-6">
                                            <Chip variant="flat" size="sm" className="font-mono font-bold bg-kidemia-primary/10 text-kidemia-primary">
                                                {promotion.promo_code}
                                            </Chip>
                                        </td>

                                        <td className="px-6 py-6 text-green-600 font-semibold">{promotion.discount_value}%</td>
                                        <td className="px-6 py-6 text-sm text-gray-900">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span>{formatDateToDDMMYYYY(promotion.start_date)} - {formatDateToDDMMYYYY(promotion.end_date!)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-sm text-gray-900">
                                            {promotion.current_uses || 0} {promotion.max_uses && <span className="text-gray-500"> / {promotion.max_uses}</span>}
                                        </td>
                                        <td className="px-6 py-6">
                                            <Chip variant="flat" size="sm" color={status.color as any}>{status.label}</Chip>
                                        </td>
                                        <td className="px-6 py-6">
                                            <Switch
                                                size="sm"
                                                color="success"
                                                isSelected={
                                                    pendingToggle[promotion.id]
                                                        ? optimisticStatus[promotion.id]
                                                        : promotion.is_active
                                                }
                                                isDisabled={pendingToggle[promotion.id]}
                                                onValueChange={() =>
                                                    handleToggleStatus(
                                                        promotion.id,
                                                        pendingToggle[promotion.id]
                                                            ? optimisticStatus[promotion.id]
                                                            : promotion.is_active
                                                    )
                                                }
                                            />

                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3 justify-end">
                                                <Button className="bg-kidemia-secondary text-white" size="sm" radius="sm" onPress={() => handleEdit(promotion)}>Edit</Button>
                                                <Button className="bg-pink-100 text-red-600" size="sm" radius="sm" onPress={() => handleDelete(promotion.id, promotion.promo_code)}>Delete</Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredPromotions.length === 0 && !isLoading && (
                    <div className="py-12 text-center bg-white rounded-lg border border-dashed border-gray-300">
                        <Percent className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No promotions found</p>
                    </div>
                )}
            </section>

            {/* Modals remain the same */}
            <CreatePromotionModal isOpen={createModal.isOpen} onClose={createModal.onClose} />
            <EditPromotionModal isOpen={editModal.isOpen} onClose={editModal.onClose} promotion={selectedPromotion} />
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
                title="Delete Promotion"
                message={`Are you sure you want to delete promotion code "${deletePromotionCode}"?`}
                onConfirm={handleConfirmDelete}
                isLoading={deletePromotion.isPending}
            />
        </>
    );
}