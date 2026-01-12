import { useState, useCallback } from 'react';
import {
    Breadcrumbs,
    BreadcrumbItem,
    Button,
    useDisclosure,
    Pagination,
    Tooltip,
} from '@heroui/react';
import { MdOutlineDashboard, MdRefresh } from 'react-icons/md';
import { Shield, Plus, LayoutGrid, List, SearchX } from 'lucide-react';
import { useNavigate } from 'react-router';

// Internal Imports
import { StatCard } from '../../components/StatCard';
import BallSpinner from '../../components/Spinner/BallSpinner';
import { SidebarRoutes } from '../../routes';
import { useRoles, useRoleStats } from '../../hooks/useRoles';

// Page Components
import { RoleFilters } from './components/RoleFilters';
import { RoleCard } from './components/RoleCard';
import { RoleTable } from './components/RoleTable';
import { CreateRoleModal } from './components/modals/CreateRoleModal';
import { UpdateRoleModal } from './components/modals/UpdateRoleModal';
import { DeleteRoleModal } from './components/modals/DeleteRoleModal';

export default function RolesPage() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [selectedRole, setSelectedRole] = useState<any | null>(null);
    const [deleteInfo, setDeleteInfo] = useState({ id: '', name: '' });

    const createModal = useDisclosure();
    const updateModal = useDisclosure();
    const deleteModal = useDisclosure();

    const {
        roles,
        totalPages,
        isLoading,
        filters,
        setFilters,
        pagination,
        setPagination,
        refetch,
    } = useRoles();

    const { stats } = useRoleStats();

    // Handlers
    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [setFilters, setPagination]);

    const handleClearFilters = () => {
        setFilters({
            search: '',
            roleType: 'all',
            sortBy: 'created_at',
            sortOrder: 'desc',
        });
    };

    const handleEdit = (role: any) => {
        setSelectedRole(role);
        updateModal.onOpen();
    };

    const handleDelete = (roleId: string, roleName: string) => {
        setDeleteInfo({ id: roleId, name: roleName });
        deleteModal.onOpen();
    };

    const handleViewDetails = (roleId: string) => {
        navigate(SidebarRoutes.singleRole.replace(":id", roleId));
    };

    // Full screen loader for initial fetch
    if (isLoading && (!roles || roles.length === 0)) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
                <BallSpinner />
                <p className="text-gray-500 animate-pulse">Loading roles...</p>
            </div>
        );
    }

    return (
        <>
            <section className="space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Breadcrumbs className="hidden md:block" variant="light">
                        <BreadcrumbItem
                            href={SidebarRoutes.dashboard}
                            startContent={<MdOutlineDashboard />}
                        >
                            Dashboard
                        </BreadcrumbItem>
                        <BreadcrumbItem startContent={<Shield className="w-4 h-4" />} color="warning">
                            Roles & Permissions
                        </BreadcrumbItem>
                    </Breadcrumbs>

                    <div className="flex items-center gap-2">
                        <Tooltip content="Refresh Data">
                            <Button
                                isIconOnly
                                variant="flat"
                                onPress={() => refetch()}
                                isLoading={isLoading}
                                className="bg-white border border-gray-200"
                            >
                                <MdRefresh className="text-xl" />
                            </Button>
                        </Tooltip>

                        <Button
                            color="warning"
                            className="bg-kidemia-primary text-white border-none font-semibold shadow-sm"
                            startContent={<Plus className="h-4 w-4" />}
                            onPress={createModal.onOpen}
                        >
                            Create Role
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Roles" value={stats?.total || 0} />
                    <StatCard label="System Roles" value={stats?.system || 0} />
                    <StatCard label="Custom Roles" value={stats?.custom || 0} />
                    <StatCard label="Avg Permissions" value={stats?.avgPermissionsPerRole || 0} />
                </div>

                {/* Filters and View Toggle */}
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex-1 w-full">
                        <RoleFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                        />
                    </div>
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg self-end lg:self-center">
                        <Button
                            isIconOnly
                            variant={viewMode === 'grid' ? 'solid' : 'light'}
                            color={viewMode === 'grid' ? 'warning' : 'default'}
                            className={viewMode === 'grid' ? 'bg-white shadow-sm' : ''}
                            onPress={() => setViewMode('grid')}
                            size="sm"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            isIconOnly
                            variant={viewMode === 'table' ? 'solid' : 'light'}
                            color={viewMode === 'table' ? 'warning' : 'default'}
                            className={viewMode === 'table' ? 'bg-white shadow-sm' : ''}
                            onPress={() => setViewMode('table')}
                            size="sm"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {roles.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {roles.map((role) => (
                                    <RoleCard
                                        key={role.id}
                                        role={role}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        ) : (
                            <RoleTable
                                roles={roles}
                                isLoading={isLoading}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onViewDetails={handleViewDetails}
                            />
                        )
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                            <SearchX className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">No roles found</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mb-6">
                                We couldn't find any roles matching your current filters.
                            </p>
                            <Button
                                variant="flat"
                                color="warning"
                                onPress={handleClearFilters}
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col items-center gap-3 py-6 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                            Showing page {pagination.page} of {totalPages}
                        </p>
                        <Pagination
                            total={totalPages}
                            page={pagination.page}
                            onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                            showControls
                            radius="full"
                            classNames={{
                                cursor: 'bg-kidemia-secondary text-white font-bold',
                            }}
                        />
                    </div>
                )}
            </section>

            {/* Modals */}
            <CreateRoleModal
                isOpen={createModal.isOpen}
                onClose={createModal.onClose}
            />

            <UpdateRoleModal
                isOpen={updateModal.isOpen}
                onClose={() => {
                    updateModal.onClose();
                    setSelectedRole(null);
                }}
                role={selectedRole}
            />

            <DeleteRoleModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
                roleId={deleteInfo.id}
                roleName={deleteInfo.name}
            />
        </>
    );
}