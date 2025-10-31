/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AssignPermissionsToRoleRequest } from "../models/AssignPermissionsToRoleRequest";
import type { MessageResponse } from "../models/MessageResponse";
import type { RoleCreate } from "../models/RoleCreate";
import type { RoleResponse } from "../models/RoleResponse";
import type { RoleUpdate } from "../models/RoleUpdate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class RolesService {
  /**
   * Create a new role
   * Create a new custom role.
   *
   * - **name**: Unique role name
   * - **display_name**: Human-readable role name
   * - **description**: Role description
   * - **role_type**: Type of role (system, custom)
   * - **permission_ids**: List of permission IDs to assign
   * @param requestBody
   * @returns RoleResponse Successful Response
   * @throws ApiError
   */
  public static createRoleApiV1RolesPost(
    requestBody: RoleCreate,
  ): CancelablePromise<RoleResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/roles/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * List all roles
   * Get list of all roles with pagination.
   * @param skip
   * @param limit
   * @returns RoleResponse Successful Response
   * @throws ApiError
   */
  public static listRolesApiV1RolesGet(
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<Array<RoleResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/roles/",
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
   * Get all system roles
   * Get all system-defined roles.
   * @returns RoleResponse Successful Response
   * @throws ApiError
   */
  public static getSystemRolesApiV1RolesSystemGet(): CancelablePromise<
    Array<RoleResponse>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/roles/system",
    });
  }
  /**
   * Get all custom roles
   * Get all custom/user-created roles.
   * @returns RoleResponse Successful Response
   * @throws ApiError
   */
  public static getCustomRolesApiV1RolesCustomGet(): CancelablePromise<
    Array<RoleResponse>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/roles/custom",
    });
  }
  /**
   * Get role by name
   * Get role by its unique name.
   *
   * - **name**: Role name
   * @param name
   * @returns RoleResponse Successful Response
   * @throws ApiError
   */
  public static getRoleByNameApiV1RolesNameNameGet(
    name: string,
  ): CancelablePromise<RoleResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/roles/name/{name}",
      path: {
        name: name,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get role by ID
   * Get role details by ID.
   * @param roleId
   * @returns RoleResponse Successful Response
   * @throws ApiError
   */
  public static getRoleApiV1RolesRoleIdGet(
    roleId: string,
  ): CancelablePromise<RoleResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/roles/{role_id}",
      path: {
        role_id: roleId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update role
   * Update role details. Cannot update system roles.
   *
   * - **display_name**: Updated display name
   * - **description**: Updated description
   * - **permission_ids**: Updated list of permission IDs
   * @param roleId
   * @param requestBody
   * @returns RoleResponse Successful Response
   * @throws ApiError
   */
  public static updateRoleApiV1RolesRoleIdPatch(
    roleId: string,
    requestBody: RoleUpdate,
  ): CancelablePromise<RoleResponse> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/roles/{role_id}",
      path: {
        role_id: roleId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete role
   * Delete a custom role by ID. Cannot delete system roles.
   * @param roleId
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static deleteRoleApiV1RolesRoleIdDelete(
    roleId: string,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/roles/{role_id}",
      path: {
        role_id: roleId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Assign permissions to role
   * Assign multiple permissions to a role.
   *
   * - **permission_ids**: List of permission IDs to assign
   * @param roleId
   * @param requestBody
   * @returns RoleResponse Successful Response
   * @throws ApiError
   */
  public static assignPermissionsToRoleApiV1RolesRoleIdPermissionsPost(
    roleId: string,
    requestBody: AssignPermissionsToRoleRequest,
  ): CancelablePromise<RoleResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/roles/{role_id}/permissions",
      path: {
        role_id: roleId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Add single permission to role
   * Add a single permission to a role.
   * @param roleId
   * @param permissionId
   * @returns RoleResponse Successful Response
   * @throws ApiError
   */
  public static addPermissionToRoleApiV1RolesRoleIdPermissionsPermissionIdPost(
    roleId: string,
    permissionId: string,
  ): CancelablePromise<RoleResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/roles/{role_id}/permissions/{permission_id}",
      path: {
        role_id: roleId,
        permission_id: permissionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Remove permission from role
   * Remove a permission from a role.
   * @param roleId
   * @param permissionId
   * @returns RoleResponse Successful Response
   * @throws ApiError
   */
  public static removePermissionFromRoleApiV1RolesRoleIdPermissionsPermissionIdDelete(
    roleId: string,
    permissionId: string,
  ): CancelablePromise<RoleResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/roles/{role_id}/permissions/{permission_id}",
      path: {
        role_id: roleId,
        permission_id: permissionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
