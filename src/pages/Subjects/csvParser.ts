import type { QuestionLocal } from "./question.types";
import { isValidQuestionType, isValidDifficultyLevel } from "./question.types";

export const parseCsvFile = async (
    file: File,
    subjectId: string
): Promise<QuestionLocal[]> => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);

    if (lines.length <= 1) {
        throw new Error('CSV contains no rows');
    }

    //   const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const newQuestions: QuestionLocal[] = [];

    for (let i = 1; i < lines.length; i++) {
        const raw = lines[i];
        if (!raw.trim()) continue;

        // Split respecting quoted commas (simple approach)
        const values = raw
            .match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
            ?.map(s => s.replace(/^"|"$/g, '').trim()) || [];

        // Column indices based on template:
        // 0: Question Text
        // 1: Topic ID
        // 2: Question Type
        // 3: Difficulty Level
        // 4: Points
        // 5: Time Limit (seconds)
        // 6: Explanation
        // 7..10: Option 1..4
        // 11: Correct Answer Index (1-based)
        // 12: Audio URL
        // 13: Image URL
        // 14: Video URL

        const qText = values[0] || '';
        const topic_id = values[1] || '';
        const rawQType = (values[2] || 'multiple_choice').toLowerCase();
        const rawLevel = (values[3] || 'easy').toLowerCase();
        const qType = isValidQuestionType(rawQType) ? rawQType : 'multiple_choice';
        const difficulty = isValidDifficultyLevel(rawLevel) ? rawLevel : 'easy';
        const points = Number(values[4]) || 1;
        const time_limit_seconds = values[5] ? Number(values[5]) : null;
        const explanation = values[6] || '';
        const optionTexts = [values[7], values[8], values[9], values[10]].filter(Boolean);
        const correctIndex = Number(values[11]) || 1;
        const audio_url = values[12] || '';
        const image_url = values[13] || '';
        const video_url = values[14] || '';

        const q: QuestionLocal = {
            id: `csv-${Date.now()}-${i}`,
            subject_id: subjectId,
            question_text: qText,
            topic_id,
            question_type: qType,
            difficulty_level: difficulty,
            points,
            time_limit_seconds,
            explanation,
            options: [],
            audio_url,
            image_url,
            video_url,
            tag_ids: null
        };

        if (qType === 'true_false') {
            q.options = [
                { option_text: 'True', is_correct: correctIndex === 1, display_order: 1 },
                { option_text: 'False', is_correct: correctIndex === 2, display_order: 2 },
            ];
            q.correct_answer = correctIndex === 1 ? 'true' : 'false';
        } else {
            q.options = optionTexts.map((t, idx) => ({
                option_text: t,
                is_correct: idx + 1 === correctIndex,
                display_order: idx + 1
            }));
        }

        newQuestions.push(q);
    }

    return newQuestions;
};