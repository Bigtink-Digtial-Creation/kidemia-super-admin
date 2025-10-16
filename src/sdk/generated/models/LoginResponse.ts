/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { UserResponse } from "./UserResponse";
/**
 * Schema for login response
 */
export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in: number;
  user: UserResponse;
};
