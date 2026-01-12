/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response for payment initiation
 */
export type InitiatePaymentResponse = {
  transaction_id: string;
  transaction_reference: string;
  payment_url?: (string | null);
  authorization_code?: (string | null);
  access_code?: (string | null);
  expires_at?: (string | null);
};

