/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentLeaderboardEntry } from './AssessmentLeaderboardEntry';
export type AssessmentLeaderboardResponse = {
  assessment_id: string;
  assessment_title?: (string | null);
  entries: Array<AssessmentLeaderboardEntry>;
  total_participants: number;
  current_user_rank?: (number | null);
  updated_at: string;
};

