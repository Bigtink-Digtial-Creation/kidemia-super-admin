/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PostType } from './PostType';
export type PostCreate = {
  title: string;
  content: string;
  post_type?: PostType;
  subject_id?: (string | null);
  exam_target?: (string | null);
  tag_names?: Array<string>;
};

