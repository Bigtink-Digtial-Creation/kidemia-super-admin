/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttemptStatus } from './AttemptStatus';
/**
 * Response showing attempt results
 */
export type AttemptResultResponse = {
  attempt_id: string;
  assessment_id: string;
  attempt_number: number;
  status: AttemptStatus;
  submitted_at: (string | null);
  score: string;
  percentage: string;
  points_earned: string;
  points_possible: string;
  passed: boolean;
  grade: (string | null);
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  partially_correct: number;
  rank: (number | null);
  percentile: (string | null);
  time_spent_seconds: number;
  feedback: (string | null);
  certificate_issued: boolean;
  certificate_url: (string | null);
};

