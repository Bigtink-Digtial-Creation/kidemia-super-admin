import type { QuestionCreate, QuestionType, DifficultyLevel } from "../../sdk/generated";
import type { QuestionLocal } from "./question.types";
import { isValidQuestionType, isValidDifficultyLevel } from "./question.types";

export const validateQuestions = (
    questions: QuestionLocal[],
    showToast: (message: string, type: 'error') => void
): boolean => {
    for (const q of questions) {
        if (!q.question_text.trim()) {
            showToast('Please fill in all question texts', 'error');
            return false;
        }
        if (!q.topic_id) {
            showToast('Please select a topic for all questions', 'error');
            return false;
        }
        if (!q.question_type) {
            showToast('Please select a question type for all questions', 'error');
            return false;
        }

        if (q.question_type === 'multiple_choice') {
            if (q.options.length < 2) {
                showToast('Multiple choice questions must have at least 2 options', 'error');
                return false;
            }
            if (!q.options.some(opt => opt.is_correct)) {
                showToast('Please mark the correct answer for all multiple choice questions', 'error');
                return false;
            }
            if (q.options.some(opt => !opt.option_text.trim())) {
                showToast('Please fill in all option texts', 'error');
                return false;
            }
        }

        if (q.question_type === 'ordering' && q.options.length < 2) {
            showToast('Ordering questions must have at least 2 options', 'error');
            return false;
        }
    }
    return true;
};

export const mapToApiPayload = (questions: QuestionLocal[]): QuestionCreate[] => {
    return questions.map(q => {
        const question_type = isValidQuestionType(String(q.question_type).toLowerCase())
            ? (String(q.question_type).toLowerCase() as QuestionType)
            : 'multiple_choice';

        const difficulty_level = isValidDifficultyLevel(String(q.difficulty_level).toLowerCase())
            ? (String(q.difficulty_level).toLowerCase() as DifficultyLevel)
            : 'easy';

        const options = q.question_type === 'true_false'
            ? [
                {
                    option_text: 'True',
                    option_order: 1,
                    is_correct: q.correct_answer === 'true' || q.options.some(o => o.option_text.toLowerCase() === 'true' && o.is_correct)
                },
                {
                    option_text: 'False',
                    option_order: 2,
                    is_correct: q.correct_answer === 'false' || q.options.some(o => o.option_text.toLowerCase() === 'false' && o.is_correct)
                }
            ]
            : q.options.map(o => ({
                option_text: o.option_text,
                option_order: o.display_order || 1,
                is_correct: !!o.is_correct,
                explanation: o.explanation ?? null,
                image_url: o.image_url ? o.image_url : null,
                match_pair_id: null,
                correct_order: null
            }));

        const payloadItem: QuestionCreate = {
            subject_id: q.subject_id,
            topic_id: q.topic_id,
            question_text: q.question_text,
            question_type,
            difficulty_level,
            explanation: q.explanation ? q.explanation : null,
            image_url: q.image_url ? q.image_url : null,
            audio_url: q.audio_url ? q.audio_url : null,
            video_url: q.video_url ? q.video_url : null,
            points: q.points,
            time_limit_seconds: q.time_limit_seconds ?? null,
            options,
            tag_ids: q.tag_ids ?? null
        };

        return payloadItem;
    });
};