/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import type { ForgotPasswordRequest } from '../models/ForgotPasswordRequest';
import type { GuardianRegisterRequest } from '../models/GuardianRegisterRequest';
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { MessageResponse } from '../models/MessageResponse';
import type { RefreshTokenRequest } from '../models/RefreshTokenRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { RegisterResponse } from '../models/RegisterResponse';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { TokenResponse } from '../models/TokenResponse';
import type { UserResponse } from '../models/UserResponse';
import type { UserUpdate } from '../models/UserUpdate';
import type { VerifyEmailRequest } from '../models/VerifyEmailRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
  /**
   * Register a new user
   * Register a new user account.
   *
   * - **email**: Valid email address
   * - **password**: Min 8 characters with uppercase, lowercase, and number
   * - **first_name**: User's first name
   * - **last_name**: User's last name
   * - **user_type**: Type of user (student, guardian, institution_admin, platform_admin)
   * @param requestBody
   * @returns RegisterResponse Successful Response
   * @throws ApiError
   */
  public static registerApiV1AuthRegisterPost(
    requestBody: RegisterRequest,
  ): CancelablePromise<RegisterResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/register',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Register a new Guardian
   * Register a new Guardian.
   * This automatically creates a User and triggers the Guardian profile creation.
   * @param requestBody
   * @returns RegisterResponse Successful Response
   * @throws ApiError
   */
  public static registerGuardianApiV1AuthRegisterGuardianPost(
    requestBody: GuardianRegisterRequest,
  ): CancelablePromise<RegisterResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/register/guardian',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Admin Create User
   * Create a new user account (Platform Admin only).
   *
   * This endpoint allows platform administrators to create user accounts
   * with any user type. The created user will receive a verification email.
   *
   * - **email**: Valid email address
   * - **password**: Min 8 characters with uppercase, lowercase, and number
   * - **first_name**: User's first name
   * - **last_name**: User's last name
   * - **user_type**: Type of user (student, guardian, institution_admin, platform_admin)
   * - **phone_number**: Optional phone number
   * - **date_of_birth**: Optional date of birth
   * - **username**: Optional username
   * @param requestBody
   * @returns RegisterResponse Successful Response
   * @throws ApiError
   */
  public static adminCreateUserApiV1AuthAdminCreateUserPost(
    requestBody: RegisterRequest,
  ): CancelablePromise<RegisterResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/admin/create-user',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Login to get access token
   * Authenticate user and get access tokens.
   *
   * - **email**: User's email address
   * - **password**: User's password
   * - **remember_me**: Keep user logged in for longer
   * @param requestBody
   * @returns LoginResponse Successful Response
   * @throws ApiError
   */
  public static loginApiV1AuthLoginPost(
    requestBody: LoginRequest,
  ): CancelablePromise<LoginResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/login',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Admin Login only
   * Authenticate administrative users only.
   * Restricts access for 'guardian' and 'student' types.
   * @param requestBody
   * @returns LoginResponse Successful Response
   * @throws ApiError
   */
  public static adminLoginApiV1AuthAdminLoginPost(
    requestBody: LoginRequest,
  ): CancelablePromise<LoginResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/admin/login',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Refresh access token
   * Get a new access token using refresh token.
   *
   * - **refresh_token**: Valid refresh token
   * @param requestBody
   * @returns TokenResponse Successful Response
   * @throws ApiError
   */
  public static refreshTokenApiV1AuthRefreshPost(
    requestBody: RefreshTokenRequest,
  ): CancelablePromise<TokenResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/refresh',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Logout user
   * Logout user by revoking refresh token.
   *
   * - **refresh_token**: Refresh token to revoke
   * @param requestBody
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static logoutApiV1AuthLogoutPost(
    requestBody: RefreshTokenRequest,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/logout',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Logout from all devices
   * Logout user from all devices by revoking all refresh tokens.
   * @returns SuccessResponse Successful Response
   * @throws ApiError
   */
  public static logoutAllDevicesApiV1AuthLogoutAllPost(): CancelablePromise<SuccessResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/logout-all',
    });
  }
  /**
   * Change user password
   * Change current user's password.
   *
   * - **current_password**: Current password
   * - **new_password**: New password (min 8 chars with requirements)
   * @param requestBody
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static changePasswordApiV1AuthChangePasswordPost(
    requestBody: ChangePasswordRequest,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/change-password',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get current user profile
   * Get current authenticated user's profile.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static getCurrentUserApiV1AuthMeGet(): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/auth/me',
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
  public static updateAccountApiV1AuthAccountUserIdPatch(
    userId: string,
    requestBody: UserUpdate,
  ): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/auth/account/{user_id}',
      path: {
        'user_id': userId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Request password reset
   * Request password reset link via email.
   * @param requestBody
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static forgotPasswordApiV1AuthForgotPasswordPost(
    requestBody: ForgotPasswordRequest,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/forgot-password',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Reset password with token
   * Reset password using reset token.
   * @param requestBody
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static resetPasswordApiV1AuthResetPasswordPost(
    requestBody: ResetPasswordRequest,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/reset-password',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Verify email address
   * Verify user's email address.
   * @param requestBody
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static verifyEmailApiV1AuthVerifyEmailPost(
    requestBody: VerifyEmailRequest,
  ): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/verify-email',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Resend verification email
   * Resend email verification link.
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static resendVerificationApiV1AuthResendVerificationPost(): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/resend-verification',
    });
  }
}
