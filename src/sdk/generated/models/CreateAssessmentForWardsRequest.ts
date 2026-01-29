/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to create fully-featured assessment and assign to wards
 */
export type CreateAssessmentForWardsRequest = {
  subject_id: string;
  topic_ids: Array<string>;
  number_of_questions?: number;
  duration_minutes?: number;
  due_date?: (string | null);
  available_from?: (string | null);
  /**
   * Wards to assign to
   */
  ward_ids: Array<string>;
  instructions?: (string | null);
  passing_percentage?: (number | null);
  max_attempts?: (number | null);
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
  allow_question_navigation?: boolean;
  allow_review?: boolean;
  /**
   * immediate, after_submission, after_due_date
   */
  result_display_mode?: (string | null);
  show_correct_answers?: (boolean | null);
  show_explanations?: (boolean | null);
  enable_proctoring?: (boolean | null);
  require_webcam?: (boolean | null);
  fullscreen_required?: (boolean | null);
  detect_tab_switching?: (boolean | null);
  max_tab_switches?: (number | null);
  /**
   * Automatically submit when time expires
   */
  auto_submit_on_time_up?: (boolean | null);
};

