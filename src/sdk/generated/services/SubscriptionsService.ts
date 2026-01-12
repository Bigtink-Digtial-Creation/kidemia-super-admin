/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddMemberRequest } from '../models/AddMemberRequest';
import type { RemoveMemberRequest } from '../models/RemoveMemberRequest';
import type { SubscriptionCancelRequest } from '../models/SubscriptionCancelRequest';
import type { SubscriptionCreate } from '../models/SubscriptionCreate';
import type { SubscriptionUpgradeRequest } from '../models/SubscriptionUpgradeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubscriptionsService {
  /**
   * Start Subscription Checkout
   * Returns Paystack payment URL for redirect.
   * This is the main entry point for recurring payment
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static startSubscriptionCheckoutApiV1SubscriptionsCheckoutPost(
    requestBody: SubscriptionCreate,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions/checkout',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Verify Subscription Payment
   * Creates Paystack subscription for automatic renewals.
   * @param reference
   * @returns any Successful Response
   * @throws ApiError
   */
  public static verifySubscriptionPaymentApiV1SubscriptionsVerifyReferencePost(
    reference: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions/verify/{reference}',
      path: {
        'reference': reference,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get My Subscriptions
   * Get all subscriptions for current user (as owner or member)
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getMySubscriptionsApiV1SubscriptionsGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscriptions',
    });
  }
  /**
   * Get Subscription
   * Get subscription details with members
   * @param subscriptionId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getSubscriptionApiV1SubscriptionsSubscriptionIdGet(
    subscriptionId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscriptions/{subscription_id}',
      path: {
        'subscription_id': subscriptionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Pause Subscription
   * Pause subscription (stops future Paystack charges)
   * Access continues until end of current period.
   * @param subscriptionId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static pauseSubscriptionApiV1SubscriptionsSubscriptionIdPausePost(
    subscriptionId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions/{subscription_id}/pause',
      path: {
        'subscription_id': subscriptionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Resume Subscription
   * Resume a paused subscription (restart Paystack charges)
   * @param subscriptionId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static resumeSubscriptionApiV1SubscriptionsSubscriptionIdResumePost(
    subscriptionId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions/{subscription_id}/resume',
      path: {
        'subscription_id': subscriptionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Cancel Subscription
   * Cancel subscription (stops Paystack recurring charges).
   *
   * If cancel_immediately=False: Access continues until end of current period
   * If cancel_immediately=True: Access ends immediately
   * @param subscriptionId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static cancelSubscriptionApiV1SubscriptionsSubscriptionIdCancelPost(
    subscriptionId: string,
    requestBody: SubscriptionCancelRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions/{subscription_id}/cancel',
      path: {
        'subscription_id': subscriptionId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Upgrade Subscription
   * Upgrade or downgrade subscription with proration.
   *
   * This will:
   * 1. Calculate prorated amount
   * 2. Charge difference (if upgrade) or credit (if downgrade)
   * 3. Update Paystack subscription plan
   * 4. Update internal subscription
   * @param subscriptionId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static upgradeSubscriptionApiV1SubscriptionsSubscriptionIdUpgradePost(
    subscriptionId: string,
    requestBody: SubscriptionUpgradeRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions/{subscription_id}/upgrade',
      path: {
        'subscription_id': subscriptionId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Add Member
   * Add a member (ward/student) to subscription.
   * Only subscription owner can add members.
   * @param subscriptionId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static addMemberApiV1SubscriptionsSubscriptionIdMembersPost(
    subscriptionId: string,
    requestBody: AddMemberRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/subscriptions/{subscription_id}/members',
      path: {
        'subscription_id': subscriptionId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Remove Member
   * Remove a member from subscription.
   * Only subscription owner can remove members.
   * @param subscriptionId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static removeMemberApiV1SubscriptionsSubscriptionIdMembersDelete(
    subscriptionId: string,
    requestBody: RemoveMemberRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/subscriptions/{subscription_id}/members',
      path: {
        'subscription_id': subscriptionId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Usage Stats
   * Get usage statistics for subscription
   * @param subscriptionId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getUsageStatsApiV1SubscriptionsSubscriptionIdUsageGet(
    subscriptionId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscriptions/{subscription_id}/usage',
      path: {
        'subscription_id': subscriptionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Check Feature Access
   * Check if current user has access to a specific feature
   * @param feature
   * @returns any Successful Response
   * @throws ApiError
   */
  public static checkFeatureAccessApiV1SubscriptionsCheckFeatureFeatureGet(
    feature: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscriptions/check/feature/{feature}',
      path: {
        'feature': feature,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Check Usage Limit
   * Check if current user has exceeded usage limits
   * @param activityType
   * @returns any Successful Response
   * @throws ApiError
   */
  public static checkUsageLimitApiV1SubscriptionsCheckLimitActivityTypeGet(
    activityType: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscriptions/check/limit/{activity_type}',
      path: {
        'activity_type': activityType,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Available Plans
   * Get all available subscription plans with pricing
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getAvailablePlansApiV1SubscriptionsPlansAvailableGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/subscriptions/plans/available',
    });
  }
}
