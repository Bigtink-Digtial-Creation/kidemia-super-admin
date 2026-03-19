/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResultDisplayMode } from './ResultDisplayMode';
export type InstitutionAssessmentCreate = {
  subject_id: string;
  topic_ids: Array<string>;
  number_of_questions: number;
  instructions?: (string | null);
  duration_minutes: number;
  available_from?: (string | null);
  available_until?: (string | null);
  passing_percentage?: (number | string);
  max_attempts?: number;
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
  allow_question_navigation?: boolean;
  allow_backward_navigation?: boolean;
  result_display_mode?: ResultDisplayMode;
  show_correct_answers?: boolean;
  show_explanations?: boolean;
  proctoring_enabled?: boolean;
  require_webcam?: boolean;
  fullscreen_required?: boolean;
  detect_tab_switching?: boolean;
  max_tab_switches?: number;
  auto_submit_on_time_up?: boolean;
  publish?: boolean;
};

