/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinancialInsights } from './FinancialInsights';
import type { RevenueDataPoint } from './RevenueDataPoint';
import type { RevenueMetrics } from './RevenueMetrics';
import type { SubscriptionAnalytics } from './SubscriptionAnalytics';
export type FinancialOverviewResponse = {
  overview: RevenueMetrics;
  subscriptions: SubscriptionAnalytics;
  trend: Array<RevenueDataPoint>;
  insights: FinancialInsights;
  generated_at: string;
};

