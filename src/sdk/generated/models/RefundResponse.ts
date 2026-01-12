/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RefundStatus } from './RefundStatus';
/**
 * Schema for refund response
 */
export type RefundResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  refund_reference: string;
  transaction_id: string;
  status: RefundStatus;
  amount: string;
  currency: string;
  reason: string;
  requested_at: string;
  approved_at: (string | null);
  completed_at: (string | null);
};

