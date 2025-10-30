/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeaderboardResponse } from '../models/LeaderboardResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LeaderboardService {
  /**
   * Get assessment leaderboard
   * Get leaderboard for a specific assessment.
   *
   * Shows top performers ranked by:
   * 1. Score (highest first)
   * 2. Time taken (fastest first for ties)
   *
   * If authenticated, includes current user's rank.
   * @param assessmentId
   * @param limit
   * @returns LeaderboardResponse Successful Response
   * @throws ApiError
   */
  public static getAssessmentLeaderboardApiV1LeaderboardAssessmentsAssessmentIdGet(
    assessmentId: string,
    limit: number = 100,
  ): CancelablePromise<LeaderboardResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/leaderboard/assessments/{assessment_id}',
      path: {
        'assessment_id': assessmentId,
      },
      query: {
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get subject leaderboard
   * Get leaderboard for a specific subject.
   *
   * Aggregates performance across all assessments in the subject.
   * Ranks by average score and total points earned.
   * @param subjectId
   * @param limit
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getSubjectLeaderboardApiV1LeaderboardSubjectsSubjectIdGet(
    subjectId: string,
    limit: number = 100,
  ): CancelablePromise<Array<Record<string, any>>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/leaderboard/subjects/{subject_id}',
      path: {
        'subject_id': subjectId,
      },
      query: {
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get user statistics
   * Get comprehensive statistics for a user.
   *
   * Includes:
   * - Total attempts and completions
   * - Pass rate and average score
   * - Recent performance
   * - Subject-wise breakdown
   * @param userId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getUserStatisticsApiV1LeaderboardUsersUserIdStatisticsGet(
    userId: string,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/leaderboard/users/{user_id}/statistics',
      path: {
        'user_id': userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get my statistics
   * Get statistics for the current user.
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getMyStatisticsApiV1LeaderboardMeStatisticsGet(): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/leaderboard/me/statistics',
    });
  }
}
