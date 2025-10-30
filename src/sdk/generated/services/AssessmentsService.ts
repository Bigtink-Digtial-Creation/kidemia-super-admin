/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentCategory } from '../models/AssessmentCategory';
import type { AssessmentCreate } from '../models/AssessmentCreate';
import type { AssessmentListResponse } from '../models/AssessmentListResponse';
import type { AssessmentResponse } from '../models/AssessmentResponse';
import type { AssessmentStatistics } from '../models/AssessmentStatistics';
import type { AssessmentStatus } from '../models/AssessmentStatus';
import type { AssessmentSummaryResponse } from '../models/AssessmentSummaryResponse';
import type { AssessmentType } from '../models/AssessmentType';
import type { AssessmentUpdate } from '../models/AssessmentUpdate';
import type { AutoAssessmentRequest } from '../models/AutoAssessmentRequest';
import type { AutoAssessmentResponse } from '../models/AutoAssessmentResponse';
import type { MessageResponse } from '../models/MessageResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AssessmentsService {
  /**
   * Create a new assessment
   * Create a new assessment (test or exam).
   *
   * Requires `assessment:create` permission.
   *
   * - **assessment_type**: TEST (free) or EXAM (paid)
   * - **category**: JAMB, WAEC, NECO, Common Entrance, etc.
   * - **question_selection_mode**: MANUAL, RANDOM, or ADAPTIVE
   * @param requestBody
   * @returns AssessmentResponse Successful Response
   * @throws ApiError
   */
  public static createAssessmentApiV1AssessmentsPost(
    requestBody: AssessmentCreate,
  ): CancelablePromise<AssessmentResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/assessments/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get all assessments
   * Get assessments with filters.
   *
   * - **assessment_type**: Filter by TEST or EXAM
   * - **category**: Filter by JAMB, WAEC, NECO, etc.
   * - **subject_id**: Filter by subject
   * - **exam_year**: Filter by year (e.g., 2024, 2023)
   * - **search**: Search by title, code, or description
   * @param assessmentType
   * @param category
   * @param subjectId
   * @param status
   * @param examYear
   * @param minPrice
   * @param maxPrice
   * @param isPublic
   * @param search
   * @param skip
   * @param limit
   * @returns AssessmentListResponse Successful Response
   * @throws ApiError
   */
  public static getAssessmentsApiV1AssessmentsGet(
    assessmentType?: (AssessmentType | null),
    category?: (AssessmentCategory | null),
    subjectId?: (string | null),
    status?: (AssessmentStatus | null),
    examYear?: (number | null),
    minPrice?: (number | null),
    maxPrice?: (number | null),
    isPublic?: (boolean | null),
    search?: (string | null),
    skip?: number,
    limit: number = 20,
  ): CancelablePromise<AssessmentListResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/assessments/',
      query: {
        'assessment_type': assessmentType,
        'category': category,
        'subject_id': subjectId,
        'status': status,
        'exam_year': examYear,
        'min_price': minPrice,
        'max_price': maxPrice,
        'is_public': isPublic,
        'search': search,
        'skip': skip,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Auto-generate assessment from topics
   * Automatically generate a practice assessment from selected topics.
   *
   * This endpoint allows students to create personalized practice tests by:
   * - Selecting a subject
   * - Choosing specific topics they want to practice
   * - Setting number of questions and duration
   * - Optionally filtering by difficulty and question types
   *
   * The system will:
   * 1. Find approved questions from selected topics
   * 2. Randomly select the requested number of questions
   * 3. Create and publish the assessment immediately
   * 4. Return assessment details for the student to start
   *
   * **Use Case:** Student wants to practice specific topics before an exam
   *
   * Example:
   * ```json
   * {
     * "subject_id": "uuid-mathematics",
     * "topic_ids": ["uuid-algebra", "uuid-geometry"],
     * "number_of_questions": 20,
     * "duration_minutes": 30,
     * "difficulty_level": "MEDIUM"
     * }
     * ```
     * @param requestBody
     * @returns AutoAssessmentResponse Successful Response
     * @throws ApiError
     */
    public static autoGenerateAssessmentApiV1AssessmentsAutoGeneratePost(
      requestBody: AutoAssessmentRequest,
    ): CancelablePromise<AutoAssessmentResponse> {
      return __request(OpenAPI, {
        method: 'POST',
        url: '/api/v1/assessments/auto-generate',
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          422: `Validation Error`,
        },
      });
    }
    /**
     * Get currently available assessments
     * Get assessments that are currently available for taking.
     * @param assessmentType
     * @param category
     * @param skip
     * @param limit
     * @returns AssessmentSummaryResponse Successful Response
     * @throws ApiError
     */
    public static getAvailableAssessmentsApiV1AssessmentsAvailableGet(
      assessmentType?: (AssessmentType | null),
      category?: (AssessmentCategory | null),
      skip?: number,
      limit: number = 20,
    ): CancelablePromise<Array<AssessmentSummaryResponse>> {
      return __request(OpenAPI, {
        method: 'GET',
        url: '/api/v1/assessments/available',
        query: {
          'assessment_type': assessmentType,
          'category': category,
          'skip': skip,
          'limit': limit,
        },
        errors: {
          422: `Validation Error`,
        },
      });
    }
    /**
     * Get popular assessments
     * Get popular assessments based on attempt count.
     * @param assessmentType
     * @param limit
     * @returns AssessmentSummaryResponse Successful Response
     * @throws ApiError
     */
    public static getPopularAssessmentsApiV1AssessmentsPopularGet(
      assessmentType?: (AssessmentType | null),
      limit: number = 10,
    ): CancelablePromise<Array<AssessmentSummaryResponse>> {
      return __request(OpenAPI, {
        method: 'GET',
        url: '/api/v1/assessments/popular',
        query: {
          'assessment_type': assessmentType,
          'limit': limit,
        },
        errors: {
          422: `Validation Error`,
        },
      });
    }
    /**
     * Get available years for a category
     * Get list of years with assessments for a specific category (e.g., JAMB 2024, 2023, etc.).
     * @param category
     * @returns number Successful Response
     * @throws ApiError
     */
    public static getCategoryYearsApiV1AssessmentsCategoriesCategoryYearsGet(
      category: AssessmentCategory,
    ): CancelablePromise<Array<number>> {
      return __request(OpenAPI, {
        method: 'GET',
        url: '/api/v1/assessments/categories/{category}/years',
        path: {
          'category': category,
        },
        errors: {
          422: `Validation Error`,
        },
      });
    }
    /**
     * Get assessment by ID
     * Get a specific assessment by ID.
     *
     * - **include_questions**: Include full question details
     * @param assessmentId
     * @param includeQuestions
     * @returns AssessmentResponse Successful Response
     * @throws ApiError
     */
    public static getAssessmentApiV1AssessmentsAssessmentIdGet(
      assessmentId: string,
      includeQuestions: boolean = false,
    ): CancelablePromise<AssessmentResponse> {
      return __request(OpenAPI, {
        method: 'GET',
        url: '/api/v1/assessments/{assessment_id}',
        path: {
          'assessment_id': assessmentId,
        },
        query: {
          'include_questions': includeQuestions,
        },
        errors: {
          422: `Validation Error`,
        },
      });
    }
    /**
     * Update an assessment
     * Update an assessment.
     *
     * Requires `assessment:update` permission.
     * Note: Published assessments must be archived before updating.
     * @param assessmentId
     * @param requestBody
     * @returns AssessmentResponse Successful Response
     * @throws ApiError
     */
    public static updateAssessmentApiV1AssessmentsAssessmentIdPut(
      assessmentId: string,
      requestBody: AssessmentUpdate,
    ): CancelablePromise<AssessmentResponse> {
      return __request(OpenAPI, {
        method: 'PUT',
        url: '/api/v1/assessments/{assessment_id}',
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
     * Delete an assessment
     * Delete an assessment (soft delete).
     *
     * Requires `assessment:delete` permission.
     * Cannot delete assessments with active attempts.
     * @param assessmentId
     * @returns MessageResponse Successful Response
     * @throws ApiError
     */
    public static deleteAssessmentApiV1AssessmentsAssessmentIdDelete(
      assessmentId: string,
    ): CancelablePromise<MessageResponse> {
      return __request(OpenAPI, {
        method: 'DELETE',
        url: '/api/v1/assessments/{assessment_id}',
        path: {
          'assessment_id': assessmentId,
        },
        errors: {
          422: `Validation Error`,
        },
      });
    }
    /**
     * Publish an assessment
     * Publish an assessment to make it available to students.
     *
     * Requires `assessment:publish` permission.
     * @param assessmentId
     * @returns AssessmentResponse Successful Response
     * @throws ApiError
     */
    public static publishAssessmentApiV1AssessmentsAssessmentIdPublishPost(
      assessmentId: string,
    ): CancelablePromise<AssessmentResponse> {
      return __request(OpenAPI, {
        method: 'POST',
        url: '/api/v1/assessments/{assessment_id}/publish',
        path: {
          'assessment_id': assessmentId,
        },
        errors: {
          422: `Validation Error`,
        },
      });
    }
    /**
     * Get assessment statistics
     * Get detailed statistics for an assessment.
     * @param assessmentId
     * @returns AssessmentStatistics Successful Response
     * @throws ApiError
     */
    public static getAssessmentStatisticsApiV1AssessmentsAssessmentIdStatisticsGet(
      assessmentId: string,
    ): CancelablePromise<AssessmentStatistics> {
      return __request(OpenAPI, {
        method: 'GET',
        url: '/api/v1/assessments/{assessment_id}/statistics',
        path: {
          'assessment_id': assessmentId,
        },
        errors: {
          422: `Validation Error`,
        },
      });
    }
  }
