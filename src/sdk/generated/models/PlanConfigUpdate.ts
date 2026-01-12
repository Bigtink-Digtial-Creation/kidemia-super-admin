/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for updating a plan
 */
export type PlanConfigUpdate = {
  plan_name?: (string | null);
  description?: (string | null);
  short_description?: (string | null);
  tagline?: (string | null);
  price_monthly?: (number | string | null);
  price_quarterly?: (number | string | null);
  price_yearly?: (number | string | null);
  monthly_discount_percentage?: (number | null);
  quarterly_discount_percentage?: (number | null);
  yearly_discount_percentage?: (number | null);
  max_members?: (number | null);
  trial_days?: (number | null);
  features?: (Record<string, any> | null);
  limits?: (Record<string, any> | null);
  is_active?: (boolean | null);
  is_featured?: (boolean | null);
  is_popular?: (boolean | null);
  display_order?: (number | null);
  is_visible?: (boolean | null);
  show_for_individuals?: (boolean | null);
  show_for_guardians?: (boolean | null);
  show_for_institutions?: (boolean | null);
  can_upgrade_to?: (Array<string> | null);
  can_downgrade_to?: (Array<string> | null);
  meta_data?: (Record<string, any> | null);
  terms_url?: (string | null);
  benefits_list?: (Array<string> | null);
};

