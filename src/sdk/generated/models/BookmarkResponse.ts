/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PostResponse } from './PostResponse';
export type BookmarkResponse = {
  id: string;
  post_id: string;
  user_id: string;
  notes?: (string | null);
  created_at: string;
  post?: (PostResponse | null);
};

