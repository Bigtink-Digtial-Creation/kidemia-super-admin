/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for question option response
 */
export type QuestionOptionResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  option_text: string;
  option_order: number;
  is_correct?: boolean;
  explanation?: string | null;
  image_url?: string | null;
  match_pair_id?: string | null;
  correct_order?: number | null;
  question_id: string;
};
