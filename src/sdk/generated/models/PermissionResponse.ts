/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

/**
 * Schema for permission response
 */
export type PermissionResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  name: string;
  display_name: string;
  description?: string | null;
  resource: string;
  action: string;
};
