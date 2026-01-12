import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ApiSDK } from '../sdk';
import { QueryKeys } from '../utils/queryKeys';

// Dashboard Stats Hook
export const useDashboardStats = (categoryId?: string) => {
    const {
        data: statsResponse,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: [QueryKeys.dashboardStats, categoryId],
        queryFn: async () => {
            return ApiSDK.DashboardService.getDashboardStatsApiV1AdminDashboardStatsGet(
                categoryId !== 'all' ? categoryId : undefined,
            );
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });

    const stats = useMemo(() => {
        return statsResponse ?? {
            total_students: 0,
            total_subjects: 0,
            total_topics: 0,
            total_questions: 0,
        };
    }, [statsResponse]);

    return {
        stats,
        isLoading,
        error,
        refetch,
    };
};

// Dashboard Analytics Hook
export const useDashboardAnalytics = (categoryId?: string) => {
    const {
        data: analyticsResponse,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: [QueryKeys.dashboardAnalytics, categoryId],
        queryFn: async () => {
            return ApiSDK.DashboardService.getDashboardAnalyticsApiV1AdminDashboardAnalyticsGet(
                categoryId !== 'all' ? categoryId : undefined,

            );
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const analyticsData = useMemo(() => {
        const data = analyticsResponse;

        if (!data) {
            return {
                examsCategories: [],
                examsSeries: [],
                testsCategories: [],
                testsSeries: [],
            };
        }

        return {
            examsCategories: data.exams_by_month?.categories || [],
            examsSeries: data.exams_by_month?.series || [],
            testsCategories: data.tests_by_month?.categories || [],
            testsSeries: data.tests_by_month?.series || [],
        };
    }, [analyticsResponse]);

    return {
        analyticsData,
        isLoading,
        error,
        refetch,
    };
};

// Combined Dashboard Hook
export const useDashboard = (categoryId?: string) => {
    const {
        stats,
        isLoading: statsLoading,
        error: statsError,
        refetch: refetchStats,
    } = useDashboardStats(categoryId);

    const {
        analyticsData,
        isLoading: analyticsLoading,
        error: analyticsError,
        refetch: refetchAnalytics,
    } = useDashboardAnalytics(categoryId);

    return {
        stats,
        analyticsData,
        isLoading: statsLoading || analyticsLoading,
        error: statsError || analyticsError,
        refetch: () => {
            refetchStats();
            refetchAnalytics();
        },
    };
};