/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingCycle } from './BillingCycle';
/**
 * Schema for creating a subscription
 */
export type SubscriptionCreate = {
  /**
   * Plan code (e.g., 'student', 'family')
   */
  plan: string;
  billing_cycle: BillingCycle;
  auto_renew?: boolean;
  institution_id?: (string | null);
  promo_code?: (string | null);
  callback_url: string;
};

