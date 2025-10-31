/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { CategoryConfigCreate } from "../models/CategoryConfigCreate";
import type { CategoryConfigResponse } from "../models/CategoryConfigResponse";
import type { CategoryConfigUpdate } from "../models/CategoryConfigUpdate";
import type { MessageResponse } from "../models/MessageResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AssessmentCategoriesService {
  /**
   * Create category configuration
   * Create a new assessment category configuration.
   *
   * Requires `assessment:manage` permission.
   * @param requestBody
   * @returns CategoryConfigResponse Successful Response
   * @throws ApiError
   */
  public static createCategoryConfigApiV1CategoriesPost(
    requestBody: CategoryConfigCreate,
  ): CancelablePromise<CategoryConfigResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/categories/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get all category configurations
   * Get all assessment category configurations.
   * @param activeOnly
   * @returns CategoryConfigResponse Successful Response
   * @throws ApiError
   */
  public static getCategoryConfigsApiV1CategoriesGet(
    activeOnly: boolean = true,
  ): CancelablePromise<Array<CategoryConfigResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/categories/",
      query: {
        active_only: activeOnly,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get category configuration by ID
   * Get a specific category configuration.
   * @param configId
   * @returns CategoryConfigResponse Successful Response
   * @throws ApiError
   */
  public static getCategoryConfigApiV1CategoriesConfigIdGet(
    configId: string,
  ): CancelablePromise<CategoryConfigResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/categories/{config_id}",
      path: {
        config_id: configId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update category configuration
   * Update a category configuration.
   * @param configId
   * @param requestBody
   * @returns CategoryConfigResponse Successful Response
   * @throws ApiError
   */
  public static updateCategoryConfigApiV1CategoriesConfigIdPut(
    configId: string,
    requestBody: CategoryConfigUpdate,
  ): CancelablePromise<CategoryConfigResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/categories/{config_id}",
      path: {
        config_id: configId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete category configuration
   * Delete a category configuration.
   * @param configId
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static deleteCategoryConfigApiV1CategoriesConfigIdDelete(
    configId: string,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/categories/{config_id}",
      path: {
        config_id: configId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
