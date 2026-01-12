import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMemo } from 'react';
import { z } from 'zod';
import { ApiSDK } from '../sdk';
import { QueryKeys } from '../utils/queryKeys';
import type {
    CategoryConfigCreate,
    CategoryConfigResponse,
    CategoryConfigUpdate,
} from '../sdk/generated';

// Validation Schema
export const createCategorySchema = z.object({
    category_name: z.string().min(2, 'Name must be at least 2 characters'),
    display_name: z.string().min(2, 'Display name is required'),
    description: z.string().optional().nullable(),
    color_code: z.string().optional().nullable(),
    is_active: z.boolean(),
});

export type CreateCategoryForm = z.infer<typeof createCategorySchema>;

// Atoms
export const assessmentCategoryFiltersAtom = atomWithStorage('assessment-category-filters', {
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc',
});

export const assessmentCategoryPaginationAtom = atomWithStorage('assessment-category-pagination', {
    page: 1,
    pageSize: 10,
});

// Main Hook
export const useAssessmentCategories = () => {
    const [filters, setFilters] = useAtom(assessmentCategoryFiltersAtom);
    const [pagination, setPagination] = useAtom(assessmentCategoryPaginationAtom);

    const {
        data: categoriesResponse,
        isLoading,
        error,
        refetch,
    } = useQuery<CategoryConfigResponse[]>({
        queryKey: [QueryKeys.assessmentCategories, filters, pagination],
        queryFn: async () => {
            return ApiSDK.AssessmentCategoriesService.getCategoryConfigsApiV1CategoriesGet();
        },
        staleTime: 1000 * 60 * 5,
    });

    const categories = useMemo(() => categoriesResponse || [], [categoriesResponse]);

    const filteredCategories = useMemo(() => {
        let filtered = [...categories];

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(
                (cat) =>
                    cat.category_name?.toLowerCase().includes(search) ||
                    cat.description?.toLowerCase().includes(search)
            );
        }
        return filtered;
    }, [categories, filters]);

    const totalCount = filteredCategories.length;
    const totalPages = Math.ceil(totalCount / pagination.pageSize);

    const paginatedCategories = useMemo(() => {
        const start = (pagination.page - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        return filteredCategories.slice(start, end);
    }, [filteredCategories, pagination]);

    return {
        categories: paginatedCategories,
        allCategories: categories,
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

export const useCreateAssessmentCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CategoryConfigCreate) => {
            return ApiSDK.AssessmentCategoriesService.createCategoryConfigApiV1CategoriesPost(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.assessmentCategories] });
        },
    });
};

export const useUpdateAssessmentCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ categoryId, data }: { categoryId: string; data: CategoryConfigUpdate }) => {
            return ApiSDK.AssessmentCategoriesService.updateCategoryConfigApiV1CategoriesConfigIdPut(
                categoryId,
                data
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.assessmentCategories] });
        },
    });
};

export const useDeleteAssessmentCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (categoryId: string) => {
            return ApiSDK.AssessmentCategoriesService.deleteCategoryConfigApiV1CategoriesConfigIdDelete(
                categoryId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.assessmentCategories] });
        },
    });
};