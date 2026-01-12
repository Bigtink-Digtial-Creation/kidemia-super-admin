/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionPlanType } from './SubscriptionPlanType';
import type { SubscriptionType } from './SubscriptionType';
/**
 * Schema for creating a new plan
 */
export type PlanConfigCreate = {
  /**
   * Unique plan identifier
   */
  plan_code: string;
  plan_name: string;
  plan_type: SubscriptionPlanType;
  subscription_type: SubscriptionType;
  description?: (string | null);
  short_description?: (string | null);
  tagline?: (string | null);
  price_monthly: (number | string);
  price_quarterly?: (number | string | null);
  price_yearly: (number | string);
  monthly_discount_percentage?: number;
  quarterly_discount_percentage?: number;
  yearly_discount_percentage?: number;
  currency?: string;
  max_members?: (number | null);
  trial_days?: number;
  features?: Record<string, any>;
  limits?: Record<string, any>;
  is_active?: boolean;
  is_featured?: boolean;
  is_popular?: boolean;
  display_order?: number;
  is_visible?: boolean;
  show_for_individuals?: boolean;
  show_for_guardians?: boolean;
  show_for_institutions?: boolean;
  can_upgrade_to?: (Array<string> | null);
  can_downgrade_to?: (Array<string> | null);
  meta_data?: (Record<string, any> | null);
  terms_url?: (string | null);
  benefits_list?: (Array<string> | null);
};

