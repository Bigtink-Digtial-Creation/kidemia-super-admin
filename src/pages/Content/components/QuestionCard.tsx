import React, { useState } from 'react';
import { Link2, Upload, Trash2, Plus, } from 'lucide-react';
import { Select, SelectItem, Chip, type SelectedItems } from '@heroui/react';
import type { QuestionLocal, Topic } from '../questions/question.types';
import { ImageUploadModal } from '../../../components/Modals/ImageUploadModal';

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

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    index,
    topics,
    tags,
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
        const isMultipleChoice = question.question_type === 'multiple_choice';
        onUpdate({
            options: question.options.map((o, i) => ({
                ...o,
                is_correct: i === idx ? !o.is_correct : (isMultipleChoice ? o.is_correct : false)
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

    const renderQuestionTypeFields = () => {
        if (['multiple_choice', 'ordering'].includes(question.question_type)) {
            return (
                <div className="space-y-3">
                    {question.options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <div className="flex items-center gap-2 flex-1">
                                {question.question_type === 'multiple_choice' && (
                                    <input
                                        type="radio"
                                        name={`correct-${question.id}`}
                                        checked={!!opt.is_correct}
                                        onChange={() => toggleOptionCorrect(idx)}
                                        className="w-5 h-5 text-orange-500 cursor-pointer"
                                    />
                                )}
                                <span className="text-sm font-medium text-gray-400 w-6">{idx + 1}.</span>
                                <input
                                    type="text"
                                    placeholder="Type your option"
                                    value={opt.option_text}
                                    onChange={(e) => updateOptionText(idx, e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <button onClick={() => removeOption(idx)} className="text-red-400 hover:text-red-600 p-2">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button onClick={addOption} className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium mt-2">
                        <Plus className="w-4 h-4" /> Add option
                    </button>
                </div>
            );
        }

        if (question.question_type === 'true_false') {
            return (
                <div className="flex gap-4">
                    {['true', 'false'].map((label) => (
                        <button
                            key={label}
                            onClick={() => onUpdate({ correct_answer: label })}
                            className={`flex-1 py-3 px-4 rounded-lg border font-medium capitalize transition-all ${question.correct_answer === label
                                ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm'
                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            );
        }

        return <textarea placeholder="Students will type their answer here..." className="w-full px-4 py-3 border border-gray-200 rounded-lg min-h-[100px] bg-gray-50 italic text-gray-400" disabled />;
    };

    return (
        <>
            <ImageUploadModal isOpen={showImageUpload} onClose={() => setShowImageUpload(false)} onUpload={(url) => { onUpdate({ image_url: url }); setShowImageUpload(false); }} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Question {index + 1}</span>
                    <button onClick={onDelete} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Question Text</label>
                            <input
                                type="text"
                                value={question.question_text}
                                onChange={(e) => onUpdate({ question_text: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Topic</label>
                            <select
                                value={question.topic_id}
                                onChange={(e) => onUpdate({ topic_id: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white mt-1"
                            >
                                <option value="">Select Topic</option>
                                {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            items={tags}
                            label="Tags"
                            labelPlacement="outside"
                            placeholder="Add tags..."
                            selectionMode="multiple"
                            variant="bordered"
                            selectedKeys={new Set(question.tag_ids || [])}
                            onSelectionChange={(keys) => onUpdate({ tag_ids: Array.from(keys) as string[] })}
                            classNames={{
                                trigger: "min-h-[48px] border-gray-200 rounded-lg shadow-none",
                                label: "text-[10px] font-bold text-gray-400 uppercase !text-gray-400",
                            }}
                            renderValue={(items: SelectedItems<TagItem>) => (
                                <div className="flex flex-wrap gap-1">
                                    {items.map((item) => (
                                        <Chip key={item.key} size="sm" variant="flat" className="bg-orange-100 text-orange-700">
                                            {item.data?.name}
                                        </Chip>
                                    ))}
                                </div>
                            )}
                        >
                            {(tag) => <SelectItem key={tag.id} textValue={tag.name}>{tag.name}</SelectItem>}
                        </Select>

                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Question Type</label>
                            <select
                                value={question.question_type}
                                onChange={(e) => onUpdate({ question_type: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white mt-1"
                            >
                                <option value="multiple_choice">Multiple choice</option>
                                <option value="true_false">True/False</option>
                                <option value="fill_in_blank">Fill in blank</option>
                                <option value="essay">Essay</option>
                                <option value="ordering">Ordering</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Difficulty</label>
                            <select
                                value={question.difficulty_level}
                                onChange={(e) => onUpdate({ difficulty_level: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white mt-1"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    {renderQuestionTypeFields()}

                    {question.image_url && (
                        <div className="relative inline-block mt-2">
                            <img src={question.image_url} alt="Question" className="max-h-32 rounded-lg border border-gray-200 shadow-sm" />
                            <button onClick={() => onUpdate({ image_url: '' })} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors">
                                <Trash2 size={12} />
                            </button>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <button onClick={() => setShowImageUpload(true)} className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-600">
                            <Upload size={16} /> {question.image_url ? 'Change Image' : 'Upload Image'}
                        </button>
                        <button onClick={() => setShowMediaLinks(!showMediaLinks)} className="flex items-center gap-2 text-sm font-bold text-blue-500 hover:text-blue-600">
                            <Link2 size={16} /> Media Links
                        </button>
                    </div>

                    {showMediaLinks && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                            <input placeholder="Audio URL" value={question.audio_url} onChange={(e) => onUpdate({ audio_url: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                            <input placeholder="Video URL" value={question.video_url} onChange={(e) => onUpdate({ video_url: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};