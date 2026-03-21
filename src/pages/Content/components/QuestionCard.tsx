import React, { useState } from 'react';
import {
    Link2, Upload, Trash2, Plus, ChevronDown,
    Lightbulb, GripVertical, CheckCircle2,
} from 'lucide-react';
import { Select, SelectItem, Chip, type SelectedItems } from '@heroui/react';
import type { QuestionLocal, OptionLocal, Topic } from '../questions/question.types';
import { ImageUploadModal } from '../../../components/Modals/ImageUploadModal';
import QuestionEditor from '../../../components/editor/QuestionEditor';
import OptionEditor from '../../../components/editor/OptionEditor';

interface TagItem {
    id: string;
    name: string;
    color?: string | null;
}

interface QuestionCardProps {
    question: QuestionLocal;
    index: number;
    topics: Topic[];
    tags: TagItem[];
    onUpdate: (fields: Partial<QuestionLocal>) => void;
    onDelete: () => void;
}

// ── Difficulty config ─────────────────────────────────────────────
const DIFFICULTY_CONFIG = {
    easy: { label: 'Easy', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    medium: { label: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    hard: { label: 'Hard', color: 'bg-red-50 text-red-600 border-red-200' },
    expert: { label: 'Expert', color: 'bg-purple-50 text-purple-700 border-purple-200' },
} as const;

const TYPE_CONFIG: Record<string, { label: string; badge: string }> = {
    multiple_choice: { label: 'Multiple Choice', badge: 'bg-blue-50 text-blue-700' },
    true_false: { label: 'True / False', badge: 'bg-cyan-50 text-cyan-700' },
    fill_in_blank: { label: 'Fill in Blank', badge: 'bg-violet-50 text-violet-700' },
    essay: { label: 'Essay', badge: 'bg-pink-50 text-pink-700' },
    ordering: { label: 'Ordering', badge: 'bg-orange-50 text-orange-700' },
};

// ── Small reusable label ──────────────────────────────────────────
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1.5">
        {children}
    </label>
);

const selectCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all";

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    index,
    topics,
    tags,
    onUpdate,
    onDelete,
}) => {
    const [showMediaLinks, setShowMediaLinks] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [showExplanation, setShowExplanation] = useState(
        !!(question.explanation || question.explanation_content)
    );

    const diff = DIFFICULTY_CONFIG[question.difficulty_level as keyof typeof DIFFICULTY_CONFIG]
        ?? DIFFICULTY_CONFIG.easy;
    const typeInfo = TYPE_CONFIG[question.question_type as string]
        ?? { label: question.question_type as string, badge: 'bg-gray-100 text-gray-600' };

    // ── Option helpers ──────────────────────────────────────────────

    const addOption = () => {
        onUpdate({
            options: [
                ...question.options,
                {
                    option_text: '',
                    option_content: null,
                    is_correct: false,
                    display_order: question.options.length + 1,
                },
            ],
        });
    };

    const updateOption = (idx: number, fields: Partial<OptionLocal>) => {
        onUpdate({
            options: question.options.map((o, i) => (i === idx ? { ...o, ...fields } : o)),
        });
    };

    const toggleCorrect = (idx: number) => {
        const isMultiple = question.question_type === 'multiple_choice';
        onUpdate({
            options: question.options.map((o, i) => ({
                ...o,
                is_correct: isMultiple
                    ? i === idx ? !o.is_correct : o.is_correct
                    : i === idx,
            })),
        });
    };

    const removeOption = (idx: number) => {
        onUpdate({
            options: question.options
                .filter((_, i) => i !== idx)
                .map((o, i) => ({ ...o, display_order: i + 1 })),
        });
    };

    // ── Options renderer ────────────────────────────────────────────

    const renderOptions = () => {
        if (['multiple_choice', 'ordering', 'fill_in_blank'].includes(question.question_type as string)) {
            return (
                <div className="space-y-2.5">
                    <FieldLabel>
                        {question.question_type === 'multiple_choice'
                            ? 'Answer Options — check all correct answers'
                            : question.question_type === 'fill_in_blank'
                                ? 'Accepted Answers — mark the primary answer'
                                : 'Items to Order — mark correct sequence with radio'}
                    </FieldLabel>

                    {question.options.map((opt, idx) => (
                        <div
                            key={idx}
                            className={`group flex items-start gap-3 p-3 rounded-xl border transition-all ${opt.is_correct
                                ? 'border-emerald-200 bg-emerald-50/60'
                                : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                                }`}
                        >
                            {/* Drag handle (visual only) */}
                            <div className="pt-2.5 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0">
                                <GripVertical size={14} className="text-gray-400" />
                            </div>

                            {/* Correct toggle */}
                            <div className="pt-2.5 flex-shrink-0">
                                {question.question_type === 'multiple_choice' ? (
                                    <button
                                        type="button"
                                        onClick={() => toggleCorrect(idx)}
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${opt.is_correct
                                            ? 'bg-emerald-500 border-emerald-500'
                                            : 'border-gray-300 hover:border-emerald-400'
                                            }`}
                                        title="Mark as correct"
                                    >
                                        {opt.is_correct && <CheckCircle2 size={12} className="text-white" />}
                                    </button>
                                ) : (
                                    <input
                                        type="radio"
                                        name={`correct-${question.id}`}
                                        checked={!!opt.is_correct}
                                        onChange={() => toggleCorrect(idx)}
                                        className="w-4 h-4 accent-emerald-500 cursor-pointer"
                                        title="Mark as correct"
                                    />
                                )}
                            </div>

                            {/* Option number */}
                            <span className={`pt-2.5 text-xs font-bold w-5 flex-shrink-0 ${opt.is_correct ? 'text-emerald-600' : 'text-gray-300'
                                }`}>
                                {String.fromCharCode(65 + idx)}
                            </span>

                            {/* Editor */}
                            <div className="flex-1 min-w-0">
                                <OptionEditor
                                    value={opt.option_content ?? undefined}
                                    plainTextFallback={opt.option_text}         // ← add this
                                    onChange={(json, plainText) =>
                                        updateOption(idx, { option_content: json, option_text: plainText })
                                    }
                                    placeholder={`Option ${String.fromCharCode(65 + idx)}…`}
                                />
                            </div>

                            {/* Remove */}
                            <button
                                onClick={() => removeOption(idx)}
                                className="pt-2.5 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all flex-shrink-0"
                                title="Remove option"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={addOption}
                        className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors mt-1 px-1"
                    >
                        <Plus size={15} /> Add option
                    </button>
                </div>
            );
        }

        if (question.question_type === 'true_false') {
            return (
                <div>
                    <FieldLabel>Correct Answer</FieldLabel>
                    <div className="flex gap-3">
                        {(['true', 'false'] as const).map((val) => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => onUpdate({ correct_answer: val })}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold text-sm capitalize transition-all ${question.correct_answer === val
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm'
                                    : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                                    }`}
                            >
                                {question.correct_answer === val && (
                                    <CheckCircle2 size={14} className="inline mr-1.5 -mt-0.5" />
                                )}
                                {val.charAt(0).toUpperCase() + val.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        // Essay
        return (
            <div className="w-full px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 italic text-center bg-gray-50/50">
                Students will type their answer in an open text field
            </div>
        );
    };

    // ── Main render ─────────────────────────────────────────────────

    return (
        <>
            <ImageUploadModal
                isOpen={showImageUpload}
                onClose={() => setShowImageUpload(false)}
                onUpload={(url) => {
                    onUpdate({ image_url: url });
                    setShowImageUpload(false);
                }}
            />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">

                {/* ── Header ───────────────────────────────────────────── */}
                <div className="px-6 py-3.5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {/* Question number pill */}
                        <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{index + 1}</span>
                        </div>

                        {/* Type badge */}
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeInfo.badge}`}>
                            {typeInfo.label}
                        </span>

                        {/* Difficulty badge */}
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${diff.color}`}>
                            {diff.label}
                        </span>

                        {/* Points */}
                        <span className="text-xs text-gray-400 font-medium">
                            {question.points} pt{question.points !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <button
                        onClick={onDelete}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Delete question"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>

                <div className="p-6 space-y-6">

                    {/* ── Question text + topic ─────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3 space-y-1.5">
                            <FieldLabel>Question</FieldLabel>

                            <QuestionEditor
                                value={question.question_content ?? undefined}
                                plainTextFallback={question.question_text}
                                onChange={(json, plainText) =>
                                    onUpdate({ question_content: json, question_text: plainText })
                                }
                                minHeight="110px"
                            />

                        </div>

                        <div className="space-y-4">
                            <div>
                                <FieldLabel>Topic</FieldLabel>
                                <select
                                    value={question.topic_id}
                                    onChange={(e) => onUpdate({ topic_id: e.target.value })}
                                    className={selectCls}
                                >
                                    <option value="">Select topic…</option>
                                    {topics.map((t) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <FieldLabel>Points</FieldLabel>
                                <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={question.points}
                                    onChange={(e) => onUpdate({ points: Number(e.target.value) || 1 })}
                                    className={selectCls}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Metadata row ─────────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <FieldLabel>Question Type</FieldLabel>
                            <select
                                value={question.question_type}
                                onChange={(e) => onUpdate({ question_type: e.target.value, options: [] })}
                                className={selectCls}
                            >
                                <option value="multiple_choice">Multiple Choice</option>
                                <option value="true_false">True / False</option>
                                <option value="fill_in_blank">Fill in Blank</option>
                                <option value="essay">Essay</option>
                                <option value="ordering">Ordering</option>
                            </select>
                        </div>

                        <div>
                            <FieldLabel>Difficulty</FieldLabel>
                            <select
                                value={question.difficulty_level}
                                onChange={(e) => onUpdate({ difficulty_level: e.target.value })}
                                className={selectCls}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                                <option value="expert">Expert</option>
                            </select>
                        </div>

                        <div>
                            <FieldLabel>Time Limit</FieldLabel>
                            <div className="relative">
                                <input
                                    type="number"
                                    min={0}
                                    placeholder="No limit"
                                    value={question.time_limit_seconds ?? ''}
                                    onChange={(e) =>
                                        onUpdate({
                                            time_limit_seconds: e.target.value ? Number(e.target.value) : null,
                                        })
                                    }
                                    className={selectCls}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                    sec
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Tags ─────────────────────────────────────────── */}
                    <div>
                        <FieldLabel>Tags</FieldLabel>
                        <Select
                            items={tags}
                            placeholder="Add tags…"
                            selectionMode="multiple"
                            variant="bordered"
                            selectedKeys={new Set(question.tag_ids || [])}
                            onSelectionChange={(keys) =>
                                onUpdate({ tag_ids: Array.from(keys) as string[] })
                            }
                            classNames={{
                                trigger: 'border-gray-200 rounded-xl shadow-none hover:border-orange-300 min-h-[44px]',
                            }}
                            renderValue={(items: SelectedItems<TagItem>) => (
                                <div className="flex flex-wrap gap-1 py-0.5">
                                    {items.map((item) => (
                                        <Chip
                                            key={item.key}
                                            size="sm"
                                            variant="flat"
                                            className="bg-orange-100 text-orange-700 text-xs"
                                        >
                                            {item.data?.name}
                                        </Chip>
                                    ))}
                                </div>
                            )}
                        >
                            {(tag) => (
                                <SelectItem key={tag.id} textValue={tag.name}>
                                    {tag.name}
                                </SelectItem>
                            )}
                        </Select>
                    </div>

                    {/* ── Divider ──────────────────────────────────────── */}
                    <div className="border-t border-gray-100" />

                    {/* ── Options / answer area ─────────────────────────  */}
                    {renderOptions()}

                    {/* ── Explanation (collapsible) ─────────────────────  */}
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setShowExplanation((v) => !v)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors ${showExplanation
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-gray-50 text-gray-500 hover:bg-amber-50/50 hover:text-amber-600'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <Lightbulb size={15} />
                                Explanation
                                <span className="text-xs font-normal opacity-60">
                                    (shown after submission)
                                </span>
                            </span>
                            <ChevronDown
                                size={15}
                                className={`transition-transform ${showExplanation ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {showExplanation && (
                            <div className="p-4 border-t border-amber-100 bg-amber-50/30">
                                <QuestionEditor
                                    value={question.explanation_content ?? undefined}
                                    onChange={(json, plainText) =>
                                        onUpdate({
                                            explanation_content: json,
                                            explanation: plainText,
                                        })
                                    }
                                    minHeight="80px"
                                />
                            </div>
                        )}
                    </div>

                    {/* ── Question image preview ────────────────────────── */}
                    {question.image_url && (
                        <div className="relative inline-block">
                            <img
                                src={question.image_url}
                                alt="Question visual"
                                className="max-h-40 rounded-xl border border-gray-200 shadow-sm"
                            />
                            <button
                                onClick={() => onUpdate({ image_url: '' })}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow hover:bg-red-600 transition-colors"
                                title="Remove image"
                            >
                                <Trash2 size={11} />
                            </button>
                        </div>
                    )}

                    {/* ── Footer actions ────────────────────────────────── */}
                    <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                        <button
                            onClick={() => setShowImageUpload(true)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-orange-500 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
                        >
                            <Upload size={13} />
                            {question.image_url ? 'Change image' : 'Add image'}
                        </button>
                        <button
                            onClick={() => setShowMediaLinks((v) => !v)}
                            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors px-3 py-2 rounded-lg ${showMediaLinks
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                                }`}
                        >
                            <Link2 size={13} />
                            Media links
                        </button>
                    </div>

                    {showMediaLinks && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 -mt-2">
                            <div>
                                <FieldLabel>Audio URL</FieldLabel>
                                <input
                                    placeholder="https://…"
                                    value={question.audio_url}
                                    onChange={(e) => onUpdate({ audio_url: e.target.value })}
                                    className={selectCls}
                                />
                            </div>
                            <div>
                                <FieldLabel>Video URL</FieldLabel>
                                <input
                                    placeholder="https://…"
                                    value={question.video_url}
                                    onChange={(e) => onUpdate({ video_url: e.target.value })}
                                    className={selectCls}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};