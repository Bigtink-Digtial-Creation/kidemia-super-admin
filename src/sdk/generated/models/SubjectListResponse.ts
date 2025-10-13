/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { SubjectResponse } from "./SubjectResponse";
/**
 * Paginated subject list response
 */
export type SubjectListResponse = {
  items: Array<SubjectResponse>;
  total: number;
  page: number;
  page_size: number;
};
