/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for creating a feature
 */
export type PlanFeatureCreate = {
  feature_code: string;
  feature_name: string;
  description?: (string | null);
  icon?: (string | null);
  category?: (string | null);
  is_active?: boolean;
  display_order?: number;
  requires_value?: boolean;
  default_value?: (Record<string, any> | null);
};

