/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for section response
 */
export type SectionResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  title: string;
  description?: string | null;
  instructions?: string | null;
  order: number;
  time_limit_minutes?: number | null;
  shuffle_questions?: boolean;
  is_optional?: boolean;
  assessment_id: string;
  total_questions: number;
  total_points: number;
};
