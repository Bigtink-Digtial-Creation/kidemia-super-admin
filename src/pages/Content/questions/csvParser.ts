import { isValidDifficultyLevel, isValidQuestionType, type QuestionLocal } from "./question.types";

/**
 * Robustly parses a single CSV line, handling:
 * - Quoted fields (with commas inside)
 * - Unquoted fields (plain Excel export)
 * - Empty trailing fields
 * - Mixed quote styles
 */
const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                // Escaped quote inside quoted field
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim()); // Push the last field
    return result;
};

export const parseCsvFile = async (
    file: File,
    subjectId: string
): Promise<QuestionLocal[]> => {
    const text = await file.text();
    const lines = text.split(/\r?\n/);

    // Filter truly empty lines but keep lines with just commas (empty fields)
    const nonEmptyLines = lines.filter(l => l.trim() !== '');

    if (nonEmptyLines.length <= 1) {
        throw new Error('CSV contains no data rows');
    }

    const newQuestions: QuestionLocal[] = [];

    for (let i = 1; i < nonEmptyLines.length; i++) {
        const raw = nonEmptyLines[i];
        if (!raw.trim()) continue;

        const values = parseCsvLine(raw);

        // Column indices:
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

        // Filter out empty option strings — handles trailing empty fields from Excel
        const optionTexts = [values[7], values[8], values[9], values[10]].filter(
            v => v !== undefined && v !== ''
        );

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
            // Normalize Excel's TRUE/FALSE (uppercase) and quoted variants
            const firstOption = (optionTexts[0] || 'True').toLowerCase();
            const trueIsFirst = firstOption === 'true';

            q.options = [
                {
                    option_text: 'True',
                    is_correct: trueIsFirst ? correctIndex === 1 : correctIndex === 2,
                    display_order: 1
                },
                {
                    option_text: 'False',
                    is_correct: trueIsFirst ? correctIndex === 2 : correctIndex === 1,
                    display_order: 2
                },
            ];
            q.correct_answer = q.options[0].is_correct ? 'true' : 'false';
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