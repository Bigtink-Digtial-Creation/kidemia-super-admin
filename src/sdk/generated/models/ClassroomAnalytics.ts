/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionInsight } from './QuestionInsight';
import type { ScoreSnapshot } from './ScoreSnapshot';
import type { src__domains__institution__schemas__analytics__StudentPerformanceSummary } from './src__domains__institution__schemas__analytics__StudentPerformanceSummary';
export type ClassroomAnalytics = {
  classroom_id: string;
  classroom_name: string;
  level: string;
  teacher_name: (string | null);
  total_students: number;
  total_assessments_assigned: number;
  avg_score: number;
  pass_rate: number;
  completion_rate: number;
  highest_avg_score: number;
  lowest_avg_score: number;
  score_trend: Array<ScoreSnapshot>;
  top_performers: Array<src__domains__institution__schemas__analytics__StudentPerformanceSummary>;
  needs_support: Array<src__domains__institution__schemas__analytics__StudentPerformanceSummary>;
  most_difficult_topics: Array<QuestionInsight>;
};

