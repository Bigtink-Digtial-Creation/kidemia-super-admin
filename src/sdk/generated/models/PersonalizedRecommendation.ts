/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecommendationAction } from './RecommendationAction';
import type { RecommendationPriority } from './RecommendationPriority';
import type { RecommendationType } from './RecommendationType';
/**
 * Enhanced recommendation with priority and action
 */
export type PersonalizedRecommendation = {
  type: RecommendationType;
  icon: string;
  title: string;
  description: string;
  action: RecommendationAction;
  priority: RecommendationPriority;
};

