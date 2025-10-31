/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { AssessmentStatus } from "./AssessmentStatus";
import type { ResultDisplayMode } from "./ResultDisplayMode";
/**
 * Schema for updating assessment
 */
export type AssessmentUpdate = {
  title?: string | null;
  description?: string | null;
  instructions?: string | null;
  status?: AssessmentStatus | null;
  exam_year?: number | null;
  exam_session?: string | null;
  price?: number | string | null;
  discount_price?: number | string | null;
  duration_minutes?: number | null;
  available_from?: string | null;
  available_until?: string | null;
  passing_percentage?: number | string | null;
  shuffle_questions?: boolean | null;
  shuffle_options?: boolean | null;
  max_attempts?: number | null;
  result_display_mode?: ResultDisplayMode | null;
  show_correct_answers?: boolean | null;
  show_explanations?: boolean | null;
  proctoring_enabled?: boolean | null;
  is_public?: boolean | null;
};
