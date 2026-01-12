/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Public response that masks secret values
 */
export type PlatformSettingPublic = {
  id: string;
  key: string;
  value: (string | null);
  category: string;
  description: (string | null);
  is_secret: boolean;
  is_active: boolean;
  created_at: string;
};

