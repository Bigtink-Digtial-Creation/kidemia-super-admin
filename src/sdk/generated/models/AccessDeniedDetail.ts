/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccessDeniedDetail = {
  allowed?: boolean;
  /**
   * Why access was denied
   */
  reason: string;
  /**
   * Action for the user to take
   */
  suggestion?: (string | null);
  /**
   * Access method: 'wallet' or 'subscription'
   */
  method?: (string | null);
  wallet_balance?: (number | null);
  cost?: (number | null);
  subscription_id?: (string | null);
};

