/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { src__domains__assessment__schemas__assessment__TopicResponse } from './src__domains__assessment__schemas__assessment__TopicResponse';
/**
 * Subject response with nested topics
 */
export type SubjectWithTopics = {
  name: string;
  topics_count?: number;
  questions_count?: number;
  topics?: Array<src__domains__assessment__schemas__assessment__TopicResponse>;
};

