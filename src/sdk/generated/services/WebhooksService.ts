/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhooksService {
  /**
   * Paystack Webhook
   * Paystack webhook endpoint for handling payment and subscription events.
   *
   * Important events:
   * - charge.success: One-time payment successful
   * - subscription.create: Subscription created
   * - invoice.create: Invoice created (upcoming charge)
   * - invoice.update: Invoice updated (payment processed)
   * - invoice.payment_failed: Payment failed
   * - subscription.disable: Subscription disabled/cancelled
   * @returns any Successful Response
   * @throws ApiError
   */
  public static paystackWebhookApiV1WebhooksPaystackPost(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/webhooks/paystack',
    });
  }
  /**
   * Test Paystack Webhook
   * Test endpoint to verify webhook is reachable
   * @returns any Successful Response
   * @throws ApiError
   */
  public static testPaystackWebhookApiV1WebhooksPaystackTestGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/webhooks/paystack/test',
    });
  }
}
