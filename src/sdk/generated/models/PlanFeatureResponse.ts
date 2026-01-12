/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response schema for feature
 */
export type PlanFeatureResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  feature_code: string;
  feature_name: string;
  description?: (string | null);
  icon?: (string | null);
  category?: (string | null);
  is_active: boolean;
  display_order: number;
  requires_value: boolean;
  default_value?: (Record<string, any> | null);
};

