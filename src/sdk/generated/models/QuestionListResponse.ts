/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionResponse } from './QuestionResponse';
/**
 * Paginated question list response
 */
export type QuestionListResponse = {
  items: Array<QuestionResponse>;
  total: number;
  page: number;
  page_size: number;
};

