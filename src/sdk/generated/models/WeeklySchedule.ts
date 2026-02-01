/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DailySchedule } from './DailySchedule';
/**
 * Weekly study schedule
 */
export type WeeklySchedule = {
  week: number;
  theme: string;
  days: Array<DailySchedule>;
};

