import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMemo, useState } from 'react';
import { ApiSDK } from '../sdk';
import { QueryKeys } from '../utils/queryKeys';
import type { RegisterRequest, RoleResponse, UserListResponse, UserResponse, UserUpdate } from '../sdk/generated';


export const userFiltersAtom = atomWithStorage('user-filters', {
    search: '',
    role: 'all',
    status: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc',
});

export const userPaginationAtom = atomWithStorage('user-pagination', {
    page: 1,
    pageSize: 20,
});


export const useUsers = () => {
    const [filters, setFilters] = useAtom(userFiltersAtom);
    const [pagination, setPagination] = useAtom(userPaginationAtom);

    const query = useQuery<UserListResponse[]>({
        queryKey: [QueryKeys.users, filters, pagination],
        queryFn: () =>
            ApiSDK.UsersService.listUsersMinimalApiV1UsersMinimalGet(
                (pagination.page - 1) * pagination.pageSize,
                pagination.pageSize,
                filters.search || undefined,
                filters.status === 'all'
                    ? undefined
                    : filters.status === 'active',
                filters.role === 'all' ? undefined : filters.role,
                filters.sortBy,
                filters.sortOrder
            ),
        staleTime: 1000 * 60 * 2,
    });

    const users = query.data ?? [];

    return {
        users,
        totalCount: users.length,
        totalPages: users.length < pagination.pageSize
            ? pagination.page
            : pagination.page + 1,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        filters,
        setFilters,
        pagination,
        setPagination,
        refetch: query.refetch,
    };
};




// User Details Hook
export const useUserDetails = (userId: string | null) => {
    const {
        data: userResponse,
        isLoading,
        error,
        refetch,
    } = useQuery<UserResponse>({
        queryKey: [QueryKeys.userDetails, userId],
        queryFn: async () => {
            if (!userId) throw new Error('User ID required');
            return ApiSDK.UsersService.getUserApiV1UsersUserIdGet(
                userId,
            );
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
    });

    const user = useMemo(() => {
        return userResponse ?? null;
    }, [userResponse]);

    return {
        user,
        isLoading,
        error,
        refetch,
    };
};

// Update User Hook
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            userId,
            data,
        }: {
            userId: string;
            data: UserUpdate;
        }) => {
            return ApiSDK.UsersService.updateUserApiV1UsersUserIdPatch(
                userId,
                data,
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.users] });
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.userDetails, variables.userId],
            });
        },
    });
};

// Update User Role Hook
export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            userId,
            roleId,
        }: {
            userId: string;
            roleId: string;
        }) => {
            return ApiSDK.UsersService.addRoleToUserApiV1UsersUserIdRolesRoleIdPost(
                userId,
                roleId
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.users] });
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.userDetails, variables.userId],
            });
        },
    });
};

// Suspend/Activate User Hook
export const useActivateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: string) => {
            return ApiSDK.UsersService.activateUserApiV1UsersUserIdActivatePost(
                userId
            );
        },
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.users] });
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.userDetails, userId],
            });
        },
    });
};


export const useSuspendUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            return ApiSDK.UsersService.deactivateUserApiV1UsersUserIdDeactivatePost(
                userId
            );
        },
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.users] });
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.userDetails, userId],
            });
        },
    });
};


// Delete User Hook
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: string) => {
            return ApiSDK.UsersService.deleteUserApiV1UsersUserIdDelete(
                userId,
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.users] });
        },
    });
};

// Available Roles Hook
export const useAvailableRoles = () => {
    const {
        data: rolesResponse,
        isLoading,
        error,
    } = useQuery<RoleResponse[]>({
        queryKey: [QueryKeys.userRoles],
        queryFn: async () => {
            return ApiSDK.RolesService.listRolesApiV1RolesGet();
        },
        staleTime: 1000 * 60 * 10,
    });

    const roles = useMemo(() => {
        return rolesResponse ?? [];
    }, [rolesResponse]);

    return {
        roles,
        isLoading,
        error,
    };
};

// Get role by name
export const useGetRoleByName = (role: string) => {
    const {
        data: roleResponse,
        isLoading,
        error,
        refetch,
    } = useQuery<RoleResponse>({
        queryKey: [QueryKeys.userDetails, role],
        queryFn: async () => {
            return ApiSDK.RolesService.getRoleByNameApiV1RolesNameNameGet(
                role,
            );
        },
        enabled: !!role,
        staleTime: 1000 * 60 * 2,
    });

    const roleData = useMemo(() => {
        return roleResponse ?? null;
    }, [roleResponse]);

    return {
        roleData,
        isLoading,
        error,
        refetch,
    };

}
// Search Hook with Debounce
export const useUserSearch = () => {
    const [filters, setFilters] = useAtom(userFiltersAtom);
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    const updateSearch = useMemo(() => {
        let timeoutId: NodeJS.Timeout;
        return (value: string) => {
            setDebouncedSearch(value);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setFilters((prev) => ({ ...prev, search: value }));
            }, 300);
        };
    }, [setFilters]);

    return {
        searchTerm: debouncedSearch,
        updateSearch,
    };
};

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: RegisterRequest) => {
            const response = await ApiSDK.AuthenticationService.adminCreateUserApiV1AuthAdminCreateUserPost(data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.users] });
        },
    });
}
