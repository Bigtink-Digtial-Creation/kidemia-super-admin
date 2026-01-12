import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMemo } from 'react';
import { ApiSDK } from '../sdk';
import { QueryKeys } from '../utils/queryKeys';
import type { PlanConfigCreate, PlanConfigResponse, PlanConfigUpdate, PlanFeatureResponse, PromotionCreate, PromotionResponse } from '../sdk/generated';

// Atoms for Plans
export const planFiltersAtom = atomWithStorage('plan-filters', {
  search: '',
  status: 'all',
  sortBy: 'created_at',
  sortOrder: 'desc' as 'asc' | 'desc',
});

export const planPaginationAtom = atomWithStorage('plan-pagination', {
  page: 1,
  pageSize: 10,
});

// Plans Hook
export const usePlans = () => {
  const [filters, setFilters] = useAtom(planFiltersAtom);
  const [pagination, setPagination] = useAtom(planPaginationAtom);

  const {
    data: plansResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<PlanConfigResponse[]>({
    queryKey: [QueryKeys.plans, filters, pagination],
    queryFn: async () => {
      return ApiSDK.AdminPlansService.getAllPlansAdminApiV1AdminManageSubscriptionPlansGet();
    },
    staleTime: 1000 * 60 * 5,
  });

  const plans = useMemo(() => {
    return plansResponse || [];
  }, [plansResponse]);

  const filteredPlans = useMemo(() => {
    let filtered = [...plans];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (plan) =>
          plan.plan_name?.toLowerCase().includes(search) ||
          plan.plan_code?.toLowerCase().includes(search)
      );
    }

    if (filters.status !== 'all') {
      const isActive = filters.status === 'active';
      filtered = filtered.filter((plan) => plan.is_active === isActive);
    }

    return filtered;
  }, [plans, filters]);

  const totalCount = filteredPlans.length;
  const totalPages = Math.ceil(totalCount / pagination.pageSize);

  const paginatedPlans = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredPlans.slice(start, end);
  }, [filteredPlans, pagination]);

  return {
    plans: paginatedPlans,
    allPlans: plans,
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

// Single Plan Hook
export const usePlan = (planId: string | undefined) => {
  const {
    data: planResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<PlanConfigResponse>({
    queryKey: [QueryKeys.singlePlan, planId],
    queryFn: async () => {
      if (!planId) throw new Error('Plan ID required');
      return ApiSDK.AdminPlansService.getPlanByIdApiV1AdminManageSubscriptionPlansPlanPlanIdGet(planId);
    },
    enabled: !!planId,
    staleTime: 1000 * 60 * 5,
  });

  const plan = useMemo(() => {
    return planResponse ?? null;
  }, [planResponse]);

  return {
    plan,
    isLoading,
    error,
    refetch,
  };
};

// Create Plan Hook
export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PlanConfigCreate) => {
      return ApiSDK.AdminPlansService.createPlanApiV1AdminManageSubscriptionPlansPost(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.plans] });
    },
  });
};

// Update Plan Hook
export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      data,
    }: {
      planId: string;
      data: PlanConfigUpdate;
    }) => {
      return ApiSDK.AdminPlansService.updatePlanApiV1AdminManageSubscriptionPlansPlanPlanIdPut(
        planId,
        data
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.plans] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.singlePlan, variables.planId],
      });
    },
  });
};

// Delete Plan Hook
export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      return ApiSDK.AdminPlansService.deletePlanApiV1AdminManageSubscriptionPlansPlanPlanIdDelete(planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.plans] });
    },
  });
};

// feature
export const useFeatures = () => {
  const {
    data: featuresResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<PlanFeatureResponse[]>({
    queryKey: [QueryKeys.features],
    queryFn: async () => {
      return ApiSDK.AdminPlansService.getAllFeaturesApiV1AdminManageSubscriptionPlansFeaturesGet();
    },
    staleTime: 1000 * 60 * 10,
  });

  const features = useMemo(() => {
    return featuresResponse ?? [];
  }, [featuresResponse]);

  return {
    features,
    isLoading,
    error,
    refetch,
  };
};
// Promotions Hook
export const usePromotions = () => {
  const {
    data: promotionsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<PromotionResponse[]>({
    queryKey: [QueryKeys.promotions],
    queryFn: async () => {
      return ApiSDK.AdminPlansService.getActivePromotionsApiV1AdminManageSubscriptionPlansPromotionsGet();
    },
    staleTime: 1000 * 60 * 5,
  });

  const promotions = useMemo(() => {
    return promotionsResponse || [];
  }, [promotionsResponse]);

  return {
    promotions,
    isLoading,
    error,
    refetch,
  };
};

// Create Promotion Hook
export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PromotionCreate) => {
      return ApiSDK.AdminPlansService.createPromotionApiV1AdminManageSubscriptionPlansPromotionsPost(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.promotions] });
    },
  });
};

// Update Promotion Hook
export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      promotionId,
      data,
    }: {
      promotionId: string;
      data: PromotionCreate;
    }) => {
      return ApiSDK.AdminPlansService.updatePromotionApiV1AdminManageSubscriptionPlansPromotionsPromotionIdPut(
        promotionId,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.promotions] });
    },
  });
};

// Delete Promotion Hook
export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotionId: string) => {
      return ApiSDK.AdminPlansService.deletePromotionApiV1AdminManageSubscriptionPlansPromotionsPromotionIdDelete(
        promotionId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.promotions] });
    },
  });
};


export const useTogglePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotionId: string) => {
      return ApiSDK.AdminPlansService
        .togglePromotionStatusApiV1AdminManageSubscriptionPlansPromotionsPromotionIdTogglePatch(
          promotionId
        );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.promotions] });
    },
  });
};