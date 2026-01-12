import { useState } from 'react';
import { useNavigate } from 'react-router';
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
import { Plus, Search, SlidersHorizontal, CreditCard, Edit2, Trash2, Percent } from 'lucide-react';
import { useDeletePlan, usePlans } from '../../hooks/usePlans';
import { DeleteConfirmModal } from '../Content/components/modals/DeleteConfirmModal';
import BallSpinner from '../../components/Spinner/BallSpinner';
import { SidebarRoutes } from '../../routes';

export default function PlansPage() {
    const navigate = useNavigate();
    const [deletePlanId, setDeletePlanId] = useState<string>('');
    const [deletePlanName, setDeletePlanName] = useState<string>('');
    const deleteModal = useDisclosure();

    const {
        plans,
        totalCount,
        totalPages,
        isLoading,
        filters,
        setFilters,
        pagination,
        setPagination,
    } = usePlans();

    const deletePlan = useDeletePlan();

    const handleSearchChange = (value: string) => {
        setFilters((prev) => ({ ...prev, search: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleConfirmDelete = async () => {
        try {
            await deletePlan.mutateAsync(deletePlanId);
            addToast({ title: 'Success', description: 'Plan deleted successfully', color: 'success' });
            deleteModal.onClose();
        } catch (error: any) {
            addToast({ title: 'Error', description: error.message || 'Failed to delete plan', color: 'danger' });
        }
    };

    if (isLoading && !plans) {
        return (
            <div className="h-screen flex items-center justify-center">
                <BallSpinner />
            </div>
        );
    }

    return (
        <>
            <section className="space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Left Side: Icon & Titles */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-kidemia-primary/10 rounded-lg shrink-0">
                            <CreditCard className="h-6 w-6 text-kidemia-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Subscription Plans</h1>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                                Manage subscription plans and pricing
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <Button
                            className="bg-kidemia-secondary/70 border-1 border-gray-200 text-white font-medium w-full md:w-auto"
                            radius="sm"
                            variant="bordered"
                            startContent={<Percent className="h-4 w-4" />}
                            onPress={() => navigate(SidebarRoutes.promo)}
                        >
                            Promo Codes
                        </Button>

                        <Button
                            className="bg-kidemia-secondary text-white font-medium w-full md:w-auto"
                            radius="sm"
                            startContent={<Plus className="h-4 w-4" />}
                            onPress={() => navigate(SidebarRoutes.createPlan)}
                        >
                            Add Plan
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <Input
                        placeholder="Search plans..."
                        value={filters.search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        startContent={<Search className="h-5 w-5 text-gray-400" />}
                        variant="flat"
                        size="lg"
                        radius="sm"
                        className="w-full flex-1"
                    />
                    <div className="flex w-full md:w-auto gap-2">
                        <Button variant="flat" size="lg" radius="sm" className="bg-gray-50 flex-1 md:flex-none" startContent={<SlidersHorizontal className="h-5 w-5" />}>
                            Filter
                        </Button>
                        <Select
                            placeholder="Status"
                            selectedKeys={[filters.status]}
                            variant="flat"
                            size="lg"
                            radius="sm"
                            className="w-full md:w-48"
                        >
                            <SelectItem key="all">All Status</SelectItem>
                            <SelectItem key="active">Active</SelectItem>
                            <SelectItem key="inactive">Inactive</SelectItem>
                        </Select>
                    </div>
                </div>

                {/* Desktop View: Original Table */}
                <div className="hidden md:block ">
                    <table className="w-full">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">S/N</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Plan Name</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Plan Code</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Monthly Price</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Quarterly Price</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Yearly Price</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map((plan, index) => (
                                <tr key={plan.id} className={`border-b border-gray-100 ${index % 2 === 1 ? 'bg-pink-50/30' : 'bg-white'}`}>
                                    <td className="px-6 py-6 text-sm">{(pagination.page - 1) * pagination.pageSize + index + 1}</td>
                                    <td className="px-6 py-6">
                                        <div className="font-medium text-gray-900">{plan.plan_name}</div>
                                        <div className="text-xs text-gray-600 truncate max-w-[200px]">{plan.short_description}</div>
                                    </td>
                                    <td className="px-6 py-6"><Chip variant="flat" size="sm" className="font-mono">{plan.plan_code}</Chip></td>
                                    <td className="px-6 py-6 font-semibold">₦{plan.price_monthly?.toLocaleString()}</td>
                                    <td className="px-6 py-6">₦{plan.price_quarterly?.toLocaleString() || 0}</td>
                                    <td className="px-6 py-6"><Chip variant="flat" size="sm" color="primary">₦{plan.price_yearly?.toLocaleString()}</Chip></td>
                                    <td className="px-6 py-6">
                                        <Chip variant="flat" size="sm" color={plan.is_active ? 'success' : 'default'}>
                                            {plan.is_active ? 'Active' : 'Inactive'}
                                        </Chip>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center gap-3 justify-end">
                                            <Button className="bg-kidemia-secondary text-white" size="sm" onPress={() => navigate(SidebarRoutes.editPlan.replace(':id', plan.id))}>
                                                Edit
                                            </Button>
                                            <Button className="bg-pink-100 text-red-600" size="sm" onPress={() => { setDeletePlanId(plan.id); setDeletePlanName(plan.plan_name); deleteModal.onOpen(); }}>
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                    {plans.map((plan) => (
                        <div key={plan.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900">{plan.plan_name}</h3>
                                    <Chip variant="flat" size="sm" className="mt-1 font-mono">{plan.plan_code}</Chip>
                                </div>
                                <Chip size="sm" color={plan.is_active ? 'success' : 'default'}>{plan.is_active ? 'Active' : 'Inactive'}</Chip>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-50">
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Monthly</p>
                                    <p className="text-xs font-bold">₦{plan.price_monthly?.toLocaleString()}</p>
                                </div>
                                <div className="text-center border-x border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Quarterly</p>
                                    <p className="text-xs font-bold">₦{plan.price_quarterly?.toLocaleString() || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Yearly</p>
                                    <p className="text-xs font-bold text-kidemia-primary">₦{plan.price_yearly?.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button className="flex-1 bg-kidemia-secondary text-white" size="sm" onPress={() => navigate(SidebarRoutes.editPlan.replace(':id', plan.id))} startContent={<Edit2 size={14} />}>
                                    Edit
                                </Button>
                                <Button className="flex-1 bg-pink-50 text-red-600" size="sm" onPress={() => { setDeletePlanId(plan.id); setDeletePlanName(plan.plan_name); deleteModal.onOpen(); }} startContent={<Trash2 size={14} />}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col md:flex-row items-center justify-between p-4 border-t border-gray-200 gap-4">
                        <p className="text-sm text-gray-600 text-center">
                            Showing {(pagination.page - 1) * pagination.pageSize + 1} to {Math.min(pagination.page * pagination.pageSize, totalCount)} of {totalCount}
                        </p>
                        <Pagination
                            total={totalPages}
                            page={pagination.page}
                            onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                            size="sm"
                            classNames={{ cursor: 'bg-kidemia-secondary text-white' }}
                        />
                    </div>
                )}
            </section>

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
                title="Delete Plan"
                message={`Are you sure you want to delete "${deletePlanName}"?`}
                onConfirm={handleConfirmDelete}
                isLoading={deletePlan.isPending}
            />
        </>
    );
}