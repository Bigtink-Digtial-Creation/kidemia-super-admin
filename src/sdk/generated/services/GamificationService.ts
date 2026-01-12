/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GamificationProfileResponse } from '../models/GamificationProfileResponse';
import type { src__domains__gamification__schemas__schemas__LeaderboardResponse } from '../models/src__domains__gamification__schemas__schemas__LeaderboardResponse';
import type { StudentAchievementResponse } from '../models/StudentAchievementResponse';
import type { StudentBadgeResponse } from '../models/StudentBadgeResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GamificationService {
  /**
   * Get My Gamification Profile
   * Get current student's gamification profile
   * @returns GamificationProfileResponse Successful Response
   * @throws ApiError
   */
  public static getMyGamificationProfileApiV1GamificationProfileGet(): CancelablePromise<GamificationProfileResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/gamification/profile',
    });
  }
  /**
   * Get Student Gamification Profile
   * Get a specific student's gamification profile (public view)
   * @param studentId
   * @returns GamificationProfileResponse Successful Response
   * @throws ApiError
   */
  public static getStudentGamificationProfileApiV1GamificationProfileStudentIdGet(
    studentId: string,
  ): CancelablePromise<GamificationProfileResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/gamification/profile/{student_id}',
      path: {
        'student_id': studentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get My Badges
   * Get current student's earned badges
   * @returns StudentBadgeResponse Successful Response
   * @throws ApiError
   */
  public static getMyBadgesApiV1GamificationBadgesMineGet(): CancelablePromise<Array<StudentBadgeResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/gamification/badges/mine',
    });
  }
  /**
   * Get My Achievements
   * Get current student's achievements with progress
   * @returns StudentAchievementResponse Successful Response
   * @throws ApiError
   */
  public static getMyAchievementsApiV1GamificationAchievementsMineGet(): CancelablePromise<Array<StudentAchievementResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/gamification/achievements/mine',
    });
  }
  /**
   * Get Leaderboard
   * Get leaderboard with optional filters
   * @param limit
   * @param offset
   * @param categoryId
   * @param institutionId
   * @returns src__domains__gamification__schemas__schemas__LeaderboardResponse Successful Response
   * @throws ApiError
   */
  public static getLeaderboardApiV1GamificationLeaderboardGet(
    limit: number = 100,
    offset?: number,
    categoryId?: (string | null),
    institutionId?: (string | null),
  ): CancelablePromise<src__domains__gamification__schemas__schemas__LeaderboardResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/gamification/leaderboard',
      query: {
        'limit': limit,
        'offset': offset,
        'category_id': categoryId,
        'institution_id': institutionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get My Rank
   * Get current student's leaderboard rank
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getMyRankApiV1GamificationLeaderboardMyRankGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/gamification/leaderboard/my-rank',
    });
  }
  /**
   * Get Gamification Summary
   * Get a summary of student's gamification stats
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getGamificationSummaryApiV1GamificationStatsSummaryGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/gamification/stats/summary',
    });
  }
}
