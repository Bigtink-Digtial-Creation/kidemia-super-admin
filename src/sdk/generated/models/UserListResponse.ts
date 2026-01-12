/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserListRole } from './UserListRole';
import type { UserType } from './UserType';
export type UserListResponse = {
  id: string;
  email: string;
  first_name: string;
  middle_name?: (string | null);
  last_name: string;
  phone_number?: (string | null);
  user_type: UserType;
  is_active: boolean;
  last_login: (string | null);
  role: (UserListRole | null);
  created_at: string;
};

