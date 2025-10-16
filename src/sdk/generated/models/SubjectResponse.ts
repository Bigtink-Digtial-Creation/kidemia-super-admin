/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

/**
 * Schema for subject response
 */
export type SubjectResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  name: string;
  code: string;
  description?: string | null;
  icon_url?: string | null;
  color_code?: string | null;
  parent_id?: string | null;
  order?: number;
  is_active?: boolean;
  is_featured?: boolean;
  topics_count?: number;
  questions_count?: number;
};
