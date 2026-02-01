/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MasteryLevel } from './MasteryLevel';
/**
 * Priority focus area in study plan
 */
export type FocusArea = {
  topic: string;
  subject: string;
  current_level: MasteryLevel;
  target_improvement: string;
  daily_minutes: number;
  priority: number;
};

