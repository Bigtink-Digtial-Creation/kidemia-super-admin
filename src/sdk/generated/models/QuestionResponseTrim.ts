/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DifficultyLevel } from './DifficultyLevel';
import type { QuestionOptionResponseTrim } from './QuestionOptionResponseTrim';
import type { QuestionType } from './QuestionType';
/**
 * Schema for trim question response (with answers)
 */
export type QuestionResponseTrim = {
  question_text: string;
  question_type: QuestionType;
  difficulty_level: DifficultyLevel;
  explanation?: (string | null);
  options?: Array<QuestionOptionResponseTrim>;
};

