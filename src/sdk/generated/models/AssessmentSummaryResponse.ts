/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AssessmentCategory } from "./AssessmentCategory";
import type { AssessmentStatus } from "./AssessmentStatus";
import type { AssessmentType } from "./AssessmentType";
/**
 * Lightweight assessment response for listings
 */
export type AssessmentSummaryResponse = {
  id: string;
  title: string;
  code: string;
  assessment_type: AssessmentType;
  category: AssessmentCategory;
  subject_id: string;
  price: string;
  duration_minutes: number;
  total_questions: number;
  status: AssessmentStatus;
  created_at: string;
  total_attempts: number;
  average_score: string;
};
