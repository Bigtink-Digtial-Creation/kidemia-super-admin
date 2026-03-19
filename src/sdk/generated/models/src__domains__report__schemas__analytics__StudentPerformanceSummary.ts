/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GamificationData } from './GamificationData';
export type src__domains__report__schemas__analytics__StudentPerformanceSummary = {
  total_attempts: number;
  completed_attempts: number;
  average_score: number;
  passed_count: number;
  pass_rate: number;
  best_score: number;
  worst_score: number;
  gamification?: (GamificationData | null);
};

