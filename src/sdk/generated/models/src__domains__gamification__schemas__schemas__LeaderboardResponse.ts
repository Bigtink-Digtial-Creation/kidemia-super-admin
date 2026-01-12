/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeaderboardEntryResponse } from './LeaderboardEntryResponse';
export type src__domains__gamification__schemas__schemas__LeaderboardResponse = {
  leaderboard_type: string;
  period?: (string | null);
  entries: Array<LeaderboardEntryResponse>;
  total_participants: number;
  current_user_rank?: (number | null);
  updated_at: string;
};

