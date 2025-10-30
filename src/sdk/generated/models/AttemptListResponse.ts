/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttemptResultResponse } from "./AttemptResultResponse";
/**
 * Paginated attempt list
 */
export type AttemptListResponse = {
  items: Array<AttemptResultResponse>;
  total: number;
  page: number;
  page_size: number;
};
