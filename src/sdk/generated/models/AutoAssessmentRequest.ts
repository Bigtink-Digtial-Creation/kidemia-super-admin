/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentType } from './AssessmentType';
/**
 * Schema for auto-generating assessment from topics
 */
export type AutoAssessmentRequest = {
  subject_id: string;
  topic_ids: Array<string>;
  assessment_type?: AssessmentType;
  number_of_questions?: number;
  duration_minutes?: number;
  difficulty_level?: (string | null);
  question_types?: (Array<string> | null);
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
  allow_review?: boolean;
};

