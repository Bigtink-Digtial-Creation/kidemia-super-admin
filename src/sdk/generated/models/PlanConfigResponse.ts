/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionPlanType } from './SubscriptionPlanType';
import type { SubscriptionType } from './SubscriptionType';
/**
 * Response schema for plan configuration
 */
export type PlanConfigResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  plan_code: string;
  plan_name: string;
  plan_type: SubscriptionPlanType;
  subscription_type: SubscriptionType;
  description?: (string | null);
  short_description?: (string | null);
  tagline?: (string | null);
  price_monthly: string;
  price_quarterly?: (string | null);
  price_yearly: string;
  monthly_discount_percentage: number;
  quarterly_discount_percentage: number;
  yearly_discount_percentage: number;
  currency: string;
  max_members?: (number | null);
  trial_days: number;
  features: Record<string, any>;
  limits: Record<string, any>;
  is_active: boolean;
  is_featured: boolean;
  is_popular: boolean;
  display_order: number;
  is_visible: boolean;
  show_for_individuals: boolean;
  show_for_guardians: boolean;
  show_for_institutions: boolean;
  can_upgrade_to?: (Array<string> | null);
  can_downgrade_to?: (Array<string> | null);
  meta_data?: (Record<string, any> | null);
  terms_url?: (string | null);
  benefits_list?: (Array<string> | null);
  monthly_savings: number;
  yearly_savings: number;
  effective_monthly_price_yearly: number;
};

