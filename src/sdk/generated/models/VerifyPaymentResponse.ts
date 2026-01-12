/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransactionStatus } from './TransactionStatus';
/**
 * Response for payment verification
 */
export type VerifyPaymentResponse = {
  transaction_id: string;
  status: TransactionStatus;
  amount: string;
  message: string;
  access_granted?: boolean;
};

