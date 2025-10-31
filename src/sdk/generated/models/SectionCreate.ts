/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

/**
 * Schema for creating section
 */
export type SectionCreate = {
  title: string;
  description?: string | null;
  instructions?: string | null;
  order: number;
  time_limit_minutes?: number | null;
  shuffle_questions?: boolean;
  is_optional?: boolean;
  question_ids?: Array<string>;
};
