/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlatformSettingCreate } from '../models/PlatformSettingCreate';
import type { PlatformSettingPublic } from '../models/PlatformSettingPublic';
import type { PlatformSettingResponse } from '../models/PlatformSettingResponse';
import type { PlatformSettingUpdate } from '../models/PlatformSettingUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlatformSettingsService {
  /**
   * Get Settings
   * Get all platform settings (secrets are masked)
   * @param category
   * @returns PlatformSettingPublic Successful Response
   * @throws ApiError
   */
  public static getSettingsApiV1SettingsSettingsGet(
    category?: (string | null),
  ): CancelablePromise<Array<PlatformSettingPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/settings/settings',
      query: {
        'category': category,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Create Setting
   * Create a new platform setting
   * @param requestBody
   * @returns PlatformSettingResponse Successful Response
   * @throws ApiError
   */
  public static createSettingApiV1SettingsSettingsPost(
    requestBody: PlatformSettingCreate,
  ): CancelablePromise<PlatformSettingResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/settings/settings',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Setting
   * Get a specific setting
   * @param settingId
   * @returns PlatformSettingPublic Successful Response
   * @throws ApiError
   */
  public static getSettingApiV1SettingsSettingsSettingIdGet(
    settingId: string,
  ): CancelablePromise<PlatformSettingPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/settings/settings/{setting_id}',
      path: {
        'setting_id': settingId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Setting
   * Update a platform setting
   * @param settingId
   * @param requestBody
   * @returns PlatformSettingResponse Successful Response
   * @throws ApiError
   */
  public static updateSettingApiV1SettingsSettingsSettingIdPut(
    settingId: string,
    requestBody: PlatformSettingUpdate,
  ): CancelablePromise<PlatformSettingResponse> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/settings/settings/{setting_id}',
      path: {
        'setting_id': settingId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Setting
   * Delete a platform setting
   * @param settingId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteSettingApiV1SettingsSettingsSettingIdDelete(
    settingId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/settings/settings/{setting_id}',
      path: {
        'setting_id': settingId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Setting By Key
   * Get a setting by its key
   * @param key
   * @returns PlatformSettingPublic Successful Response
   * @throws ApiError
   */
  public static getSettingByKeyApiV1SettingsSettingsKeyKeyGet(
    key: string,
  ): CancelablePromise<PlatformSettingPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/settings/settings/key/{key}',
      path: {
        'key': key,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Categories
   * Get list of all setting categories
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getCategoriesApiV1SettingsSettingsCategoriesListGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/settings/settings/categories/list',
    });
  }
}
