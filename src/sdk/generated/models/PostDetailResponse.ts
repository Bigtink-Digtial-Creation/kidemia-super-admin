/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthorInfo } from './AuthorInfo';
import type { PostStatus } from './PostStatus';
import type { PostType } from './PostType';
import type { ReplyResponse } from './ReplyResponse';
import type { TagResponse } from './TagResponse';
export type PostDetailResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  title: string;
  content: string;
  post_type?: PostType;
  subject_id?: (string | null);
  exam_target?: (string | null);
  tag_names?: Array<string>;
  status: PostStatus;
  author_id: string;
  author?: (AuthorInfo | null);
  view_count: number;
  reply_count: number;
  upvote_count: number;
  is_answered: boolean;
  accepted_answer_id?: (string | null);
  is_pinned: boolean;
  is_locked: boolean;
  flagged_count: number;
  last_activity_at: string;
  tags?: Array<TagResponse>;
  user_has_upvoted?: (boolean | null);
  user_has_bookmarked?: (boolean | null);
  user_is_following?: (boolean | null);
  replies?: Array<ReplyResponse>;
};

