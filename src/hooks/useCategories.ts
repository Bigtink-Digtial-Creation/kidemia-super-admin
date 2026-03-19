import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../utils/queryKeys";
import { ApiSDK } from "../sdk";
import type { CategoryConfigResponse } from "../sdk/generated";
import { addToast } from "@heroui/react";


export const useSubjectCategories = () => {
    return useQuery<CategoryConfigResponse[]>({
        queryKey: [QueryKeys.assessmentCategories],
        queryFn: async () => {
            try {
                const response = await ApiSDK.AssessmentCategoriesService.getCategoryConfigsApiV1CategoriesGet?.();
                return response || [];
            } catch (error) {
                addToast({ title: "error", description: "Failed to load categories" })
                throw error;
            }
        },
        staleTime: 1000 * 60 * 60,
    });
};