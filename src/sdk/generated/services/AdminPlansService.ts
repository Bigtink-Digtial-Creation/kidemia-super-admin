/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlanConfigCreate } from '../models/PlanConfigCreate';
import type { PlanConfigResponse } from '../models/PlanConfigResponse';
import type { PlanConfigUpdate } from '../models/PlanConfigUpdate';
import type { PlanFeatureCreate } from '../models/PlanFeatureCreate';
import type { PlanFeatureResponse } from '../models/PlanFeatureResponse';
import type { PromotionCreate } from '../models/PromotionCreate';
import type { PromotionResponse } from '../models/PromotionResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminPlansService {
  /**
   * Get All Plans Admin
   * Get all plans (including inactive ones).
   * Admin view with full details.
   * @returns PlanConfigResponse Successful Response
   * @throws ApiError
   */
  public static getAllPlansAdminApiV1AdminManageSubscriptionPlansGet(): CancelablePromise<Array<PlanConfigResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/manage/subscription-plans',
    });
  }
  /**
   * Create Plan
   * Create a new subscription plan.
   * Only accessible by admin users.
   * @param requestBody
   * @returns PlanConfigResponse Successful Response
   * @throws ApiError
   */
  public static createPlanApiV1AdminManageSubscriptionPlansPost(
    requestBody: PlanConfigCreate,
  ): CancelablePromise<PlanConfigResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/admin/manage/subscription-plans',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Plan By Id
   * Get plan details by ID
   * @param planId
   * @returns PlanConfigResponse Successful Response
   * @throws ApiError
   */
  public static getPlanByIdApiV1AdminManageSubscriptionPlansPlanPlanIdGet(
    planId: string,
  ): CancelablePromise<PlanConfigResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/manage/subscription-plans/plan/{plan_id}',
      path: {
        'plan_id': planId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Plan
   * Update an existing plan
   * @param planId
   * @param requestBody
   * @returns PlanConfigResponse Successful Response
   * @throws ApiError
   */
  public static updatePlanApiV1AdminManageSubscriptionPlansPlanPlanIdPut(
    planId: string,
    requestBody: PlanConfigUpdate,
  ): CancelablePromise<PlanConfigResponse> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/admin/manage/subscription-plans/plan/{plan_id}',
      path: {
        'plan_id': planId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Plan
   * Soft delete a plan (deactivates it)
   * @param planId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deletePlanApiV1AdminManageSubscriptionPlansPlanPlanIdDelete(
    planId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/admin/manage/subscription-plans/plan/{plan_id}',
      path: {
        'plan_id': planId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Create Feature
   * Create a new reusable feature
   * @param requestBody
   * @returns PlanFeatureResponse Successful Response
   * @throws ApiError
   */
  public static createFeatureApiV1AdminManageSubscriptionPlansFeaturesCreatePost(
    requestBody: PlanFeatureCreate,
  ): CancelablePromise<PlanFeatureResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/admin/manage/subscription-plans/features/create',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get All Features
   * Get all available features
   * @returns PlanFeatureResponse Successful Response
   * @throws ApiError
   */
  public static getAllFeaturesApiV1AdminManageSubscriptionPlansFeaturesGet(): CancelablePromise<Array<PlanFeatureResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/manage/subscription-plans/features',
    });
  }
  /**
   * Get Active Promotions
   * Get all active promotions
   * @returns PromotionResponse Successful Response
   * @throws ApiError
   */
  public static getActivePromotionsApiV1AdminManageSubscriptionPlansPromotionsGet(): CancelablePromise<Array<PromotionResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/admin/manage/subscription-plans/promotions',
    });
  }
  /**
   * Create Promotion
   * Create a new promotion/discount code
   * @param requestBody
   * @returns PromotionResponse Successful Response
   * @throws ApiError
   */
  public static createPromotionApiV1AdminManageSubscriptionPlansPromotionsPost(
    requestBody: PromotionCreate,
  ): CancelablePromise<PromotionResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/admin/manage/subscription-plans/promotions',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Promotion
   * Update an existing promotion code
   * @param promotionId
   * @param requestBody
   * @returns PromotionResponse Successful Response
   * @throws ApiError
   */
  public static updatePromotionApiV1AdminManageSubscriptionPlansPromotionsPromotionIdPut(
    promotionId: string,
    requestBody: PromotionCreate,
  ): CancelablePromise<PromotionResponse> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/admin/manage/subscription-plans/promotions/{promotion_id}',
      path: {
        'promotion_id': promotionId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Promotion
   * Soft delete a promotion code
   * @param promotionId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deletePromotionApiV1AdminManageSubscriptionPlansPromotionsPromotionIdDelete(
    promotionId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/admin/manage/subscription-plans/promotions/{promotion_id}',
      path: {
        'promotion_id': promotionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Toggle Promotion Status
   * Enable or disable a promotion code
   * @param promotionId
   * @returns PromotionResponse Successful Response
   * @throws ApiError
   */
  public static togglePromotionStatusApiV1AdminManageSubscriptionPlansPromotionsPromotionIdTogglePatch(
    promotionId: string,
  ): CancelablePromise<PromotionResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/admin/manage/subscription-plans/promotions/{promotion_id}/toggle',
      path: {
        'promotion_id': promotionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
