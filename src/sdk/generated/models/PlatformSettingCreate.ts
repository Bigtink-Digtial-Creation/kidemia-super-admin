/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlatformSettingCreate = {
  /**
   * Unique setting key
   */
  key: string;
  /**
   * Setting value
   */
  value?: (string | null);
  /**
   * Setting category
   */
  category: string;
  /**
   * Setting description
   */
  description?: (string | null);
  /**
   * Whether this is sensitive data
   */
  is_secret?: boolean;
  /**
   * Whether this setting is active
   */
  is_active?: boolean;
};

