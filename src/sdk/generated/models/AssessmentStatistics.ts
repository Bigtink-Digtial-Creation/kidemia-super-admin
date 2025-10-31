/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Detailed assessment statistics
 */
export type AssessmentStatistics = {
  assessment_id: string;
  total_attempts: number;
  total_completions: number;
  completion_rate: string;
  total_passes: number;
  total_fails: number;
  pass_rate: string;
  average_score: string;
  median_score: string;
  highest_score: string;
  lowest_score: string;
  score_distribution: Record<string, number>;
  average_completion_time: number;
  median_completion_time: number;
  most_difficult_questions: Array<Record<string, any>>;
  easiest_questions: Array<Record<string, any>>;
};
