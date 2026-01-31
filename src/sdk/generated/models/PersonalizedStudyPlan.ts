/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FocusArea } from './FocusArea';
import type { Milestone } from './Milestone';
import type { WeeklySchedule } from './WeeklySchedule';
/**
 * Complete personalized study plan
 */
export type PersonalizedStudyPlan = {
  duration_days: number;
  daily_study_minutes: number;
  focus_areas: Array<FocusArea>;
  weekly_schedule: Array<WeeklySchedule>;
  milestones: Array<Milestone>;
};

