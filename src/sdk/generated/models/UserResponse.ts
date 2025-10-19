/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { RoleResponse } from "./RoleResponse";
import type { UserType } from "./UserType";
/**
 * Schema for user response
 */
export type UserResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  phone_number?: string | null;
  date_of_birth?: string | null;
  user_type: UserType;
  username: string | null;
  is_active: boolean;
  is_verified: boolean;
  is_email_verified: boolean;
  profile_picture_url: string | null;
  bio: string | null;
  language: string;
  timezone: string;
  last_login: string | null;
  roles?: Array<RoleResponse>;
};
