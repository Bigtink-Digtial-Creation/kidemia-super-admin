/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserType } from "./UserType";
/**
 * Schema for creating a user
 */
export type UserCreate = {
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  phone_number?: string | null;
  date_of_birth?: string | null;
  user_type: UserType;
  password: string;
  username?: string | null;
};
