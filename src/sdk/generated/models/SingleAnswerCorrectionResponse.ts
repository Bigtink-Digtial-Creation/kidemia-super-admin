/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerResultResponse } from './AnswerResultResponse';
import type { OptionCorrectionResponse } from './OptionCorrectionResponse';
import type { QuestionCorrectionResponse } from './QuestionCorrectionResponse';
import type { UserAnswerResponse } from './UserAnswerResponse';
export type SingleAnswerCorrectionResponse = {
  answer_id: string;
  question: QuestionCorrectionResponse;
  options: Array<OptionCorrectionResponse>;
  user_answer: UserAnswerResponse;
  result: AnswerResultResponse;
};

