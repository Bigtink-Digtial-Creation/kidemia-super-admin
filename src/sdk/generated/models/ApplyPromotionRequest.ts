/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingCycle } from './BillingCycle';
/**
 * Request to apply a promotion code
 */
export type ApplyPromotionRequest = {
  promo_code: string;
  plan_code: string;
  billing_cycle: BillingCycle;
};

