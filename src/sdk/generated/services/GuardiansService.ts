/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddWardRequest } from '../models/AddWardRequest';
import type { ApproveCategoryChangeRequest } from '../models/ApproveCategoryChangeRequest';
import type { CategoryChangeRequest } from '../models/CategoryChangeRequest';
import type { CategoryChangeStatus } from '../models/CategoryChangeStatus';
import type { CreateAssessmentForWardsRequest } from '../models/CreateAssessmentForWardsRequest';
import type { GuardianUpdate } from '../models/GuardianUpdate';
import type { RemoveWardRequest } from '../models/RemoveWardRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GuardiansService {
  /**
   * Get My Guardian Profile
   * Get current user's guardian profile
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getMyGuardianProfileApiV1GuardiansMeGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/guardians/me',
    });
  }
  /**
   * Get Guardian Detail
   * Get guardian details with wards
   * @param guardianId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getGuardianDetailApiV1GuardiansGuardianIdGet(
    guardianId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/guardians/{guardian_id}',
      path: {
        'guardian_id': guardianId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Guardian
   * Update guardian profile
   * @param guardianId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static updateGuardianApiV1GuardiansGuardianIdPatch(
    guardianId: string,
    requestBody: GuardianUpdate,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/guardians/{guardian_id}',
      path: {
        'guardian_id': guardianId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get My Wards
   * Get all wards for a guardian
   * @param guardianId
   * @param skip
   * @param limit
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getMyWardsApiV1GuardiansGuardianIdWardsGet(
    guardianId: string,
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/guardians/{guardian_id}/wards',
      path: {
        'guardian_id': guardianId,
      },
      query: {
        'skip': skip,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Add Ward
   * Add a ward to guardian by email
   * @param guardianId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static addWardApiV1GuardiansGuardianIdWardsPost(
    guardianId: string,
    requestBody: AddWardRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/guardians/{guardian_id}/wards',
      path: {
        'guardian_id': guardianId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Remove Ward
   * Remove a ward from guardian
   * @param guardianId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static removeWardApiV1GuardiansGuardianIdWardsDelete(
    guardianId: string,
    requestBody: RemoveWardRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/guardians/{guardian_id}/wards',
      path: {
        'guardian_id': guardianId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Request Category Change
   * Request a category change for a ward
   * @param guardianId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static requestCategoryChangeApiV1GuardiansGuardianIdCategoryChangesPost(
    guardianId: string,
    requestBody: CategoryChangeRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/guardians/{guardian_id}/category-changes',
      path: {
        'guardian_id': guardianId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Category Change Requests
   * Get category change requests for guardian
   * @param guardianId
   * @param status
   * @param skip
   * @param limit
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getCategoryChangeRequestsApiV1GuardiansGuardianIdCategoryChangesGet(
    guardianId: (string | null),
    status?: (CategoryChangeStatus | null),
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/guardians/{guardian_id}/category-changes',
      path: {
        'guardian_id': guardianId,
      },
      query: {
        'status': status,
        'skip': skip,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Approve Category Change
   * Approve or reject a category change request
   * @param guardianId
   * @param requestId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static approveCategoryChangeApiV1GuardiansGuardianIdCategoryChangesRequestIdApprovePost(
    guardianId: string,
    requestId: string,
    requestBody: ApproveCategoryChangeRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/guardians/{guardian_id}/category-changes/{request_id}/approve',
      path: {
        'guardian_id': guardianId,
        'request_id': requestId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Student Category
   * Student endpoint: Updates category directly if no guardian exists,
   * otherwise creates a pending request.
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static updateStudentCategoryApiV1GuardiansRequestCategoryUpdatePost(
    requestBody: CategoryChangeRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/guardians/request-category-update',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Latest Category Change
   * Get only the most recent category change request for a specific ward
   * @param wardId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getLatestCategoryChangeApiV1GuardiansLatestCategoryChangeWardIdGet(
    wardId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/guardians/latest-category-change/{ward_id}',
      path: {
        'ward_id': wardId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Ward Performance Report
   * Get performance report for a specific ward
   * @param guardianId
   * @param wardId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getWardPerformanceReportApiV1GuardiansGuardianIdWardsWardIdReportGet(
    guardianId: string,
    wardId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/guardians/{guardian_id}/wards/{ward_id}/report',
      path: {
        'guardian_id': guardianId,
        'ward_id': wardId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Ward Detailed Stats
   * Get detailed performance statistics for a ward (tests, exams, charts, history)
   * @param guardianId
   * @param wardId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getWardDetailedStatsApiV1GuardiansGuardianIdWardsWardIdStatsGet(
    guardianId: string,
    wardId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/guardians/{guardian_id}/wards/{ward_id}/stats',
      path: {
        'guardian_id': guardianId,
        'ward_id': wardId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Comprehensive Report
   * Get comprehensive report for all wards
   * @param guardianId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getComprehensiveReportApiV1GuardiansGuardianIdComprehensiveReportGet(
    guardianId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/guardians/{guardian_id}/comprehensive-report',
      path: {
        'guardian_id': guardianId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Create And Assign Assessment
   * Create auto-generated assessment and assign to wards
   * @param guardianId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static createAndAssignAssessmentApiV1GuardiansGuardianIdAssessmentsPost(
    guardianId: string,
    requestBody: CreateAssessmentForWardsRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/guardians/{guardian_id}/assessments',
      path: {
        'guardian_id': guardianId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Ward Assignments
   * Get assessment assignments for guardian's wards
   * @param guardianId
   * @param wardId
   * @param status
   * @param skip
   * @param limit
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getWardAssignmentsApiV1GuardiansGuardianIdAssignmentsGet(
    guardianId: string,
    wardId?: (string | null),
    status?: (string | null),
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/guardians/{guardian_id}/assignments',
      path: {
        'guardian_id': guardianId,
      },
      query: {
        'ward_id': wardId,
        'status': status,
        'skip': skip,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Assignment Detail
   * @param assignmentId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getAssignmentDetailApiV1GuardiansAssignmentsAssignmentIdGet(
    assignmentId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/guardians/assignments/{assignment_id}',
      path: {
        'assignment_id': assignmentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Guardian Subscription
   * Get subscription details for guardian
   * @param guardianId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getGuardianSubscriptionApiV1GuardiansGuardianIdSubscriptionGet(
    guardianId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/guardians/{guardian_id}/subscription',
      path: {
        'guardian_id': guardianId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Check Subscription Limits
   * Check subscription limits for wards
   * @param guardianId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static checkSubscriptionLimitsApiV1GuardiansGuardianIdSubscriptionLimitsGet(
    guardianId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/guardians/{guardian_id}/subscription/limits',
      path: {
        'guardian_id': guardianId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
