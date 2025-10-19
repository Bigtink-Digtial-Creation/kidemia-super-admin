/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DifficultyLevel } from "./DifficultyLevel";
import type { QuestionOptionCreate } from "./QuestionOptionCreate";
import type { QuestionType } from "./QuestionType";
/**
 * Schema for creating question
 */
export type QuestionCreate = {
  subject_id: string;
  topic_id: string;
  question_text: string;
  question_type: QuestionType;
  difficulty_level: DifficultyLevel;
  explanation?: string | null;
  image_url?: string | null;
  audio_url?: string | null;
  video_url?: string | null;
  points?: number;
  time_limit_seconds?: number | null;
  options: Array<QuestionOptionCreate>;
  tag_ids?: Array<string> | null;
};
