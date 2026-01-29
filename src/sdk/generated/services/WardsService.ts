/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WardsService {
  /**
   * Get My Assignments
   * Get all assignments for the current ward (student)
   * @param status
   * @param skip
   * @param limit
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getMyAssignmentsApiV1WardsAssignmentsGet(
    status?: (string | null),
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/wards/assignments',
      query: {
        'status': status,
        'skip': skip,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Assignment Detail
   * Get detailed information about a specific assignment
   * @param assignmentId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getAssignmentDetailApiV1WardsAssignmentsAssignmentIdGet(
    assignmentId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/wards/assignments/{assignment_id}',
      path: {
        'assignment_id': assignmentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Assessment Config
   * Get assessment configuration for pre-check screen
   * @param assessmentId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getAssessmentConfigApiV1WardsAssessmentsAssessmentIdConfigGet(
    assessmentId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/wards/assessments/{assessment_id}/config',
      path: {
        'assessment_id': assessmentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Log Proctoring Violation
   * Log a proctoring violation
   * @param attemptId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static logProctoringViolationApiV1WardsAttemptsAttemptIdViolationPost(
    attemptId: string,
    requestBody: Record<string, any>,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/wards/attempts/{attempt_id}/violation',
      path: {
        'attempt_id': attemptId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Auto Submit Attempt
   * @param attemptId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static autoSubmitAttemptApiV1WardsAttemptsAttemptIdAutoSubmitPost(
    attemptId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/wards/attempts/{attempt_id}/auto-submit',
      path: {
        'attempt_id': attemptId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Ward Dashboard Stats
   * Get ward dashboard statistics
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getWardDashboardStatsApiV1WardsDashboardStatsGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/wards/dashboard/stats',
    });
  }
}
