/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentGateway } from './PaymentGateway';
import type { PaymentMethod } from './PaymentMethod';
import type { TransactionStatus } from './TransactionStatus';
import type { TransactionType } from './TransactionType';
/**
 * Schema for transaction response
 */
export type TransactionResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  transaction_type: TransactionType;
  amount: string;
  currency?: string;
  payment_method: PaymentMethod;
  payment_gateway: PaymentGateway;
  description?: (string | null);
  transaction_reference: string;
  status: TransactionStatus;
  user_id: string;
  institution_id: (string | null);
  platform_fee: string;
  gateway_fee: string;
  total_amount: string;
  net_amount: (string | null);
  gateway_reference: (string | null);
  card_last4: (string | null);
  card_brand: (string | null);
  assessment_id: (string | null);
  subscription_id: (string | null);
  initiated_at: string;
  completed_at: (string | null);
  is_reconciled: boolean;
};

