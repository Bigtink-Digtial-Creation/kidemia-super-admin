/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

/**
 * Schema for category configuration response
 */
export type CategoryConfigResponse = {
  created_at: string;
  updated_at: string;
  id: string;
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
  assessments_count?: number;
};
