import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMemo } from 'react';
import { ApiSDK } from '../sdk';
import { QueryKeys } from '../utils/queryKeys';
import { z } from 'zod';
import type { QuestionTagCreate, QuestionTagResponse, QuestionTagUpdate } from '../sdk/generated';

export const tagFiltersAtom = atomWithStorage('tag-filters', {
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc',
});

export const tagPaginationAtom = atomWithStorage('tag-pagination', {
    page: 1,
    pageSize: 10,
});

export const createTagSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    is_active: z.boolean(),
});

// 2. Derive the type directly from the schema
export type CreateTagForm = z.infer<typeof createTagSchema>;

// Tags Hook
export const useTags = () => {
    const [filters, setFilters] = useAtom(tagFiltersAtom);
    const [pagination, setPagination] = useAtom(tagPaginationAtom);

    const {
        data: tagsResponse,
        isLoading,
        error,
        refetch,
    } = useQuery<QuestionTagResponse[]>({
        queryKey: [QueryKeys.tags, filters, pagination],
        queryFn: async () => {
            return ApiSDK.TagsService.getTagsApiV1TagsGet();
        },
        staleTime: 1000 * 60 * 5,
    });

    const tags = useMemo(() => {
        return tagsResponse || [];
    }, [tagsResponse]);

    const filteredTags = useMemo(() => {
        let filtered = [...tags];

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(
                (tag) =>
                    tag.name?.toLowerCase().includes(search) ||
                    tag.description?.toLowerCase().includes(search)
            );
        }

        return filtered;
    }, [tags, filters]);

    const totalCount = filteredTags.length;
    const totalPages = Math.ceil(totalCount / pagination.pageSize);

    const paginatedTags = useMemo(() => {
        const start = (pagination.page - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        return filteredTags.slice(start, end);
    }, [filteredTags, pagination]);

    return {
        tags: paginatedTags,
        allTags: tags,
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

// Create Tag Hook
export const useCreateTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: QuestionTagCreate) => {
            return ApiSDK.TagsService.createTagApiV1TagsPost(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.tags] });
        },
    });
};

// Update Tag Hook
export const useUpdateTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ tagId, data }: { tagId: string; data: QuestionTagUpdate }) => {
            return ApiSDK.TagsService.updateTagApiV1TagsTagIdPut(tagId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.tags] });
        },
    });
};

// Delete Tag Hook
export const useDeleteTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tagId: string) => {
            return ApiSDK.TagsService.deleteTagApiV1TagsTagIdDelete(tagId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.tags] });
        },
    });
};