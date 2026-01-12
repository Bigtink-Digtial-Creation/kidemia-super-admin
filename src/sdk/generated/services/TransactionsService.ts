/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InitiatePaymentRequest } from '../models/InitiatePaymentRequest';
import type { InitiatePaymentResponse } from '../models/InitiatePaymentResponse';
import type { TransactionResponse } from '../models/TransactionResponse';
import type { VerifyPaymentResponse } from '../models/VerifyPaymentResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TransactionsService {
  /**
   * Initiate payment
   * Initiate a payment transaction.
   *
   * - **assessment_id**: ID of exam to purchase
   * - **amount**: Amount to pay
   * - **payment_method**: CARD, BANK_TRANSFER, USSD, WALLET
   * - **callback_url**: URL to redirect after payment
   *
   * Returns payment URL for redirect to gateway.
   * @param requestBody
   * @returns InitiatePaymentResponse Successful Response
   * @throws ApiError
   */
  public static initiatePaymentApiV1TransactionsInitiatePost(
    requestBody: InitiatePaymentRequest,
  ): CancelablePromise<InitiatePaymentResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/transactions/initiate',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Verify payment
   * Verify a payment transaction.
   *
   * Called after payment gateway redirect or to check payment status.
   * @param transactionReference
   * @returns VerifyPaymentResponse Successful Response
   * @throws ApiError
   */
  public static verifyPaymentApiV1TransactionsVerifyTransactionReferenceGet(
    transactionReference: string,
  ): CancelablePromise<VerifyPaymentResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/transactions/verify/{transaction_reference}',
      path: {
        'transaction_reference': transactionReference,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get my transactions
   * Get transaction history for current user.
   * @param skip
   * @param limit
   * @returns TransactionResponse Successful Response
   * @throws ApiError
   */
  public static getMyTransactionsApiV1TransactionsMyTransactionsGet(
    skip?: number,
    limit: number = 20,
  ): CancelablePromise<Array<TransactionResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/transactions/my-transactions',
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
   * Get transaction details
   * Get details of a specific transaction.
   * @param transactionId
   * @returns TransactionResponse Successful Response
   * @throws ApiError
   */
  public static getTransactionApiV1TransactionsTransactionIdGet(
    transactionId: string,
  ): CancelablePromise<TransactionResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/transactions/{transaction_id}',
      path: {
        'transaction_id': transactionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Payment gateway webhook
   * Webhook endpoint for payment gateway callbacks.
   *
   * - **gateway**: paystack, stripe, flutterwave
   *
   * Automatically updates transaction status based on gateway events.
   * @param gateway
   * @returns any Successful Response
   * @throws ApiError
   */
  public static paymentWebhookApiV1TransactionsWebhookGatewayPost(
    gateway: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/transactions/webhook/{gateway}',
      path: {
        'gateway': gateway,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
