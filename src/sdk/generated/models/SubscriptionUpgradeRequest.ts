/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for upgrading subscription with improved validation
 */
export type SubscriptionUpgradeRequest = {
  /**
   * New plan code to upgrade to
   */
  new_plan: string;
  callback_url: string;
};

