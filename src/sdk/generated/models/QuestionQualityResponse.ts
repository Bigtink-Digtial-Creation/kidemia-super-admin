/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MissedQuestion } from './MissedQuestion';
import type { QuestionAnalysis } from './QuestionAnalysis';
export type QuestionQualityResponse = {
  total_analyzed: number;
  needs_difficulty_adjustment: number;
  questions_needing_review: Array<QuestionAnalysis>;
  most_missed_questions: Array<MissedQuestion>;
  generated_at: string;
};

