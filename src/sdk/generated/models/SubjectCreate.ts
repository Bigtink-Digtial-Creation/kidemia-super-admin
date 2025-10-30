/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for creating a subject
 */
export type SubjectCreate = {
  name: string;
  code: string;
  description?: string | null;
  icon_url?: string | null;
  color_code?: string | null;
  parent_id?: string | null;
  order?: number;
  is_active?: boolean;
  is_featured?: boolean;
};
