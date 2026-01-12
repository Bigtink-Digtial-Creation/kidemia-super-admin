import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMemo } from 'react';
import { ApiSDK } from '../sdk';
import { QueryKeys } from '../utils/queryKeys';
import type { BadgeCreate, BadgeResponse, BadgeUpdate } from '../sdk/generated';

export const badgeFiltersAtom = atomWithStorage('badge-filters', {
    search: '',
    category: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc',
});

export const badgePaginationAtom = atomWithStorage('badge-pagination', {
    page: 1,
    pageSize: 10,
});

// Badges Hook
export const useBadges = () => {
    const [filters, setFilters] = useAtom(badgeFiltersAtom);
    const [pagination, setPagination] = useAtom(badgePaginationAtom);

    const {
        data: badgesResponse,
        isLoading,
        error,
        refetch,
    } = useQuery<BadgeResponse[]>({
        queryKey: [QueryKeys.badges, filters, pagination],
        queryFn: async () => {
            return ApiSDK.AdminGamificationService.getAllBadgesApiV1AdminGamificationBadgesGet();
        },
        staleTime: 1000 * 60 * 5,
    });

    const badges = useMemo(() => {
        return badgesResponse || [];
    }, [badgesResponse]);

    const filteredBadges = useMemo(() => {
        let filtered = [...badges];

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(
                (badge) =>
                    badge.name?.toLowerCase().includes(search) ||
                    badge.description?.toLowerCase().includes(search)
            );
        }

        if (filters.category !== 'all') {
            filtered = filtered.filter((badge) => badge.rarity === filters.category);
        }

        return filtered;
    }, [badges, filters]);

    const totalCount = filteredBadges.length;
    const totalPages = Math.ceil(totalCount / pagination.pageSize);

    const paginatedBadges = useMemo(() => {
        const start = (pagination.page - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        return filteredBadges.slice(start, end);
    }, [filteredBadges, pagination]);

    return {
        badges: paginatedBadges,
        allBadges: badges,
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

// Create Badge Hook
export const useCreateBadge = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: BadgeCreate) => {
            return ApiSDK.AdminGamificationService.createBadgeApiV1AdminGamificationBadgesPost(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.badges] });
        },
    });
};

// Update Badge Hook
export const useUpdateBadge = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ badgeId, data }: { badgeId: string; data: BadgeUpdate }) => {
            return ApiSDK.AdminGamificationService.updateBadgeApiV1AdminGamificationBadgesBadgeIdPut(
                badgeId,
                data
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.badges] });
        },
    });
};

// Delete Badge Hook
export const useDeleteBadge = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (badgeId: string) => {
            return ApiSDK.AdminGamificationService.deleteBadgeApiV1AdminGamificationBadgesBadgeIdDelete(badgeId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.badges] });
        },
    });
};