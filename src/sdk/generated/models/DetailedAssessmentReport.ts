/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentInfo } from './AssessmentInfo';
import type { AttemptStatistics } from './AttemptStatistics';
import type { ScoreStatistics } from './ScoreStatistics';
import type { TimeStatistics } from './TimeStatistics';
export type DetailedAssessmentReport = {
  assessment: AssessmentInfo;
  attempts: AttemptStatistics;
  scores: ScoreStatistics;
  time: TimeStatistics;
};

