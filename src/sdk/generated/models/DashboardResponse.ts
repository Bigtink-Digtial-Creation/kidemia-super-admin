/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentPerformanceMetrics } from './AssessmentPerformanceMetrics';
import type { AssessmentSummary } from './AssessmentSummary';
import type { EngagementMetrics } from './EngagementMetrics';
import type { OverviewMetrics } from './OverviewMetrics';
import type { RevenueMetrics } from './RevenueMetrics';
import type { TrendData } from './TrendData';
export type DashboardResponse = {
  overview: OverviewMetrics;
  assessment_performance: AssessmentPerformanceMetrics;
  revenue: RevenueMetrics;
  engagement: EngagementMetrics;
  trends: TrendData;
  assessments: Record<string, Array<AssessmentSummary>>;
  generated_at: string;
};

