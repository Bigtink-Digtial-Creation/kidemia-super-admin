/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_bulk_onboard_institutions_api_v1_admin_institutions_bulk_upload_post } from '../models/Body_bulk_onboard_institutions_api_v1_admin_institutions_bulk_upload_post';
import type { BulkInstitutionOnboardResult } from '../models/BulkInstitutionOnboardResult';
import type { InstitutionAdminDetail } from '../models/InstitutionAdminDetail';
import type { InstitutionAdminListItem } from '../models/InstitutionAdminListItem';
import type { InstitutionOnboardRequest } from '../models/InstitutionOnboardRequest';
import type { InstitutionOnboardResponse } from '../models/InstitutionOnboardResponse';
import type { InstitutionStatusUpdate } from '../models/InstitutionStatusUpdate';
import type { InstitutionTierUpdate } from '../models/InstitutionTierUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminInstitutionControlService {
  /**
   * Onboard Institution
   * Manually onboard a single institution.
   * Creates the Institution record + an owner User account in one transaction.
   * Optionally sends a welcome email with credentials.
   * @param requestBody
   * @returns InstitutionOnboardResponse Successful Response
   * @throws ApiError
   */
  public static onboardInstitutionApiV1AdminInstitutionsPost(
    requestBody: InstitutionOnboardRequest,
  ): CancelablePromise<InstitutionOnboardResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/admin/institutions',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * List Institutions
   * List all institutions with optional filtering. Admin only.
   * @param skip
   * @param limit
   * @param search Filter by name or code
   * @param tier Filter by tier
   * @param isPublic Filter by public status
   * @returns InstitutionAdminListItem Successful Response
   * @throws ApiError
   */
  public static listInstitutionsApiV1AdminInstitutionsListGet(
    skip?: number,
    limit: number = 50,
    search?: (string | null),
    tier?: (string | null),
    isPublic?: (boolean | null),
  ): CancelablePromise<Array<InstitutionAdminListItem>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/institutions/list',
      query: {
        'skip': skip,
        'limit': limit,
        'search': search,
        'tier': tier,
        'is_public': isPublic,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Institution Detail
   * Full detail view of a single institution. Admin only.
   * @param institutionId
   * @returns InstitutionAdminDetail Successful Response
   * @throws ApiError
   */
  public static getInstitutionDetailApiV1AdminInstitutionsInstitutionIdGet(
    institutionId: string,
  ): CancelablePromise<InstitutionAdminDetail> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/institutions/{institution_id}',
      path: {
        'institution_id': institutionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Download Institution Csv Template
   * Download the CSV template for bulk institution onboarding.
   * Includes two sample rows so admins know the expected format.
   * @returns any Successful Response
   * @throws ApiError
   */
  public static downloadInstitutionCsvTemplateApiV1AdminInstitutionsBulkCsvTemplateGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/institutions/bulk/csv-template',
    });
  }
  /**
   * Bulk Onboard Institutions
   * Bulk onboard institutions from a CSV file.
   * Each row creates one Institution + one owner User account.
   * Failed rows are reported in the response without aborting successful rows.
   * @param formData
   * @returns BulkInstitutionOnboardResult Successful Response
   * @throws ApiError
   */
  public static bulkOnboardInstitutionsApiV1AdminInstitutionsBulkUploadPost(
    formData: Body_bulk_onboard_institutions_api_v1_admin_institutions_bulk_upload_post,
  ): CancelablePromise<BulkInstitutionOnboardResult> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/admin/institutions/bulk/upload',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Toggle Institution Access
   * Enable or disable an institution entirely.
   * Disabled institutions cannot log in or use any features.
   * @param institutionId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static toggleInstitutionAccessApiV1AdminInstitutionsInstitutionIdAccessPatch(
    institutionId: string,
    requestBody: InstitutionStatusUpdate,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/admin/institutions/{institution_id}/access',
      path: {
        'institution_id': institutionId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Institution Tier
   * Change institution tier and student cap. Admin only.
   * @param institutionId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static updateInstitutionTierApiV1AdminInstitutionsInstitutionIdTierPatch(
    institutionId: string,
    requestBody: InstitutionTierUpdate,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/admin/institutions/{institution_id}/tier',
      path: {
        'institution_id': institutionId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Download Student Csv Template
   * Student bulk-upload CSV template (to share with onboarded institutions).
   * @returns any Successful Response
   * @throws ApiError
   */
  public static downloadStudentCsvTemplateApiV1AdminInstitutionsStudentCsvTemplateGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/institutions/student-csv-template',
    });
  }
}
