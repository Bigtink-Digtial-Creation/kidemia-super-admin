/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttemptListResponse } from '../models/AttemptListResponse';
import type { AttemptProgressResponse } from '../models/AttemptProgressResponse';
import type { AttemptResultResponse } from '../models/AttemptResultResponse';
import type { AttemptStartRequest } from '../models/AttemptStartRequest';
import type { AttemptStartResponse } from '../models/AttemptStartResponse';
import type { SaveAnswerRequest } from '../models/SaveAnswerRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AttemptsService {
  /**
   * Start an assessment attempt
   * Start a new assessment attempt.
   *
   * - Validates assessment availability
   * - Checks attempt limits
   * - Verifies payment for exams
   * - Creates or resumes attempt
   * @param assessmentId
   * @param requestBody
   * @returns AttemptStartResponse Successful Response
   * @throws ApiError
   */
  public static startAttemptApiV1AttemptsAssessmentIdStartPost(
    assessmentId: string,
    requestBody: AttemptStartRequest,
  ): CancelablePromise<AttemptStartResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/attempts/{assessment_id}/start',
      path: {
        'assessment_id': assessmentId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Save an answer
   * Save or update an answer for a question.
   *
   * - Can be called multiple times for the same question
   * - Tracks time spent and edit count
   * - Supports flagging for review
   * @param attemptId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static saveAnswerApiV1AttemptsAttemptIdAnswerPost(
    attemptId: string,
    requestBody: SaveAnswerRequest,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/attempts/{attempt_id}/answer',
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
   * Submit an attempt
   * Submit an assessment attempt for grading.
   *
   * - Auto-grades objective questions
   * - Marks essays for manual grading
   * - Calculates scores and ranking
   * - Updates assessment statistics
   * @param attemptId
   * @returns AttemptResultResponse Successful Response
   * @throws ApiError
   */
  public static submitAttemptApiV1AttemptsAttemptIdSubmitPost(
    attemptId: string,
  ): CancelablePromise<AttemptResultResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/attempts/{attempt_id}/submit',
      path: {
        'attempt_id': attemptId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get attempt progress
   * Get current progress of an ongoing attempt.
   *
   * Returns:
   * - Time spent and remaining
   * - Questions answered/unanswered
   * - Flagged questions count
   * - Submission eligibility
   * @param attemptId
   * @returns AttemptProgressResponse Successful Response
   * @throws ApiError
   */
  public static getAttemptProgressApiV1AttemptsAttemptIdProgressGet(
    attemptId: string,
  ): CancelablePromise<AttemptProgressResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/attempts/{attempt_id}/progress',
      path: {
        'attempt_id': attemptId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get attempt result
   * Get result of a completed attempt.
   *
   * - **include_answers**: Include detailed answer breakdown with correct answers
   * @param attemptId
   * @param includeAnswers
   * @returns AttemptResultResponse Successful Response
   * @throws ApiError
   */
  public static getAttemptResultApiV1AttemptsAttemptIdResultGet(
    attemptId: string,
    includeAnswers: boolean = false,
  ): CancelablePromise<AttemptResultResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/attempts/{attempt_id}/result',
      path: {
        'attempt_id': attemptId,
      },
      query: {
        'include_answers': includeAnswers,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get my attempts
   * Get all attempts for the current user.
   * @param skip
   * @param limit
   * @returns AttemptListResponse Successful Response
   * @throws ApiError
   */
  public static getMyAttemptsApiV1AttemptsMyAttemptsGet(
    skip?: number,
    limit: number = 20,
  ): CancelablePromise<AttemptListResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/attempts/my-attempts',
      query: {
        'skip': skip,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete attempts
   * Delete attempt for the current user.
   * This is for development purpose only
   * @param attemptId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteAttemptsApiV1AttemptsDeleteAttemptGet(
    attemptId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/attempts/delete-attempt',
      query: {
        'attempt_id': attemptId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
