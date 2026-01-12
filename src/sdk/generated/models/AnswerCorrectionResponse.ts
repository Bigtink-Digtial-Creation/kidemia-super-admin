/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttemptSummaryResponse } from './AttemptSummaryResponse';
import type { SingleAnswerCorrectionResponse } from './SingleAnswerCorrectionResponse';
export type AnswerCorrectionResponse = {
  attempt: AttemptSummaryResponse;
  answers: Array<SingleAnswerCorrectionResponse>;
};

