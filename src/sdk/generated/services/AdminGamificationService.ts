/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AchievementCreate } from '../models/AchievementCreate';
import type { AchievementResponse } from '../models/AchievementResponse';
import type { AchievementUpdate } from '../models/AchievementUpdate';
import type { BadgeCreate } from '../models/BadgeCreate';
import type { BadgeResponse } from '../models/BadgeResponse';
import type { BadgeUpdate } from '../models/BadgeUpdate';
import type { StudentAchievementResponse } from '../models/StudentAchievementResponse';
import type { StudentBadgeResponse } from '../models/StudentBadgeResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminGamificationService {
  /**
   * Get All Badges
   * Get all available badges
   * @returns BadgeResponse Successful Response
   * @throws ApiError
   */
  public static getAllBadgesApiV1AdminGamificationBadgesGet(): CancelablePromise<Array<BadgeResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/gamification/badges',
    });
  }
  /**
   * Create Badge
   * Create a new badge
   * @param requestBody
   * @returns BadgeResponse Successful Response
   * @throws ApiError
   */
  public static createBadgeApiV1AdminGamificationBadgesPost(
    requestBody: BadgeCreate,
  ): CancelablePromise<BadgeResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/admin/gamification/badges',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Student Badges
   * Get a specific student's earned badges
   * @param studentId
   * @returns StudentBadgeResponse Successful Response
   * @throws ApiError
   */
  public static getStudentBadgesApiV1AdminGamificationBadgesStudentIdGet(
    studentId: string,
  ): CancelablePromise<Array<StudentBadgeResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/gamification/badges/{student_id}',
      path: {
        'student_id': studentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Badge
   * Update an existing badge
   * @param badgeId
   * @param requestBody
   * @returns BadgeResponse Successful Response
   * @throws ApiError
   */
  public static updateBadgeApiV1AdminGamificationBadgesBadgeIdPut(
    badgeId: string,
    requestBody: BadgeUpdate,
  ): CancelablePromise<BadgeResponse> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/admin/gamification/badges/{badge_id}',
      path: {
        'badge_id': badgeId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Badge
   * Soft delete a badge (deactivate)
   * @param badgeId
   * @returns void
   * @throws ApiError
   */
  public static deleteBadgeApiV1AdminGamificationBadgesBadgeIdDelete(
    badgeId: string,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/admin/gamification/badges/{badge_id}',
      path: {
        'badge_id': badgeId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get All Achievements
   * Get all available achievements
   * @returns AchievementResponse Successful Response
   * @throws ApiError
   */
  public static getAllAchievementsApiV1AdminGamificationAchievementsGet(): CancelablePromise<Array<AchievementResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/gamification/achievements',
    });
  }
  /**
   * Create Achievement
   * Create a new achievement
   * @param requestBody
   * @returns AchievementResponse Successful Response
   * @throws ApiError
   */
  public static createAchievementApiV1AdminGamificationAchievementsPost(
    requestBody: AchievementCreate,
  ): CancelablePromise<AchievementResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/admin/gamification/achievements',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Student Achievements
   * Get a specific student's achievements with progress
   * @param studentId
   * @returns StudentAchievementResponse Successful Response
   * @throws ApiError
   */
  public static getStudentAchievementsApiV1AdminGamificationAchievementsStudentIdGet(
    studentId: string,
  ): CancelablePromise<Array<StudentAchievementResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/gamification/achievements/{student_id}',
      path: {
        'student_id': studentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Achievement
   * Update an existing achievement
   * @param achievementId
   * @param requestBody
   * @returns AchievementResponse Successful Response
   * @throws ApiError
   */
  public static updateAchievementApiV1AdminGamificationAchievementsAchievementIdPut(
    achievementId: string,
    requestBody: AchievementUpdate,
  ): CancelablePromise<AchievementResponse> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/admin/gamification/achievements/{achievement_id}',
      path: {
        'achievement_id': achievementId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Achievement
   * Soft delete an achievement (deactivate)
   * @param achievementId
   * @returns void
   * @throws ApiError
   */
  public static deleteAchievementApiV1AdminGamificationAchievementsAchievementIdDelete(
    achievementId: string,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/admin/gamification/achievements/{achievement_id}',
      path: {
        'achievement_id': achievementId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Refresh Leaderboard
   * Manually refresh leaderboard positions
   * @returns any Successful Response
   * @throws ApiError
   */
  public static refreshLeaderboardApiV1AdminGamificationLeaderboardRefreshPost(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/admin/gamification/leaderboard/refresh',
    });
  }
}
