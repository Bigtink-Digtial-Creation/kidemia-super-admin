/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { LeaderboardEntry } from "./LeaderboardEntry";
/**
 * Leaderboard response
 */
export type LeaderboardResponse = {
  assessment_id: string;
  assessment_title: string;
  entries: Array<LeaderboardEntry>;
  total_participants: number;
  user_rank?: number | null;
};
