import { useState } from 'react';
import { Users, UserPlus, RefreshCw, } from 'lucide-react';


import { useActivateUser, useAvailableRoles, useDeleteUser, useSuspendUser, useUpdateUser, useUpdateUserRole, useUsers } from '../../hooks/useUsers';
import { UserFilters } from './components/users/UserFilters';
import { UserTable } from './components/users/UserTable';
import { Pagination } from './components/users/Pagination';
import { ConfirmDialog } from './components/modals/ConfirmDialog';
import { UserEditModal } from './components/modals/UserEditModal';
import { StatCard } from '../../components/StatCard';
import { addToast } from '@heroui/react';
import type { UserUpdate } from '../../sdk/generated';

// pages/UserManagementPage.tsx
export default function UserManagementPage() {
    const {
        users,
        totalCount,
        totalPages,
        isFetching,
        filters,
        setFilters,
        pagination,
        setPagination,
        refetch,
    } = useUsers();

    const { roles: availableRoles } = useAvailableRoles();
    const updateUser = useUpdateUser();
    const updateUserRole = useUpdateUserRole();
    const activateUser = useActivateUser();
    const suspendUser = useSuspendUser();
    const deleteUser = useDeleteUser();

    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<any>({
        isOpen: false,
        type: null,
        userId: null,
    });

    const handlePageChange = (page: number) =>
        setPagination((p) => ({ ...p, page }));

    const isProcessing =
        activateUser.isPending ||
        suspendUser.isPending ||
        deleteUser.isPending;

    const handleSaveUserAdapter = async (userId: string, data: UserUpdate) => {
        try {
            await updateUser.mutateAsync({ userId, data });
            addToast({ title: "User updated successfully", color: "success" })
        } catch (error) {
            addToast({ title: "Unable to update user now", color: "danger" })

        }
    };

    const handleUpdateRoleAdapter = async (userId: string, roleId: string) => {
        try {
            await updateUserRole.mutateAsync({ userId, roleId });
            addToast({ title: "User role updated successfully", color: "success" })
        } catch (error) {
            addToast({ title: "Unable to update role now", color: "danger" })

        }
    };

    const handleConfirmAction = async () => {
        if (!confirmDialog.userId || !confirmDialog.type) return;

        try {
            if (confirmDialog.type === 'status') {
                if (confirmDialog.currentStatus) {
                    await suspendUser.mutateAsync(confirmDialog.userId);
                    addToast({
                        title: "User suspended successfully",
                        color: "success",
                    });
                } else {
                    await activateUser.mutateAsync(confirmDialog.userId);
                    addToast({
                        title: "User activated successfully",
                        color: "success",
                    });
                }
            }

            if (confirmDialog.type === 'delete') {
                await deleteUser.mutateAsync(confirmDialog.userId);
                addToast({
                    title: "User deleted successfully",
                    color: "success",
                });
            }

            setConfirmDialog({ isOpen: false, type: null, userId: null });
        } catch (error: any) {
            addToast({
                title: error.body?.detail || 'Failed to perform action',
                color: "success",
            });
        }
    };

    const getConfirmDialogProps = () => {
        if (confirmDialog.type === 'status') {
            const isActivating = !confirmDialog.currentStatus;

            return {
                title: isActivating ? 'Activate User' : 'Suspend User',
                message: isActivating
                    ? 'Are you sure you want to activate this user? They will regain access to the platform.'
                    : 'Are you sure you want to suspend this user? They will lose access to the platform.',
                confirmText: isActivating ? 'Activate' : 'Suspend',
                confirmStyle: isActivating
                    ? ('primary' as const)
                    : ('danger' as const),
            };
        }

        return {
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            confirmText: 'Delete',
            confirmStyle: 'danger' as const,
        };
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-kidemia-primary rounded-2xl shadow-lg shadow-kidemia-primary/20">
                                <Users className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                    Users
                                </h1>
                                <p className="text-slate-500 font-medium">
                                    Manage accounts, roles and access
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => refetch()}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
                            >
                                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>

                            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-kidemia-primary text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-kidemia-primary/25">
                                <UserPlus className="h-4 w-4" />
                                <span>Add User</span>
                            </button>
                        </div>
                    </div>

                    {/* STATS: Snap-scroll on mobile, Grid on desktop */}
                    <div className="flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto pb-4 sm:pb-0 snap-x snap-mandatory scrollbar-hide">
                        <StatCard label="Total" value={totalCount} />
                        <StatCard
                            label="Active"
                            value={users.filter(u => u.is_active).length}
                            color="text-emerald-600"
                        />
                        <StatCard
                            label="Suspended"
                            value={users.filter(u => !u.is_active).length}
                            color="text-rose-600"
                        />
                    </div>

                    {/* FILTERS: Wrapped in a container to prevent overflow issues */}
                    <div className="relative w-full overflow-hidden">
                        <UserFilters
                            filters={filters}
                            onFilterChange={(k, v) => {
                                setFilters((p) => ({ ...p, [k]: v }));
                                setPagination((p) => ({ ...p, page: 1 }));
                            }}
                            onClearFilters={() =>
                                setFilters({
                                    search: '',
                                    role: 'all',
                                    status: 'all',
                                    sortBy: 'created_at',
                                    sortOrder: 'desc',
                                })
                            }
                            availableRoles={availableRoles}
                        />
                    </div>
                </div>

                {/* TABLE */}
                <UserTable
                    users={users}
                    isLoading={isFetching}
                    onEditUser={(u) => {
                        setSelectedUser(u);
                        setIsEditModalOpen(true);
                    }}
                    onToggleStatus={(id, status) =>
                        setConfirmDialog({
                            isOpen: true,
                            type: 'status',
                            userId: id,
                            currentStatus: status,
                        })
                    }
                    onDeleteUser={(id) =>
                        setConfirmDialog({ isOpen: true, type: 'delete', userId: id })
                    }
                />

                {!isFetching && users.length > 0 && (
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalCount={totalCount}
                        pageSize={pagination.pageSize}
                    />
                )}
            </div>

            {/* MODALS */}
            <UserEditModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                availableRoles={availableRoles}
                onSave={handleSaveUserAdapter}
                onUpdateRole={handleUpdateRoleAdapter}
            />

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() =>
                    setConfirmDialog({ isOpen: false, type: null, userId: null })
                }
                onConfirm={handleConfirmAction}
                isLoading={isProcessing}
                {...getConfirmDialogProps()}
            />

        </div>
    );
}
