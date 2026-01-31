/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MasteryLevel } from './MasteryLevel';
/**
 * Topic-level performance data
 */
export type TopicPerformance = {
  topic_id: string;
  topic_name: string;
  subject_name: string;
  subject_id: string;
  questions_attempted: number;
  correct_answers: number;
  success_rate: number;
  mastery_score: number;
  mastery_level: MasteryLevel;
};

