/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BadgeResponse } from './BadgeResponse';
export type LeaderboardEntryResponse = {
  rank: number;
  student_id: string;
  student_name: string;
  student_avatar?: (string | null);
  points: number;
  level: number;
  streak_days: number;
  badges?: Array<BadgeResponse>;
  trend?: (string | null);
};

