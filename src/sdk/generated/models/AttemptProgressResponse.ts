/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AttemptStatus } from "./AttemptStatus";
/**
 * Response showing attempt progress
 */
export type AttemptProgressResponse = {
  attempt_id: string;
  status: AttemptStatus;
  time_spent_seconds: number;
  time_remaining_seconds: number | null;
  total_questions: number;
  questions_attempted: number;
  questions_unanswered: number;
  questions_flagged: number;
  can_submit: boolean;
};
