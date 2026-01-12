/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActivityItem } from '../models/ActivityItem';
import type { DashboardAnalyticsResponse } from '../models/DashboardAnalyticsResponse';
import type { DashboardStatsResponse } from '../models/DashboardStatsResponse';
import type { PerformanceOverview } from '../models/PerformanceOverview';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DashboardService {
  /**
   * Get Dashboard Stats
   * Get dashboard statistics
   *
   * Returns counts for students, subjects, topics, and questions.
   * Optionally filter by category.
   * @param categoryId Filter by category ID
   * @returns DashboardStatsResponse Successful Response
   * @throws ApiError
   */
  public static getDashboardStatsApiV1AdminDashboardStatsGet(
    categoryId?: (string | null),
  ): CancelablePromise<DashboardStatsResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/dashboard/stats',
      query: {
        'category_id': categoryId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Dashboard Analytics
   * Get dashboard analytics data for charts
   *
   * Returns data for exams and tests completion over time.
   * @param categoryId Filter by category ID
   * @param months Number of months to include
   * @returns DashboardAnalyticsResponse Successful Response
   * @throws ApiError
   */
  public static getDashboardAnalyticsApiV1AdminDashboardAnalyticsGet(
    categoryId?: (string | null),
    months: number = 6,
  ): CancelablePromise<DashboardAnalyticsResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/dashboard/analytics',
      query: {
        'category_id': categoryId,
        'months': months,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Recent Activities
   * Get recent platform activities
   *
   * Returns a list of recent user activities on the platform.
   * @param limit Number of activities to return
   * @returns ActivityItem Successful Response
   * @throws ApiError
   */
  public static getRecentActivitiesApiV1AdminDashboardActivitiesGet(
    limit: number = 10,
  ): CancelablePromise<Array<ActivityItem>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/dashboard/activities',
      query: {
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Performance Overview
   * Get overall performance metrics
   *
   * Returns average scores, completion rates, and active student counts.
   * @param categoryId Filter by category ID
   * @returns PerformanceOverview Successful Response
   * @throws ApiError
   */
  public static getPerformanceOverviewApiV1AdminDashboardPerformanceGet(
    categoryId?: (string | null),
  ): CancelablePromise<PerformanceOverview> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/dashboard/performance',
      query: {
        'category_id': categoryId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
