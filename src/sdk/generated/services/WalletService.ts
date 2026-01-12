/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WalletResponse } from '../models/WalletResponse';
import type { WalletTopupRequest } from '../models/WalletTopupRequest';
import type { WalletTransferRequest } from '../models/WalletTransferRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WalletService {
  /**
   * Get my wallet
   * Get wallet balance and details.
   * @returns WalletResponse Successful Response
   * @throws ApiError
   */
  public static getMyWalletApiV1WalletGet(): CancelablePromise<WalletResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/wallet/',
    });
  }
  /**
   * Top up wallet
   * Top up wallet balance.
   *
   * Initiates payment gateway transaction.
   * Wallet credited after successful payment.
   * @param requestBody
   * @returns WalletResponse Successful Response
   * @throws ApiError
   */
  public static topupWalletApiV1WalletTopupPost(
    requestBody: WalletTopupRequest,
  ): CancelablePromise<WalletResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/wallet/topup',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Transfer from wallet
   * Transfer money from wallet to another user.
   *
   * Requires wallet PIN for security.
   * @param requestBody
   * @returns WalletResponse Successful Response
   * @throws ApiError
   */
  public static walletTransferApiV1WalletTransferPost(
    requestBody: WalletTransferRequest,
  ): CancelablePromise<WalletResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/wallet/transfer',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
