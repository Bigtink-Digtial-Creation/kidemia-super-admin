/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerCorrectionResponse } from '../models/AnswerCorrectionResponse';
import type { AttemptListResponse } from '../models/AttemptListResponse';
import type { AttemptProgressResponse } from '../models/AttemptProgressResponse';
import type { AttemptResponse } from '../models/AttemptResponse';
import type { AttemptResultResponse } from '../models/AttemptResultResponse';
import type { AttemptStartRequest } from '../models/AttemptStartRequest';
import type { AttemptStartResponse } from '../models/AttemptStartResponse';
import type { AttemptStatus } from '../models/AttemptStatus';
import type { SaveAnswerRequest } from '../models/SaveAnswerRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AttemptsService {
  /**
   * Start a test assessment attempt
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
  public static startTestAttemptApiV1AttemptsTestAssessmentIdStartPost(
    assessmentId: string,
    requestBody: AttemptStartRequest,
  ): CancelablePromise<AttemptStartResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/attempts/test/{assessment_id}/start',
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
   * Start an assessment attempt
   * Start a new Exam assessment attempt.
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
  public static startExamAttemptApiV1AttemptsExamAssessmentIdStartPost(
    assessmentId: string,
    requestBody: AttemptStartRequest,
  ): CancelablePromise<AttemptStartResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/attempts/exam/{assessment_id}/start',
      path: {
        'assessment_id': assessmentId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        402: `Subscribe or upgrade to continue using this feature`,
        403: `Feature is not available in current plan`,
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
   * Get attempt correction
   * @param attemptId
   * @returns AnswerCorrectionResponse Successful Response
   * @throws ApiError
   */
  public static getCorrectionApiV1AttemptsAttemptIdCorrectionGet(
    attemptId: string,
  ): CancelablePromise<AnswerCorrectionResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/attempts/{attempt_id}/correction',
      path: {
        'attempt_id': attemptId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get attempt details
   * Get attempt details for the current user.
   * @param attemptId
   * @returns AttemptResponse Successful Response
   * @throws ApiError
   */
  public static getSingleAttemptApiV1AttemptsAttemptIdAttemptGet(
    attemptId: string,
  ): CancelablePromise<AttemptResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/attempts/{attempt_id}/attempt',
      path: {
        'attempt_id': attemptId,
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
   * Get Assessment Attempts
   * Get all attempts for a specific assessment.
   *
   * Requires `attempt:read` permission.
   * @param assessmentId
   * @param status Filter by status
   * @param skip
   * @param limit
   * @returns AttemptResponse Successful Response
   * @throws ApiError
   */
  public static getAssessmentAttemptsApiV1AttemptsAssessmentAssessmentIdGet(
    assessmentId: string,
    status?: (AttemptStatus | null),
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<Array<AttemptResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/attempts/assessment/{assessment_id}',
      path: {
        'assessment_id': assessmentId,
      },
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
   * Log Proctoring Violation
   * Log a proctoring violation
   * @param attemptId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static logProctoringViolationApiV1AttemptsAttemptsAttemptIdViolationPost(
    attemptId: string,
    requestBody: Record<string, any>,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/attempts/attempts/{attempt_id}/violation',
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
   * Get Attempt Detail
   * Get detailed attempt information including proctoring violations.
   *
   * Users can view their own attempt details without special permissions.
   * Viewing others' attempts requires `attempt:read` permission.
   *
   * Returns:
   * - Complete attempt information
   * - User details
   * - Assessment configuration
   * - Proctoring violations (if enabled)
   * - Violation summary by type
   * @param attemptId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getAttemptDetailApiV1AttemptsAttemptIdDetailGet(
    attemptId: string,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/attempts/{attempt_id}/detail',
      path: {
        'attempt_id': attemptId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete attempts
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
