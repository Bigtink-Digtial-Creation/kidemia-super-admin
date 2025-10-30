/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TopicResponse } from './TopicResponse';
/**
 * Paginated topic list response
 */
export type TopicListResponse = {
  items: Array<TopicResponse>;
  total: number;
  page: number;
  page_size: number;
};

