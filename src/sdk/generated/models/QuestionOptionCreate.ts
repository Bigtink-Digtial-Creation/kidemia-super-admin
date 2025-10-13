/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
/**
 * Schema for creating question option
 */
export type QuestionOptionCreate = {
  option_text: string;
  option_order: number;
  is_correct?: boolean;
  explanation?: string | null;
  image_url?: string | null;
  match_pair_id?: string | null;
  correct_order?: number | null;
};
