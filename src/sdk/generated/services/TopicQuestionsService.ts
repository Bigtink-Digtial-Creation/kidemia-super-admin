/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { BulkQuestionImportRequest } from "../models/BulkQuestionImportRequest";
import type { BulkQuestionImportResponse } from "../models/BulkQuestionImportResponse";
import type { DifficultyLevel } from "../models/DifficultyLevel";
import type { MessageResponse } from "../models/MessageResponse";
import type { QuestionCreate } from "../models/QuestionCreate";
import type { QuestionListResponse } from "../models/QuestionListResponse";
import type { QuestionPublicResponse } from "../models/QuestionPublicResponse";
import type { QuestionResponse } from "../models/QuestionResponse";
import type { QuestionReviewRequest } from "../models/QuestionReviewRequest";
import type { QuestionStatus } from "../models/QuestionStatus";
import type { QuestionType } from "../models/QuestionType";
import type { QuestionUpdate } from "../models/QuestionUpdate";
import type { TopicQuestionListResponse } from "../models/TopicQuestionListResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class TopicQuestionsService {
  /**
   * Create bulk questions
   * @param requestBody
   * @returns QuestionResponse Successful Response
   * @throws ApiError
   */
  public static createBulkQuestionApiV1QuestionsBulkQuestionsPost(
    requestBody: Array<QuestionCreate>,
  ): CancelablePromise<Array<QuestionResponse>> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/questions/bulk-questions",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Create a new question
   * Create a new question.
   *
   * Parameters:
   * ------------------------
   * - subject_id : string <uuid> (required)
   * - topic_id : string <uuid> (required)
   * - question_text : string (required, non-empty)
   * - question_type : string (required, enum)
   * - multiple_choice
   * - true_false
   * - fill_in_blank
   * - essay
   * - matching
   * - ordering
   * - difficulty_level : string (required, enum)
   * - easy
   * - medium
   * - hard
   * - expert
   * - explanation : string | null (optional)
   * - image_url : string | null (optional)
   * - audio_url : string | null (optional)
   * - video_url : string | null (optional)
   * - points : integer (default=1, range [1..100])
   * - time_limit_seconds : integer | null (optional)
   * - options : Array[object] (required, >= 2 items)
   * - tag_ids : Array[string <uuid>] | null (optional)
   *
   * Responses:
   * ----------
   * - 201 Created : Question successfully created
   * - 400 Bad Request : Invalid input
   * - 401 Unauthorized : Authentication required
   * - 403 Forbidden : Not enough permissions
   * @param requestBody
   * @returns QuestionResponse Successful Response
   * @throws ApiError
   */
  public static createQuestionApiV1QuestionsPost(
    requestBody: QuestionCreate,
  ): CancelablePromise<QuestionResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/questions/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get questions with filters
   * Get questions with various filters.
   *
   * - **subject_id**: Filter by subject
   * - **topic_id**: Filter by topic
   * - **difficulty_level**: Filter by difficulty
   * - **question_type**: Filter by question type
   * - **status**: Filter by status
   * - **search**: Search in question text
   * @param subjectId
   * @param topicId
   * @param difficultyLevel
   * @param questionType
   * @param status
   * @param search
   * @param skip
   * @param limit
   * @returns QuestionListResponse Successful Response
   * @throws ApiError
   */
  public static getQuestionsApiV1QuestionsGet(
    subjectId?: string | null,
    topicId?: string | null,
    difficultyLevel?: DifficultyLevel | null,
    questionType?: QuestionType | null,
    status?: QuestionStatus | null,
    search?: string | null,
    skip?: number,
    limit: number = 20,
  ): CancelablePromise<QuestionListResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/questions/",
      query: {
        subject_id: subjectId,
        topic_id: topicId,
        difficulty_level: difficultyLevel,
        question_type: questionType,
        status: status,
        search: search,
        skip: skip,
        limit: limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get questions grouped by multiple topics
   * Get questions grouped by multiple topics.
   *
   * - **topic_ids**: List of topic UUIDs
   * - **limit**: Max questions per topic
   * @param requestBody
   * @param limit
   * @returns TopicQuestionListResponse Successful Response
   * @throws ApiError
   */
  public static getQuestionsByTopicsApiV1QuestionsByTopicsPost(
    requestBody: Array<string>,
    limit: number = 20,
  ): CancelablePromise<TopicQuestionListResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/questions/by-topics",
      query: {
        limit: limit,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get random questions
   * Get random approved questions for test/exam generation.
   *
   * - **count**: Number of questions to return
   * - **subject_id**: Filter by subject
   * - **topic_id**: Filter by topic
   * - **difficulty**: Filter by difficulty
   * - **question_type**: Filter by question type
   * @param count
   * @param subjectId
   * @param topicId
   * @param difficulty
   * @param questionType
   * @returns QuestionPublicResponse Successful Response
   * @throws ApiError
   */
  public static getRandomQuestionsApiV1QuestionsRandomGet(
    count: number,
    subjectId?: string | null,
    topicId?: string | null,
    difficulty?: DifficultyLevel | null,
    questionType?: QuestionType | null,
  ): CancelablePromise<Array<QuestionPublicResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/questions/random",
      query: {
        count: count,
        subject_id: subjectId,
        topic_id: topicId,
        difficulty: difficulty,
        question_type: questionType,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get question by ID
   * Get a specific question by ID.
   *
   * - **include_answers**: Include correct answer information (default: true)
   * @param questionId
   * @param includeAnswers
   * @returns QuestionResponse Successful Response
   * @throws ApiError
   */
  public static getQuestionApiV1QuestionsQuestionIdGet(
    questionId: string,
    includeAnswers: boolean = true,
  ): CancelablePromise<QuestionResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/questions/{question_id}",
      path: {
        question_id: questionId,
      },
      query: {
        include_answers: includeAnswers,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update a question
   * Update a question.
   *
   * Requires `content:update` permission.
   * @param questionId
   * @param requestBody
   * @returns QuestionResponse Successful Response
   * @throws ApiError
   */
  public static updateQuestionApiV1QuestionsQuestionIdPut(
    questionId: string,
    requestBody: QuestionUpdate,
  ): CancelablePromise<QuestionResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/questions/{question_id}",
      path: {
        question_id: questionId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete a question
   * Delete a question (soft delete).
   *
   * Requires `content:delete` permission.
   * @param questionId
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static deleteQuestionApiV1QuestionsQuestionIdDelete(
    questionId: string,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/questions/{question_id}",
      path: {
        question_id: questionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Submit question for review
   * Submit a question for review.
   *
   * Requires `content:create` permission.
   * @param questionId
   * @returns QuestionResponse Successful Response
   * @throws ApiError
   */
  public static submitForReviewApiV1QuestionsQuestionIdSubmitReviewPost(
    questionId: string,
  ): CancelablePromise<QuestionResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/questions/{question_id}/submit-review",
      path: {
        question_id: questionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Review a question
   * Review a question (approve or reject).
   *
   * Requires `content:approve` permission.
   * @param questionId
   * @param requestBody
   * @returns QuestionResponse Successful Response
   * @throws ApiError
   */
  public static reviewQuestionApiV1QuestionsQuestionIdReviewPost(
    questionId: string,
    requestBody: QuestionReviewRequest,
  ): CancelablePromise<QuestionResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/questions/{question_id}/review",
      path: {
        question_id: questionId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Bulk import questions
   * Bulk import multiple questions.
   *
   * Requires `content:create` permission.
   * @param requestBody
   * @returns BulkQuestionImportResponse Successful Response
   * @throws ApiError
   */
  public static bulkImportQuestionsApiV1QuestionsBulkImportPost(
    requestBody: BulkQuestionImportRequest,
  ): CancelablePromise<BulkQuestionImportResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/questions/bulk-import",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
