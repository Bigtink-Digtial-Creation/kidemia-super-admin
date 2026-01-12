/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentMethod } from './PaymentMethod';
/**
 * Request to top up wallet
 */
export type WalletTopupRequest = {
  amount: (number | string);
  payment_method: PaymentMethod;
};

