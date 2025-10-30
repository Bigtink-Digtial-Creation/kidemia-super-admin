/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentCategory } from "./AssessmentCategory";
import type { AssessmentStatus } from "./AssessmentStatus";
import type { AssessmentType } from "./AssessmentType";
import type { QuestionSelectionMode } from "./QuestionSelectionMode";
import type { ResultDisplayMode } from "./ResultDisplayMode";
import type { SectionResponse } from "./SectionResponse";
/**
 * Schema for assessment response
 */
export type AssessmentResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  title: string;
  code: string;
  description?: string | null;
  instructions?: string | null;
  assessment_type: AssessmentType;
  category: AssessmentCategory;
  subject_id: string;
  topic_ids?: Array<string> | null;
  exam_year?: number | null;
  exam_session?: string | null;
  price?: string;
  currency?: string;
  discount_price?: string | null;
  duration_minutes: number;
  available_from?: string | null;
  available_until?: string | null;
  question_selection_mode?: QuestionSelectionMode;
  passing_percentage?: string;
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
  allow_question_navigation?: boolean;
  allow_backward_navigation?: boolean;
  max_attempts?: number;
  result_display_mode?: ResultDisplayMode;
  show_correct_answers?: boolean;
  show_explanations?: boolean;
  proctoring_enabled?: boolean;
  require_webcam?: boolean;
  fullscreen_required?: boolean;
  detect_tab_switching?: boolean;
  max_tab_switches?: number;
  is_public?: boolean;
  require_enrollment?: boolean;
  category_config_id?: string | null;
  institution_id?: string | null;
  status: AssessmentStatus;
  total_questions: number;
  total_points: number;
  total_attempts: number;
  total_completions: number;
  total_passes: number;
  total_fails: number;
  average_score: string;
  highest_score: string;
  lowest_score: string;
  sections?: Array<SectionResponse>;
};
