/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PermissionResponse } from "./PermissionResponse";
import type { RoleType } from "./RoleType";
/**
 * Schema for role response
 */
export type RoleResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  name: string;
  display_name: string;
  description?: string | null;
  role_type: RoleType;
  is_system: boolean;
  permissions?: Array<PermissionResponse>;
};
