/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DifficultyLevel } from './DifficultyLevel';
import type { QuestionStatus } from './QuestionStatus';
import type { QuestionType } from './QuestionType';
/**
 * Schema for updating question
 */
export type QuestionUpdate = {
  question_text?: (string | null);
  question_type?: (QuestionType | null);
  difficulty_level?: (DifficultyLevel | null);
  explanation?: (string | null);
  image_url?: (string | null);
  audio_url?: (string | null);
  video_url?: (string | null);
  points?: (number | null);
  time_limit_seconds?: (number | null);
  status?: (QuestionStatus | null);
  tag_ids?: (Array<string> | null);
};

