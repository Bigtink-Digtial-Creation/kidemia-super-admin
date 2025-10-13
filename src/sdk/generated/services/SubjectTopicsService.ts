/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { MessageResponse } from "../models/MessageResponse";
import type { TopicCreate } from "../models/TopicCreate";
import type { TopicListResponse } from "../models/TopicListResponse";
import type { TopicResponse } from "../models/TopicResponse";
import type { TopicUpdate } from "../models/TopicUpdate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class SubjectTopicsService {
  /**
   * Create a new topic
   * Create a new Topic
   *
   * Parameters:
   * - subject_id (string <uuid>, required): The Subject Id this topic belongs to.
   * - name (string, required, 1..200 chars): The name of the topic.
   * - code (string, required, 1..20 chars): Short code/identifier for the topic.
   * - description (string | null): A description of the topic.
   * - content (string | null): Rich content or body text for the topic.
   * - video_url (string | null): Optional video resource link.
   * - document_url (string | null): Optional document resource link.
   * - parent_id (string <uuid> | null): If this topic has a parent topic, supply its id.
   * - order (integer >= 0, default=0): The order of the topic in listings.
   * - estimated_time_minutes (integer | null): Estimated time (in minutes) to complete this topic.
   * - difficulty_level (string | null): Difficulty level of the topic. Enum: "easy", "medium", "hard", "expert".
   * - is_active (boolean, default=true): Whether the topic is active.
   *
   * Responses:
   * - 201 Created: Returns the created Topic object.
   * - 400 Bad Request: Invalid input data.
   * - 404 Not Found: Subject or parent topic not found.
   * @param requestBody
   * @returns TopicResponse Successful Response
   * @throws ApiError
   */
  public static createTopicApiV1TopicsPost(
    requestBody: TopicCreate,
  ): CancelablePromise<TopicResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/topics/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Bulk create multiple topics
   * Bulk Create Topics
   *
   * Create multiple topics in a single request.
   *
   * Parameters:
   * - topics_data (array of TopicCreate): A list of topics to create.
   * Each topic must include:
   * - subject_id (string <uuid>, required)
   * - name (string, required)
   * - code (string, required)
   * - description (string | null)
   * - content (string | null)
   * - video_url (string | null)
   * - document_url (string | null)
   * - parent_id (string <uuid> | null)
   * - order (integer >= 0, default=0)
   * - estimated_time_minutes (integer | null)
   * - difficulty_level (string | null) Enum: "easy", "medium", "hard", "expert"
   * - is_active (boolean, default=true)
   *
   * Responses:
   * - 201 Created: Returns a list of successfully created topics.
   * - 400 Bad Request: If any topic input is invalid.
   * - 404 Not Found: If a subject or parent topic is missing.
   * @param requestBody
   * @returns TopicResponse Successful Response
   * @throws ApiError
   */
  public static bulkCreateTopicsApiV1TopicsBulkPost(
    requestBody: Array<TopicCreate>,
  ): CancelablePromise<Array<TopicResponse>> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/topics/bulk",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get topics by subject
   * Get all topics for a specific subject.
   * @param subjectId
   * @param skip
   * @param limit
   * @returns TopicListResponse Successful Response
   * @throws ApiError
   */
  public static getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(
    subjectId: string,
    skip?: number,
    limit: number = 20,
  ): CancelablePromise<TopicListResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/topics/subject/{subject_id}",
      path: {
        subject_id: subjectId,
      },
      query: {
        skip: skip,
        limit: limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Search topics
   * Search topics by name, code, or description.
   * @param q
   * @param subjectId
   * @param skip
   * @param limit
   * @returns TopicResponse Successful Response
   * @throws ApiError
   */
  public static searchTopicsApiV1TopicsSearchGet(
    q: string,
    subjectId?: string | null,
    skip?: number,
    limit: number = 20,
  ): CancelablePromise<Array<TopicResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/topics/search",
      query: {
        q: q,
        subject_id: subjectId,
        skip: skip,
        limit: limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get topic by ID
   * Get a specific topic by ID.
   * @param topicId
   * @returns TopicResponse Successful Response
   * @throws ApiError
   */
  public static getTopicApiV1TopicsTopicIdGet(
    topicId: string,
  ): CancelablePromise<TopicResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/topics/{topic_id}",
      path: {
        topic_id: topicId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update a topic
   * Update a topic.
   *
   * Requires `content:update` permission.
   * @param topicId
   * @param requestBody
   * @returns TopicResponse Successful Response
   * @throws ApiError
   */
  public static updateTopicApiV1TopicsTopicIdPut(
    topicId: string,
    requestBody: TopicUpdate,
  ): CancelablePromise<TopicResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/topics/{topic_id}",
      path: {
        topic_id: topicId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete a topic
   * Delete a topic (soft delete).
   *
   * Requires `content:delete` permission.
   * @param topicId
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static deleteTopicApiV1TopicsTopicIdDelete(
    topicId: string,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/topics/{topic_id}",
      path: {
        topic_id: topicId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
