/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageResponse } from '../models/MessageResponse';
import type { QuestionTagCreate } from '../models/QuestionTagCreate';
import type { QuestionTagResponse } from '../models/QuestionTagResponse';
import type { QuestionTagUpdate } from '../models/QuestionTagUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TagsService {
  /**
   * Get all tags
   * Get all question tags.
   * @returns QuestionTagResponse Successful Response
   * @throws ApiError
   */
  public static getTagsApiV1TagsGet(): CancelablePromise<Array<QuestionTagResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/tags/',
    });
  }
  /**
   * Create a question tag
   * Create a new question tag.
   * @param requestBody
   * @returns QuestionTagResponse Successful Response
   * @throws ApiError
   */
  public static createTagApiV1TagsPost(
    requestBody: QuestionTagCreate,
  ): CancelablePromise<QuestionTagResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/tags/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get popular tags
   * Get most used tags.
   * @param limit
   * @returns QuestionTagResponse Successful Response
   * @throws ApiError
   */
  public static getPopularTagsApiV1TagsPopularGet(
    limit: number = 20,
  ): CancelablePromise<Array<QuestionTagResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/tags/popular',
      query: {
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get tag by ID
   * Get a specific tag by ID.
   * @param tagId
   * @returns QuestionTagResponse Successful Response
   * @throws ApiError
   */
  public static getTagApiV1TagsTagIdGet(
    tagId: string,
  ): CancelablePromise<QuestionTagResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/tags/{tag_id}',
      path: {
        'tag_id': tagId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update a tag
   * Update a question tag.
   * @param tagId
   * @param requestBody
   * @returns QuestionTagResponse Successful Response
   * @throws ApiError
   */
  public static updateTagApiV1TagsTagIdPut(
    tagId: string,
    requestBody: QuestionTagUpdate,
  ): CancelablePromise<QuestionTagResponse> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/tags/{tag_id}',
      path: {
        'tag_id': tagId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete a tag
   * Delete a question tag.
   * @param tagId
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static deleteTagApiV1TagsTagIdDelete(
    tagId: string,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/tags/{tag_id}',
      path: {
        'tag_id': tagId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
