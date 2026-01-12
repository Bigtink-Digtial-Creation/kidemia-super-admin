import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMemo } from 'react';
import { ApiSDK } from '../sdk';
import { QueryKeys } from '../utils/queryKeys';
import type { PermissionResponse, RoleCreate, RoleResponse, RoleUpdate } from '../sdk/generated';

// Atoms for persistent state
export const roleFiltersAtom = atomWithStorage('role-filters', {
    search: '',
    roleType: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc',
});

export const rolePaginationAtom = atomWithStorage('role-pagination', {
    page: 1,
    pageSize: 20,
});

// Main Roles Hook
export const useRoles = () => {
    const [filters, setFilters] = useAtom(roleFiltersAtom);
    const [pagination, setPagination] = useAtom(rolePaginationAtom);

    const {
        data: rolesResponse,
        isLoading,
        error,
        refetch,
    } = useQuery<RoleResponse[]>({
        queryKey: [QueryKeys.roles, filters, pagination],
        queryFn: async () => {
            return ApiSDK.RolesService.listRolesApiV1RolesGet(
                (pagination.page - 1) * pagination.pageSize,
                pagination.pageSize,
            );
        },
        staleTime: 1000 * 60 * 5,
    });

    const roles = useMemo(() => {
        return rolesResponse || [];
    }, [rolesResponse]);

    const filteredRoles = useMemo(() => {
        let filtered = [...roles];

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(
                (role) =>
                    role.name?.toLowerCase().includes(search) ||
                    role.display_name?.toLowerCase().includes(search) ||
                    role.description?.toLowerCase().includes(search)
            );
        }

        if (filters.roleType !== 'all') {
            filtered = filtered.filter((role) => role.role_type === filters.roleType);
        }

        return filtered;
    }, [roles, filters]);

    const totalCount = filteredRoles.length;
    const totalPages = Math.ceil(totalCount / pagination.pageSize);

    const paginatedRoles = useMemo(() => {
        const start = (pagination.page - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        return filteredRoles.slice(start, end);
    }, [filteredRoles, pagination]);

    return {
        roles: paginatedRoles,
        allRoles: roles,
        totalCount,
        totalPages,
        isLoading,
        error,
        filters,
        setFilters,
        pagination,
        setPagination,
        refetch,
    };
};

// Single Role Hook
export const useRole = (roleId: string | undefined) => {
    const {
        data: roleResponse,
        isLoading,
        error,
        refetch,
    } = useQuery<RoleResponse>({
        queryKey: [QueryKeys.singleRole, roleId],
        queryFn: async () => {
            if (!roleId) throw new Error('Role ID required');
            return ApiSDK.RolesService.getRoleApiV1RolesRoleIdGet(roleId);
        },
        enabled: !!roleId,
        staleTime: 1000 * 60 * 5,
    });

    const role = useMemo(() => {
        return roleResponse ?? null;
    }, [roleResponse]);

    return {
        role,
        isLoading,
        error,
        refetch,
    };
};

// Create Role Hook
export const useCreateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: RoleCreate) => {
            return ApiSDK.RolesService.createRoleApiV1RolesPost(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.roles] });
        },
    });
};

// Update Role Hook
export const useUpdateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ roleId, data }: { roleId: string; data: RoleUpdate }) => {
            return ApiSDK.RolesService.updateRoleApiV1RolesRoleIdPatch(roleId, data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.roles] });
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.singleRole, variables.roleId],
            });
        },
    });
};

// Delete Role Hook
export const useDeleteRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (roleId: string) => {
            return ApiSDK.RolesService.deleteRoleApiV1RolesRoleIdDelete(roleId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.roles] });
        },
    });
};

// Add Permissions to Role Hook
export const useAddPermissionsToRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            roleId,
            permissionIds,
        }: {
            roleId: string;
            permissionIds: string[];
        }) => {
            return ApiSDK.RolesService.assignPermissionsToRoleApiV1RolesRoleIdPermissionsPost(
                roleId,
                { permission_ids: permissionIds }
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.roles] });
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.singleRole, variables.roleId],
            });
        },
    });
};

// Remove Permission from Role Hook
export const useRemovePermissionFromRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            roleId,
            permissionId,
        }: {
            roleId: string;
            permissionId: string;
        }) => {
            return ApiSDK.RolesService.removePermissionFromRoleApiV1RolesRoleIdPermissionsPermissionIdDelete(
                roleId,
                permissionId
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.roles] });
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.singleRole, variables.roleId],
            });
        },
    });
};

// Permissions Hook
export const usePermissions = () => {
    const {
        data: permissionsResponse,
        isLoading,
        error,
    } = useQuery<PermissionResponse[]>({
        queryKey: [QueryKeys.permissions],
        queryFn: async () => {
            return ApiSDK.PermissionsService.listPermissionsApiV1PermissionsGet();
        },
        staleTime: 1000 * 60 * 10,
    });

    const permissions = useMemo(() => {
        return permissionsResponse || [];
    }, [permissionsResponse]);

    return {
        permissions,
        isLoading,
        error,
    };
};

// Role Stats Hook
export const useRoleStats = () => {
    const { allRoles, isLoading } = useRoles();

    const stats = useMemo(() => {
        const systemRoles = allRoles.filter((r) => r.is_system === true);
        const customRoles = allRoles.filter((r) => r.is_system === false);
        const totalPermissions = allRoles.reduce(
            (acc, role) => acc + (role.permissions?.length || 0),
            0
        );

        return {
            total: allRoles.length,
            system: systemRoles.length,
            custom: customRoles.length,
            totalPermissions,
            avgPermissionsPerRole:
                allRoles.length > 0
                    ? Math.round(totalPermissions / allRoles.length)
                    : 0,
        };
    }, [allRoles]);

    return {
        stats,
        isLoading,
    };
};