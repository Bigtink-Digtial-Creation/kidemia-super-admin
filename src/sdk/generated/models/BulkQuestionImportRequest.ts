/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { QuestionCreate } from "./QuestionCreate";
/**
 * Bulk question import request
 */
export type BulkQuestionImportRequest = {
  subject_id: string;
  topic_id: string;
  questions: Array<QuestionCreate>;
};
