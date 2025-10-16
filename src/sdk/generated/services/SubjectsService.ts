/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { MessageResponse } from "../models/MessageResponse";
import type { SubjectCreate } from "../models/SubjectCreate";
import type { SubjectListResponse } from "../models/SubjectListResponse";
import type { SubjectResponse } from "../models/SubjectResponse";
import type { SubjectUpdate } from "../models/SubjectUpdate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class SubjectsService {
  /**
   * Create a new subject
   * Create a new subject.
   *
   * Requires `content:create` permission.
   * @param requestBody
   * @returns SubjectResponse Successful Response
   * @throws ApiError
   */
  public static createSubjectApiV1SubjectsPost(
    requestBody: SubjectCreate,
  ): CancelablePromise<SubjectResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/subjects/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get All subjects
   * Get all subjects with pagination.
   *
   * - **skip**: Number of records to skip
   * - **limit**: Maximum number of records to return
   * - **active_only**: Return only active subjects
   * @param skip
   * @param limit
   * @param activeOnly
   * @returns SubjectListResponse Successful Response
   * @throws ApiError
   */
  public static getSubjectsApiV1SubjectsGet(
    skip?: number,
    limit: number = 20,
    activeOnly: boolean = false,
  ): CancelablePromise<SubjectListResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/subjects/",
      query: {
        skip: skip,
        limit: limit,
        active_only: activeOnly,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get featured subjects
   * Get featured subjects.
   * @param limit
   * @returns SubjectResponse Successful Response
   * @throws ApiError
   */
  public static getFeaturedSubjectsApiV1SubjectsFeaturedGet(
    limit: number = 10,
  ): CancelablePromise<Array<SubjectResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/subjects/featured",
      query: {
        limit: limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Search subjects
   * Search subjects by name, code, or description.
   * @param q
   * @param skip
   * @param limit
   * @returns SubjectResponse Successful Response
   * @throws ApiError
   */
  public static searchSubjectsApiV1SubjectsSearchGet(
    q: string,
    skip?: number,
    limit: number = 20,
  ): CancelablePromise<Array<SubjectResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/subjects/search",
      query: {
        q: q,
        skip: skip,
        limit: limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get subject by ID
   * Get a specific subject by ID.
   * @param subjectId
   * @returns SubjectResponse Successful Response
   * @throws ApiError
   */
  public static getSubjectApiV1SubjectsSubjectIdGet(
    subjectId: string,
  ): CancelablePromise<SubjectResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/subjects/{subject_id}",
      path: {
        subject_id: subjectId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update a subject
   * Update a subject.
   *
   * Requires `content:update` permission.
   * @param subjectId
   * @param requestBody
   * @returns SubjectResponse Successful Response
   * @throws ApiError
   */
  public static updateSubjectApiV1SubjectsSubjectIdPut(
    subjectId: string,
    requestBody: SubjectUpdate,
  ): CancelablePromise<SubjectResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/subjects/{subject_id}",
      path: {
        subject_id: subjectId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete a subject
   * Delete a subject (soft delete).
   *
   * Requires `content:delete` permission.
   * @param subjectId
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static deleteSubjectApiV1SubjectsSubjectIdDelete(
    subjectId: string,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/subjects/{subject_id}",
      path: {
        subject_id: subjectId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
