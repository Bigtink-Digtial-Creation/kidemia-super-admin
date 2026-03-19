/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StudentAttemptStatus } from './StudentAttemptStatus';
export type AssessmentDetailResponse = {
  assessment_id: string;
  title: string;
  subject_name: (string | null);
  total_questions: number;
  duration_minutes: number;
  status: string;
  created_at: string;
  available_from: (string | null);
  available_until: (string | null);
  total_assigned: number;
  total_started: number;
  total_submitted: number;
  total_graded: number;
  completion_rate: number;
  pass_rate: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  score_distribution: Record<string, any>;
  students: Array<StudentAttemptStatus>;
};

