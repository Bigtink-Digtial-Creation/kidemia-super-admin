/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for creating a topic
 */
export type TopicCreate = {
  subject_id: string;
  name: string;
  code: string;
  description?: (string | null);
  content?: (string | null);
  video_url?: (string | null);
  document_url?: (string | null);
  parent_id?: (string | null);
  order?: number;
  estimated_time_minutes?: (number | null);
  difficulty_level?: (string | null);
  is_active?: boolean;
};

