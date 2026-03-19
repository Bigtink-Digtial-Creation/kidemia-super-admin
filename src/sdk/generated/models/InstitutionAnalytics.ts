/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClassroomComparison } from './ClassroomComparison';
import type { GroupPerformance } from './GroupPerformance';
import type { ScoreSnapshot } from './ScoreSnapshot';
export type InstitutionAnalytics = {
  institution_id: string;
  total_students: number;
  total_assessments_assigned: number;
  overall_avg_score: number;
  overall_pass_rate: number;
  overall_completion_rate: number;
  score_trend: Array<ScoreSnapshot>;
  classroom_comparison: Array<ClassroomComparison>;
  group_performance: Array<GroupPerformance>;
  top_classrooms: Array<ClassroomComparison>;
  struggling_classrooms: Array<ClassroomComparison>;
};

