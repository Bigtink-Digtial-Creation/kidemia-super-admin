/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_update_avatar_api_v1_api_upload_account_avatar_patch } from '../models/Body_update_avatar_api_v1_api_upload_account_avatar_patch';
import type { Body_upload_badge_image_api_v1_api_upload_badges_post } from '../models/Body_upload_badge_image_api_v1_api_upload_badges_post';
import type { Body_upload_file_api_v1_api_upload_file_post } from '../models/Body_upload_file_api_v1_api_upload_file_post';
import type { Body_upload_question_image_api_v1_api_upload_questions_post } from '../models/Body_upload_question_image_api_v1_api_upload_questions_post';
import type { UploadResponse } from '../models/UploadResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UploadService {
  /**
   * Upload user avatar
   * Update user avatar with automatic old avatar deletion
   * @param formData
   * @returns UploadResponse Successful Response
   * @throws ApiError
   */
  public static updateAvatarApiV1ApiUploadAccountAvatarPatch(
    formData: Body_update_avatar_api_v1_api_upload_account_avatar_patch,
  ): CancelablePromise<UploadResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/api/upload/account/avatar',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `Invalid file`,
        422: `Validation Error`,
        500: `Server error`,
      },
    });
  }
  /**
   * Upload question image
   * Uploads an image specifically for an assessment question. Stored in 'questions/' folder.
   * @param formData
   * @returns UploadResponse Successful Response
   * @throws ApiError
   */
  public static uploadQuestionImageApiV1ApiUploadQuestionsPost(
    formData: Body_upload_question_image_api_v1_api_upload_questions_post,
  ): CancelablePromise<UploadResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/api/upload/questions',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Upload badge icon
   * Uploads a badge icon. Stored in 'badges/' folder.
   * @param formData
   * @returns UploadResponse Successful Response
   * @throws ApiError
   */
  public static uploadBadgeImageApiV1ApiUploadBadgesPost(
    formData: Body_upload_badge_image_api_v1_api_upload_badges_post,
  ): CancelablePromise<UploadResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/api/upload/badges',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Upload a single file
   * Upload a file (image or PDF) to Google Cloud Storage. Maximum file size: 10MB
   * @param formData
   * @param folder Optional folder to organize files (e.g., 'questions', 'profiles')
   * @returns UploadResponse Successful Response
   * @throws ApiError
   */
  public static uploadFileApiV1ApiUploadFilePost(
    formData: Body_upload_file_api_v1_api_upload_file_post,
    folder?: (string | null),
  ): CancelablePromise<UploadResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/api/upload/file',
      query: {
        'folder': folder,
      },
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `Invalid file`,
        422: `Validation Error`,
        500: `Server error`,
      },
    });
  }
  /**
   * Delete a file
   * Delete a file from Google Cloud Storage
   * @param blobName Full path of the file in the bucket
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteFileApiV1ApiUploadFileDelete(
    blobName: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/api/upload/file',
      query: {
        'blob_name': blobName,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get file metadata
   * Retrieve metadata for a file
   * @param blobName Full path of the file in the bucket
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getFileMetadataApiV1ApiUploadFileMetadataGet(
    blobName: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/api/upload/file/metadata',
      query: {
        'blob_name': blobName,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
