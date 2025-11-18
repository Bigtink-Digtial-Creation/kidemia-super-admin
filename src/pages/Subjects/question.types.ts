import type { DifficultyLevel, QuestionType } from "../../sdk/generated";

export interface OptionLocal {
    option_text: string;
    is_correct: boolean;
    display_order: number;
    explanation?: string | null;
    image_url?: string | null;
}

export interface QuestionLocal {
    id: string;
    subject_id: string;
    question_text: string;
    topic_id: string;
    question_type: QuestionType | string;
    difficulty_level: DifficultyLevel | string;
    points: number;
    time_limit_seconds: number | null;
    explanation: string;
    options: OptionLocal[];
    correct_answer?: string | null;
    audio_url: string;
    image_url: string;
    video_url: string;
    tag_ids?: string[] | null;
}

export interface Topic {
    id: string;
    name: string;
    code?: string;
}

export type ToastType = { message: string; type: 'success' | 'error' | 'info' } | null;

export const ALLOWED_QUESTION_TYPES = [
    'multiple_choice',
    'true_false',
    'fill_in_blank',
    'essay',
    'matching',
    'ordering'
] as const;

export type AllowedQuestionType = typeof ALLOWED_QUESTION_TYPES[number];

export const ALLOWED_DIFFICULTY_LEVELS = ['easy', 'medium', 'hard', 'expert'] as const;
export type AllowedDifficultyLevel = typeof ALLOWED_DIFFICULTY_LEVELS[number];

export function isValidQuestionType(v: string): v is AllowedQuestionType {
    return (ALLOWED_QUESTION_TYPES as readonly string[]).includes(v);
}

export function isValidDifficultyLevel(v: string): v is AllowedDifficultyLevel {
    return (ALLOWED_DIFFICULTY_LEVELS as readonly string[]).includes(v);
}