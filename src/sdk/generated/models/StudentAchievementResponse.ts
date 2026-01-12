/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AchievementResponse } from './AchievementResponse';
export type StudentAchievementResponse = {
  id: string;
  achievement: AchievementResponse;
  current_value: number;
  is_completed: boolean;
  completed_at?: (string | null);
  progress_percentage?: number;
};

