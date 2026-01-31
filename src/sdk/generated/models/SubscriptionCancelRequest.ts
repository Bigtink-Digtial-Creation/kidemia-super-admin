/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for cancelling subscription
 */
export type SubscriptionCancelRequest = {
  /**
   * Reason for cancellation
   */
  reason?: (string | null);
  /**
   * If True, cancel immediately. If False, cancel at end of billing period
   */
  cancel_immediately?: boolean;
};

