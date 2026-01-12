/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionPlanType } from './SubscriptionPlanType';
import type { SubscriptionType } from './SubscriptionType';
/**
 * Public-facing plan display for pricing page
 */
export type PublicPlanDisplay = {
  plan_code: string;
  plan_name: string;
  plan_type: SubscriptionPlanType;
  subscription_type: SubscriptionType;
  tagline?: (string | null);
  short_description?: (string | null);
  price_monthly: string;
  price_yearly: string;
  yearly_discount_percentage: number;
  yearly_savings: number;
  effective_monthly_price_yearly: number;
  max_members?: (number | null);
  trial_days: number;
  features: Record<string, any>;
  benefits_list?: (Array<string> | null);
  is_featured: boolean;
  is_popular: boolean;
  currency: string;
};

