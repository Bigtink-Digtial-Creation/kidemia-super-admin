/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DifficultyLevel } from './DifficultyLevel';
import type { QuestionOptionResponse } from './QuestionOptionResponse';
import type { QuestionStatus } from './QuestionStatus';
import type { QuestionTagResponse } from './QuestionTagResponse';
import type { QuestionType } from './QuestionType';
/**
 * Schema for full question response (with answers)
 */
export type QuestionResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  subject_id: string;
  topic_id: string;
  question_text: string;
  question_type: QuestionType;
  difficulty_level: DifficultyLevel;
  explanation?: (string | null);
  image_url?: (string | null);
  audio_url?: (string | null);
  video_url?: (string | null);
  points?: number;
  time_limit_seconds?: (number | null);
  status: QuestionStatus;
  times_used: number;
  times_correct: number;
  times_incorrect: number;
  success_rate: number;
  reviewed_by?: (string | null);
  approved_at?: (string | null);
  options?: Array<QuestionOptionResponse>;
  tags?: Array<QuestionTagResponse>;
};

