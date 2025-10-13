/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignRolesToUserRequest } from "../models/AssignRolesToUserRequest";
import type { MessageResponse } from "../models/MessageResponse";
import type { UserCreate } from "../models/UserCreate";
import type { UserResponse } from "../models/UserResponse";
import type { UserType } from "../models/UserType";
import type { UserUpdate } from "../models/UserUpdate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class UsersService {
  /**
   * Create a new user
   * Create a new user account.
   *
   * - **email**: Valid email address
   * - **password**: Min 8 characters with uppercase, lowercase, and number
   * - **first_name**: User's first name
   * - **last_name**: User's last name
   * - **middle_name**: User's middle name (optional)
   * - **phone_number**: Phone number (optional)
   * - **date_of_birth**: Date of birth (optional)
   * - **user_type**: Type of user (student, guardian, institution_admin, platform_admin)
   * - **username**: Username (optional)
   * @param requestBody
   * @param assignDefaultRole Assign default role based on user type
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static createUserApiV1UsersPost(
    requestBody: UserCreate,
    assignDefaultRole: boolean = true,
  ): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/",
      query: {
        assign_default_role: assignDefaultRole,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * List all users
   * Get list of all users with pagination.
   * @param skip
   * @param limit
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static listUsersApiV1UsersGet(
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<Array<UserResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/",
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
   * Get all active users
   * Get all active users with pagination.
   * @param skip
   * @param limit
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static getActiveUsersApiV1UsersActiveGet(
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<Array<UserResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/active",
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
   * Get users by type
   * Get users by their type with pagination.
   *
   * - **user_type**: student, guardian, institution_admin, or platform_admin
   * @param userType
   * @param skip
   * @param limit
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static getUsersByTypeApiV1UsersTypeUserTypeGet(
    userType: UserType,
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<Array<UserResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/type/{user_type}",
      path: {
        user_type: userType,
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
   * Search users
   * Search users by name, email, or username.
   *
   * - **q**: Search query (searches in first_name, last_name, email, username)
   * @param q Search query
   * @param skip
   * @param limit
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static searchUsersApiV1UsersSearchGet(
    q: string,
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<Array<UserResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/search",
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
   * Get user by email
   * Get user by email address.
   * @param email
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static getUserByEmailApiV1UsersEmailEmailGet(
    email: string,
  ): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/email/{email}",
      path: {
        email: email,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get user by username
   * Get user by username.
   * @param username
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static getUserByUsernameApiV1UsersUsernameUsernameGet(
    username: string,
  ): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/username/{username}",
      path: {
        username: username,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get user by ID
   * Get user details by ID.
   * @param userId
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static getUserApiV1UsersUserIdGet(
    userId: string,
  ): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update user
   * Update user details.
   *
   * - **first_name**: Updated first name
   * - **last_name**: Updated last name
   * - **middle_name**: Updated middle name
   * - **phone_number**: Updated phone number
   * - **date_of_birth**: Updated date of birth
   * - **profile_picture_url**: Profile picture URL
   * - **bio**: User bio
   * - **language**: Preferred language
   * - **timezone**: User's timezone
   * @param userId
   * @param requestBody
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static updateUserApiV1UsersUserIdPatch(
    userId: string,
    requestBody: UserUpdate,
  ): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete user
   * Delete (soft delete) a user by ID.
   * @param userId
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static deleteUserApiV1UsersUserIdDelete(
    userId: string,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Activate user
   * Activate a user account.
   * @param userId
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static activateUserApiV1UsersUserIdActivatePost(
    userId: string,
  ): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/{user_id}/activate",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Deactivate user
   * Deactivate a user account.
   * @param userId
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static deactivateUserApiV1UsersUserIdDeactivatePost(
    userId: string,
  ): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/{user_id}/deactivate",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Verify user email
   * Mark user's email as verified.
   * @param userId
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static verifyUserEmailApiV1UsersUserIdVerifyEmailPost(
    userId: string,
  ): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/{user_id}/verify-email",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Assign roles to user
   * Assign multiple roles to a user.
   *
   * - **role_ids**: List of role IDs to assign
   * @param userId
   * @param requestBody
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static assignRolesToUserApiV1UsersUserIdRolesPost(
    userId: string,
    requestBody: AssignRolesToUserRequest,
  ): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/{user_id}/roles",
      path: {
        user_id: userId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Add single role to user
   * Add a single role to a user.
   * @param userId
   * @param roleId
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static addRoleToUserApiV1UsersUserIdRolesRoleIdPost(
    userId: string,
    roleId: string,
  ): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/{user_id}/roles/{role_id}",
      path: {
        user_id: userId,
        role_id: roleId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Remove role from user
   * Remove a role from a user.
   * @param userId
   * @param roleId
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static removeRoleFromUserApiV1UsersUserIdRolesRoleIdDelete(
    userId: string,
    roleId: string,
  ): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/users/{user_id}/roles/{role_id}",
      path: {
        user_id: userId,
        role_id: roleId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
