/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ManualGradeRequest } from "../models/ManualGradeRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class GradingService {
  /**
   * Auto-grade an attempt
   * Auto-grade an assessment attempt.
   *
   * - Grades objective questions automatically
   * - Identifies essays requiring manual grading
   * - Calculates scores and pass/fail status
   * @param attemptId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static autoGradeAttemptApiV1GradingAttemptsAttemptIdAutoGradePost(
    attemptId: string,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/grading/attempts/{attempt_id}/auto-grade",
      path: {
        attempt_id: attemptId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Manually grade an answer
   * Manually grade an answer (typically for essays).
   *
   * Requires `grading:manual` permission.
   * @param answerId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static manualGradeAnswerApiV1GradingAnswersAnswerIdManualGradePost(
    answerId: string,
    requestBody: ManualGradeRequest,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/grading/answers/{answer_id}/manual-grade",
      path: {
        answer_id: answerId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Bulk grade multiple answers
   * Bulk grade multiple answers at once.
   *
   * Requires `grading:manual` permission.
   *
   * Expected format:
   * ```json
   * [
   * {
   * "answer_id": "uuid",
   * "points_earned": 8.5,
   * "feedback": "Good work"
   * }
   * ]
   * ```
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static bulkGradeAnswersApiV1GradingAnswersBulkGradePost(
    requestBody: Array<Record<string, any>>,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/grading/answers/bulk-grade",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get attempts pending grading
   * Get list of attempts pending manual grading.
   *
   * Returns attempts with essays or subjective questions awaiting grading.
   * @param skip
   * @param limit
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getPendingGradingApiV1GradingPendingGet(
    skip?: number,
    limit: number = 20,
  ): CancelablePromise<Array<Record<string, any>>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/grading/pending",
      query: {
        skip: skip,
        limit: limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
