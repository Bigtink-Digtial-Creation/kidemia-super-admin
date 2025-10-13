/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { MessageResponse } from "../models/MessageResponse";
import type { PermissionCreate } from "../models/PermissionCreate";
import type { PermissionResponse } from "../models/PermissionResponse";
import type { PermissionUpdate } from "../models/PermissionUpdate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class PermissionsService {
  /**
   * Create a new permission
   * Create a new permission.
   *
   * - **name**: Unique permission name (e.g., 'users:create')
   * - **display_name**: Human-readable permission name
   * - **description**: Permission description
   * - **resource**: Resource name (e.g., 'users', 'roles')
   * - **action**: Action name (e.g., 'create', 'read', 'update', 'delete')
   * @param requestBody
   * @returns PermissionResponse Successful Response
   * @throws ApiError
   */
  public static createPermissionApiV1PermissionsPost(
    requestBody: PermissionCreate,
  ): CancelablePromise<PermissionResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/permissions/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * List all permissions
   * Get list of all permissions with pagination.
   * @param skip
   * @param limit
   * @returns PermissionResponse Successful Response
   * @throws ApiError
   */
  public static listPermissionsApiV1PermissionsGet(
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<Array<PermissionResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/permissions/",
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
   * Get permissions by resource
   * Get all permissions for a specific resource.
   *
   * - **resource**: Resource name (e.g., 'users', 'roles')
   * @param resource
   * @returns PermissionResponse Successful Response
   * @throws ApiError
   */
  public static getPermissionsByResourceApiV1PermissionsResourceResourceGet(
    resource: string,
  ): CancelablePromise<Array<PermissionResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/permissions/resource/{resource}",
      path: {
        resource: resource,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get permissions by action
   * Get all permissions for a specific action.
   *
   * - **action**: Action name (e.g., 'create', 'read', 'update', 'delete')
   * @param action
   * @returns PermissionResponse Successful Response
   * @throws ApiError
   */
  public static getPermissionsByActionApiV1PermissionsActionActionGet(
    action: string,
  ): CancelablePromise<Array<PermissionResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/permissions/action/{action}",
      path: {
        action: action,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get permission by name
   * Get permission by its unique name.
   *
   * - **name**: Permission name
   * @param name
   * @returns PermissionResponse Successful Response
   * @throws ApiError
   */
  public static getPermissionByNameApiV1PermissionsNameNameGet(
    name: string,
  ): CancelablePromise<PermissionResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/permissions/name/{name}",
      path: {
        name: name,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get permission by ID
   * Get permission details by ID.
   * @param permissionId
   * @returns PermissionResponse Successful Response
   * @throws ApiError
   */
  public static getPermissionApiV1PermissionsPermissionIdGet(
    permissionId: string,
  ): CancelablePromise<PermissionResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/permissions/{permission_id}",
      path: {
        permission_id: permissionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update permission
   * Update permission details.
   *
   * - **display_name**: Updated display name
   * - **description**: Updated description
   * @param permissionId
   * @param requestBody
   * @returns PermissionResponse Successful Response
   * @throws ApiError
   */
  public static updatePermissionApiV1PermissionsPermissionIdPatch(
    permissionId: string,
    requestBody: PermissionUpdate,
  ): CancelablePromise<PermissionResponse> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/permissions/{permission_id}",
      path: {
        permission_id: permissionId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete permission
   * Delete a permission by ID.
   * @param permissionId
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static deletePermissionApiV1PermissionsPermissionIdDelete(
    permissionId: string,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/permissions/{permission_id}",
      path: {
        permission_id: permissionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
