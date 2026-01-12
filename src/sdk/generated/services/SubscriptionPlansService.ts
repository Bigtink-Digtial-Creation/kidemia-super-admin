/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplyPromotionRequest } from '../models/ApplyPromotionRequest';
import type { PublicPlanDisplay } from '../models/PublicPlanDisplay';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubscriptionPlansService {
  /**
   * Get Pricing Plans
   * Get subscription plans for public display on pricing page.
   *
   * Query params:
   * - for_individuals: Show plans suitable for individual students
   * - for_guardians: Show plans suitable for guardians/parents
   * - for_institutions: Show plans suitable for schools/institutions
   * @param forIndividuals
   * @param forGuardians
   * @param forInstitutions
   * @returns PublicPlanDisplay Successful Response
   * @throws ApiError
   */
  public static getPricingPlansApiV1SubscriptionPlansPricingGet(
    forIndividuals: boolean = false,
    forGuardians: boolean = false,
    forInstitutions: boolean = false,
  ): CancelablePromise<Array<PublicPlanDisplay>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscription-plans/pricing',
      query: {
        'for_individuals': forIndividuals,
        'for_guardians': forGuardians,
        'for_institutions': forInstitutions,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Plan Details
   * Get detailed information about a specific plan
   * @param planCode
   * @returns PublicPlanDisplay Successful Response
   * @throws ApiError
   */
  public static getPlanDetailsApiV1SubscriptionPlansPlanCodeGet(
    planCode: string,
  ): CancelablePromise<PublicPlanDisplay> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscription-plans/{plan_code}',
      path: {
        'plan_code': planCode,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Validate Promotion
   * Validate a promotion code and calculate discount.
   * Requires authentication to prevent abuse.
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static validatePromotionApiV1SubscriptionPlansPromotionsValidatePost(
    requestBody: ApplyPromotionRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscription-plans/promotions/validate',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Compare Plans
   * Compare multiple plans side by side.
   *
   * Example: /compare/plans?plan_codes=student,family,institution
   * @param planCodes
   * @returns any Successful Response
   * @throws ApiError
   */
  public static comparePlansApiV1SubscriptionPlansComparePlansGet(
    planCodes: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscription-plans/compare/plans',
      query: {
        'plan_codes': planCodes,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
