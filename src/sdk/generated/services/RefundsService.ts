/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RefundRequest } from '../models/RefundRequest';
import type { RefundResponse } from '../models/RefundResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RefundsService {
  /**
   * Request refund
   * Request a refund for a transaction.
   *
   * - **transaction_id**: Transaction to refund
   * - **reason**: Reason for refund (min 10 characters)
   *
   * Refund requests are reviewed by admins.
   * @param requestBody
   * @returns RefundResponse Successful Response
   * @throws ApiError
   */
  public static requestRefundApiV1RefundsRequestPost(
    requestBody: RefundRequest,
  ): CancelablePromise<RefundResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/refunds/request',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get my refund requests
   * Get all refund requests by current user.
   * @param skip
   * @param limit
   * @returns RefundResponse Successful Response
   * @throws ApiError
   */
  public static getMyRefundsApiV1RefundsMyRefundsGet(
    skip?: number,
    limit: number = 20,
  ): CancelablePromise<Array<RefundResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/refunds/my-refunds',
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
   * Get pending refunds (Admin)
   * Get all pending refund requests. Requires payment:manage permission.
   * @param skip
   * @param limit
   * @returns RefundResponse Successful Response
   * @throws ApiError
   */
  public static getPendingRefundsApiV1RefundsPendingGet(
    skip?: number,
    limit: number = 20,
  ): CancelablePromise<Array<RefundResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/refunds/pending',
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
   * Approve refund (Admin)
   * Approve a refund request. Requires payment:manage permission.
   * @param refundId
   * @returns RefundResponse Successful Response
   * @throws ApiError
   */
  public static approveRefundApiV1RefundsRefundIdApprovePost(
    refundId: string,
  ): CancelablePromise<RefundResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/refunds/{refund_id}/approve',
      path: {
        'refund_id': refundId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Reject refund (Admin)
   * Reject a refund request. Requires payment:manage permission.
   * @param refundId
   * @param reason
   * @returns RefundResponse Successful Response
   * @throws ApiError
   */
  public static rejectRefundApiV1RefundsRefundIdRejectPost(
    refundId: string,
    reason: string,
  ): CancelablePromise<RefundResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/refunds/{refund_id}/reject',
      path: {
        'refund_id': refundId,
      },
      query: {
        'reason': reason,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
