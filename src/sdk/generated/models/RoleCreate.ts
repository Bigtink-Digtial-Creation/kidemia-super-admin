/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RoleType } from "./RoleType";
/**
 * Schema for creating a role
 */
export type RoleCreate = {
  name: string;
  display_name: string;
  description?: string | null;
  role_type: RoleType;
  permission_ids?: Array<string>;
};
