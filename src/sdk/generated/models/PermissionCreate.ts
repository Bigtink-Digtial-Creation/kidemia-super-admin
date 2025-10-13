/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
/**
 * Schema for creating a permission
 */
export type PermissionCreate = {
  name: string;
  display_name: string;
  description?: string | null;
  resource: string;
  action: string;
};
