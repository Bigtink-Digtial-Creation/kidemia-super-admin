/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to transfer from wallet
 */
export type WalletTransferRequest = {
  recipient_id: string;
  amount: (number | string);
  pin: string;
  description?: (string | null);
};

