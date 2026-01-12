/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to save an answer
 */
export type SaveAnswerRequest = {
  question_id: string;
  selected_option_ids?: (Array<string> | null);
  text_answer?: (string | null);
  matching_pairs?: (Record<string, string> | null);
  ordered_items?: (Array<string> | null);
  flagged_for_review?: boolean;
};

