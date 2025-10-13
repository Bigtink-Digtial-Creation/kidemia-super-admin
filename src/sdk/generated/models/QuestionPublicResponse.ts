/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { DifficultyLevel } from "./DifficultyLevel";
import type { QuestionOptionPublicResponse } from "./QuestionOptionPublicResponse";
import type { QuestionTagResponse } from "./QuestionTagResponse";
import type { QuestionType } from "./QuestionType";
/**
 * Public question response (without answers for students taking exams)
 */
export type QuestionPublicResponse = {
  id: string;
  subject_id: string;
  topic_id: string;
  question_text: string;
  question_type: QuestionType;
  difficulty_level: DifficultyLevel;
  image_url?: string | null;
  audio_url?: string | null;
  video_url?: string | null;
  points: number;
  time_limit_seconds?: number | null;
  options?: Array<QuestionOptionPublicResponse>;
  tags?: Array<QuestionTagResponse>;
};
