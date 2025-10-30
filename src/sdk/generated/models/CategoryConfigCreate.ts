/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for creating category configuration
 */
export type CategoryConfigCreate = {
  category_name: string;
  display_name: string;
  description?: string | null;
  icon_url?: string | null;
  color_code?: string | null;
  banner_url?: string | null;
  is_active?: boolean;
  requires_payment?: boolean;
  order?: number;
  exam_body?: string | null;
  target_level?: string | null;
};
