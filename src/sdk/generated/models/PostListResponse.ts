/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PostResponse } from './PostResponse';
export type PostListResponse = {
  posts: Array<PostResponse>;
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
};

