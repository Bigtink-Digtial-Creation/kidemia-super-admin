/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingCycle } from './BillingCycle';
/**
 * Response schema for promotion
 */
export type PromotionResponse = {
  id: string;
  promo_code: string;
  promo_name: string;
  description?: (string | null);
  applicable_plan_codes?: (Array<string> | null);
  discount_type: string;
  discount_value: string;
  start_date: string;
  end_date?: (string | null);
  max_uses?: (number | null);
  max_uses_per_user: number;
  current_uses: number;
  min_billing_cycle?: (BillingCycle | null);
  new_users_only: boolean;
  first_time_subscribers_only: boolean;
  is_active: boolean;
  is_valid: boolean;
  created_at: string;
};

