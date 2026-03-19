/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonalizedRecommendation } from './PersonalizedRecommendation';
import type { PersonalizedStudyPlan } from './PersonalizedStudyPlan';
import type { ProgressDataPoint } from './ProgressDataPoint';
import type { src__domains__report__schemas__analytics__StudentPerformanceSummary } from './src__domains__report__schemas__analytics__StudentPerformanceSummary';
import type { SubjectPerformance } from './SubjectPerformance';
import type { TopicPerformance } from './TopicPerformance';
export type StudentPerformanceResponse = {
  performance_summary: src__domains__report__schemas__analytics__StudentPerformanceSummary;
  subject_breakdown: Array<SubjectPerformance>;
  topic_breakdown: Array<TopicPerformance>;
  progress_over_time: Array<ProgressDataPoint>;
  personalized_recommendations: Array<PersonalizedRecommendation>;
  study_plan: PersonalizedStudyPlan;
  generated_at: string;
};

