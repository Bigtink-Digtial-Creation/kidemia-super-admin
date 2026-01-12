/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentSummaryResponseForAttempt } from './AssessmentSummaryResponseForAttempt';
import type { AttemptStatus } from './AttemptStatus';
/**
 * Raw assessment attempt state (with assessment attached)
 */
export type AttemptResponse = {
  assessment_id: string;
  id: string;
  assessment: AssessmentSummaryResponseForAttempt;
  attempt_number: number;
  status: AttemptStatus;
  grading_status: (string | null);
  started_at: (string | null);
  submitted_at: (string | null);
  must_submit_by: (string | null);
  time_spent_seconds: number;
  time_remaining_seconds: (number | null);
  total_questions: number;
  questions_attempted: number;
  questions_unanswered: number;
  questions_flagged: number;
  correct_answers: number;
  incorrect_answers: number;
  partially_correct: number;
  score: string;
  percentage: string;
  points_earned: string;
  points_possible: string;
  passed: boolean;
  grade: (string | null);
  rank: (number | null);
  percentile: (string | null);
  proctoring_session_id: (string | null);
  violation_count: number;
  flagged_suspicious: boolean;
  feedback: (string | null);
  certificate_issued: boolean;
  certificate_url: (string | null);
};

