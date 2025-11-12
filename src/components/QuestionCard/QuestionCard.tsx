import React, { useState } from 'react';
import { Link2, Upload, Trash2, Plus } from 'lucide-react';
import type { QuestionLocal, Topic } from '../../pages/Subjects/question.types';
import { ImageUploadModal } from '../Modals/ImageUploadModal';

interface QuestionCardProps {
    question: QuestionLocal;
    index: number;
    topics: Topic[];
    onUpdate: (fields: Partial<QuestionLocal>) => void;
    onDelete: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    index,
    topics,
    onUpdate,
    onDelete
}) => {
    const [showMediaLinks, setShowMediaLinks] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);

    const addOption = () => {
        const newOpt = {
            option_text: '',
            is_correct: false,
            display_order: question.options.length + 1
        };
        onUpdate({ options: [...question.options, newOpt] });
    };

    const updateOptionText = (idx: number, text: string) => {
        onUpdate({
            options: question.options.map((o, i) =>
                i === idx ? { ...o, option_text: text } : o
            )
        });
    };

    const toggleOptionCorrect = (idx: number) => {
        onUpdate({
            options: question.options.map((o, i) => ({
                ...o,
                is_correct: i === idx ? !o.is_correct : o.is_correct
            }))
        });
    };

    const removeOption = (idx: number) => {
        onUpdate({
            options: question.options
                .filter((_, i) => i !== idx)
                .map((o, i) => ({ ...o, display_order: i + 1 }))
        });
    };

    const handleImageUploaded = (url: string) => {
        onUpdate({ image_url: url });
    };

    const renderQuestionTypeFields = () => {
        switch (question.question_type) {
            case 'multiple_choice':
                return (
                    <div className="space-y-3">
                        {question.options.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        type="radio"
                                        name={`correct-${question.id}`}
                                        checked={!!opt.is_correct}
                                        onChange={() => toggleOptionCorrect(idx)}
                                        className="w-5 h-5 text-orange-500 cursor-pointer"
                                    />
                                    <span className="text-sm font-medium text-gray-400 w-6">{idx + 1}.</span>
                                    <input
                                        type="text"
                                        placeholder="Type your option"
                                        value={opt.option_text}
                                        onChange={(e) => updateOptionText(idx, e.target.value)}
                                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg"
                                    />
                                </div>
                                <button
                                    onClick={() => removeOption(idx)}
                                    className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addOption}
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" /> Add option
                        </button>
                    </div>
                );

            case 'true_false':
                return (
                    <div className="space-y-3">
                        {['true', 'false'].map((label, idx) => (
                            <div key={label} className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name={`tf-${question.id}`}
                                    checked={question.correct_answer === label}
                                    onChange={() => onUpdate({ correct_answer: label })}
                                    className="w-5 h-5 text-orange-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-400 w-6">{idx + 1}.</span>
                                <div className="flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">
                                    {label === 'true' ? 'True' : 'False'}
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'ordering':
                return (
                    <div className="space-y-3">
                        {question.options.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 w-6">{idx + 1}.</span>
                                <input
                                    type="text"
                                    placeholder="Type your option"
                                    value={opt.option_text}
                                    onChange={(e) => updateOptionText(idx, e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg"
                                />
                                <button
                                    onClick={() => removeOption(idx)}
                                    className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addOption}
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" /> Add option
                        </button>
                    </div>
                );

            case 'essay':
            case 'fill_in_blank':
                return (
                    <textarea
                        placeholder="Students will type their answer here..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg min-h-[100px] resize-none"
                        disabled
                    />
                );

            default:
                return null;
        }
    };

    return (
        <>
            <ImageUploadModal
                isOpen={showImageUpload}
                onClose={() => setShowImageUpload(false)}
                onUpload={handleImageUploaded}
            />

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-700">Question {index + 1}.</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="What is Newton's first law of motion?"
                            value={question.question_text}
                            onChange={(e) => onUpdate({ question_text: e.target.value })}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <select
                            value={question.topic_id}
                            onChange={(e) => onUpdate({ topic_id: e.target.value })}
                            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white min-w-[150px]"
                        >
                            <option value="">Select Topic</option>
                            {topics.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <select
                            value={question.question_type}
                            onChange={(e) => onUpdate({ question_type: e.target.value })}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        >
                            <option value="">Select Type</option>
                            <option value="multiple_choice">Multiple choice</option>
                            <option value="true_false">True/False</option>
                            <option value="fill_in_blank">Fill in blank</option>
                            <option value="essay">Essay</option>
                            <option value="matching">Matching</option>
                            <option value="ordering">Ordering</option>
                        </select>
                        <select
                            value={question.difficulty_level}
                            onChange={(e) => onUpdate({ difficulty_level: e.target.value })}
                            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white min-w-[150px]"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="expert">Expert</option>
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <input
                            type="number"
                            placeholder="Points"
                            value={question.points}
                            onChange={(e) => onUpdate({ points: Number(e.target.value) || 1 })}
                            className="px-4 py-3 border border-gray-200 rounded-lg"
                            min={1}
                        />
                        <input
                            type="number"
                            placeholder="Time Limit (seconds)"
                            value={question.time_limit_seconds ?? ''}
                            onChange={(e) => onUpdate({ time_limit_seconds: e.target.value ? Number(e.target.value) : null })}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg"
                        />
                    </div>

                    <textarea
                        placeholder="Explanation (optional)"
                        value={question.explanation}
                        onChange={(e) => onUpdate({ explanation: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[80px] resize-none"
                    />

                    {renderQuestionTypeFields()}

                    {question.image_url && (
                        <div className="border border-gray-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Question Image:</p>
                            <img
                                src={question.image_url}
                                alt="Question"
                                className="max-h-48 rounded-lg"
                            />
                        </div>
                    )}

                    {showMediaLinks && (
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <input
                                type="text"
                                placeholder="Audio URL"
                                value={question.audio_url}
                                onChange={(e) => onUpdate({ audio_url: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Video URL"
                                value={question.video_url}
                                onChange={(e) => onUpdate({ video_url: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                            />
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowMediaLinks(!showMediaLinks)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Link2 className="w-4 h-4" /> Link to Media
                            </button>
                            <button
                                onClick={() => setShowImageUpload(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
                            >
                                <Upload className="w-4 h-4" /> Upload Image
                            </button>
                        </div>
                        <button
                            onClick={onDelete}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-600 font-medium"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};