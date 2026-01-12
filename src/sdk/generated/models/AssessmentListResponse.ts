/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentSummaryResponse } from './AssessmentSummaryResponse';
/**
 * Paginated assessment list
 */
export type AssessmentListResponse = {
  items: Array<AssessmentSummaryResponse>;
  total: number;
  page: number;
  page_size: number;
};

