/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response when starting an attempt
 */
export type AttemptStartResponse = {
  attempt_id: string;
  assessment_id: string;
  attempt_number: number;
  duration_minutes: number;
  must_submit_by: string;
  total_questions: number;
  instructions?: (string | null);
  proctoring_required?: boolean;
  proctoring_config?: (Record<string, any> | null);
};

