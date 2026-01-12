/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingCycle } from './BillingCycle';
/**
 * Schema for creating a promotion
 */
export type PromotionCreate = {
  promo_code: string;
  promo_name: string;
  description?: (string | null);
  applicable_plan_codes?: (Array<string> | null);
  /**
   * percentage, fixed_amount, trial_extension
   */
  discount_type: string;
  discount_value: (number | string);
  start_date: string;
  end_date?: (string | null);
  max_uses?: (number | null);
  max_uses_per_user?: number;
  min_billing_cycle?: (BillingCycle | null);
  new_users_only?: boolean;
  first_time_subscribers_only?: boolean;
  is_active?: boolean;
};

