/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthorInfo } from './AuthorInfo';
export type ReplyResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  content: string;
  parent_reply_id?: (string | null);
  post_id: string;
  author_id: string;
  author?: (AuthorInfo | null);
  upvote_count: number;
  is_accepted_answer: boolean;
  is_edited: boolean;
  flagged_count: number;
  child_replies?: Array<ReplyResponse>;
  user_has_upvoted?: (boolean | null);
};

