import React, { useState } from 'react';
import { ChevronLeft, Link2, Upload, Trash2, Plus, X, CheckCircle, AlertCircle, FileUp, Download, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from "react-router";
import { ApiSDK } from '../../sdk';
import { QueryKeys } from "../../utils/queryKeys";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { DifficultyLevel, QuestionCreate, QuestionType } from "../../sdk/generated";

// Types
interface Option {
    option_text: string;
    is_correct: boolean;
    display_order: number;
}
interface Question {
    id: string;
    subject_id: string,
    question_text: string;
    topic_id: string;
    question_type: string;
    difficulty_level: string;
    points: number;
    time_limit_seconds: number | null;
    explanation: string;
    options: Option[];
    correct_answer?: string;
    audio_url: string;
    image_url: string;
    video_url: string;
}

interface Topic {
    id: string;
    name: string;
    code: string;
}

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (imageUrl: string) => void;
}

// Toast Notification Component
const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-50 border-green-200' :
        type === 'error' ? 'bg-red-50 border-red-200' :
            'bg-blue-50 border-blue-200';

    const textColor = type === 'success' ? 'text-green-800' :
        type === 'error' ? 'text-red-800' :
            'text-blue-800';

    const Icon = type === 'success' ? CheckCircle : AlertCircle;
    const iconColor = type === 'success' ? 'text-green-500' :
        type === 'error' ? 'text-red-500' :
            'text-blue-500';

    return (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg border shadow-lg ${bgColor} ${textColor} animate-slideIn`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
            <p className="font-medium">{message}</p>
            <button onClick={onClose} className="ml-2">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

// Image Upload Modal Component
const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const uploadMutation = useMutation({
        mutationFn: (file: File) => ApiSDK.UploadService.uploadImageApiV1UploadImagePost(file),
        onSuccess: (response) => {
            onUpload(response.url);
            onClose();
            setSelectedFile(null);
            setPreview(null);
        },
        onError: (error) => {
            console.error('Upload error:', error);
        }
    });

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
                setPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
                setPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            uploadMutation.mutate(selectedFile);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreview(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-scaleIn">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Upload Question Image</h2>
                        <p className="text-sm text-gray-500 mt-1">Add an image to your question</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded-lg p-2"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-3 border-dashed rounded-xl p-12 text-center transition-all ${dragActive
                            ? 'border-orange-500 bg-orange-50 scale-[1.02]'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                            }`}
                    >
                        {preview ? (
                            <div className="space-y-4">
                                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                                <p className="text-gray-900 font-medium">{selectedFile?.name}</p>
                            </div>
                        ) : (
                            <>
                                <ImageIcon className={`w-16 h-16 mx-auto mb-4 ${dragActive ? 'text-orange-500' : 'text-gray-400'}`} />
                                <p className="text-gray-900 font-bold text-lg mb-2">
                                    Drag & drop your image here
                                </p>
                                <p className="text-gray-500 text-sm mb-6">or click below to browse</p>
                            </>
                        )}
                        <label className="inline-block px-8 py-3 bg-white border-2 border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all font-semibold text-gray-700">
                            <span>{preview ? 'Change Image' : 'Browse Files'}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="text-center">
                        <span className="inline-block px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                            Supported formats: JPG, PNG, GIF, WebP
                        </span>
                    </div>

                    {uploadMutation.isError && (
                        <div className="text-red-600 text-sm text-center">
                            Failed to upload image. Please try again.
                        </div>
                    )}
                </div>

                <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                    <button
                        onClick={handleClose}
                        className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploadMutation.isPending}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedFile && !uploadMutation.isPending
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {uploadMutation.isPending ? 'Uploading...' : 'Upload Image'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Bulk Upload Modal Component
const BulkUploadModal: React.FC<{ onClose: () => void; onUpload: (file: File) => void }> = ({ onClose, onUpload }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            onUpload(selectedFile);
            onClose();
        }
    };

    const downloadTemplate = () => {
        const csvContent = `Question Text,Topic ID,Question Type,Difficulty Level,Points,Time Limit (seconds),Explanation,Option 1,Option 2,Option 3,Option 4,Correct Answer Index,Audio URL,Image URL,Video URL
"What is Newton's first law of motion?","topic-id-here","multiple_choice","medium","10","60","An object at rest stays at rest...","An object at rest stays at rest","An object in motion stays in motion","Both A and B","None of the above","3","","",""
"The Earth revolves around the Sun","topic-id-here","true_false","easy","5","30","The Earth orbits the Sun","True","False","","","1","","",""`;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questions_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Bulk Upload Questions</h2>
                        <p className="text-sm text-gray-500 mt-1">Import multiple questions at once</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded-lg p-2"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-xl p-6">
                        <h3 className="font-bold text-blue-900 mb-3 text-lg">📋 How to Upload</h3>
                        <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                            <li className="font-medium">Download the CSV template below</li>
                            <li className="font-medium">Fill in your questions following the format</li>
                            <li className="font-medium">Upload the completed CSV file</li>
                            <li className="font-medium">Review and save your questions</li>
                        </ol>
                    </div>

                    <button
                        onClick={downloadTemplate}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                        <Download className="w-5 h-5" />
                        Download CSV Template
                    </button>

                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-3 border-dashed rounded-xl p-12 text-center transition-all ${dragActive
                            ? 'border-orange-500 bg-orange-50 scale-[1.02]'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                            }`}
                    >
                        <FileUp className={`w-16 h-16 mx-auto mb-4 ${dragActive ? 'text-orange-500' : 'text-gray-400'}`} />
                        <p className="text-gray-900 font-bold text-lg mb-2">
                            {selectedFile ? selectedFile.name : 'Drag & drop your CSV file here'}
                        </p>
                        <p className="text-gray-500 text-sm mb-6">or click below to browse</p>
                        <label className="inline-block px-8 py-3 bg-white border-2 border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all font-semibold text-gray-700">
                            <span>Browse Files</span>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="text-center">
                        <span className="inline-block px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                            Supported format: CSV (Comma-separated values)
                        </span>
                    </div>
                </div>

                <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedFile
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Upload Questions
                    </button>
                </div>
            </div>
        </div>
    );
};

// Question Card Component
const QuestionCard: React.FC<{
    question: Question;
    index: number;
    topics: Topic[];
    onUpdate: (question: Question) => void;
    onDelete: () => void;
}> = ({ question, index, topics, onUpdate, onDelete }) => {
    const [showMediaLinks, setShowMediaLinks] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);

    const updateQuestion = (updates: Partial<Question>) => {
        onUpdate({ ...question, ...updates });
    };

    const addOption = () => {
        const newOption: Option = {
            option_text: '',
            is_correct: false,
            display_order: question.options.length + 1
        };
        updateQuestion({
            options: [...question.options, newOption]
        });
    };

    const updateOption = (index: number, text: string) => {
        const updatedOptions = question.options.map((opt, idx) =>
            idx === index ? { ...opt, option_text: text } : opt
        );
        updateQuestion({ options: updatedOptions });
    };

    const removeOption = (index: number) => {
        const updatedOptions = question.options.filter((_, idx) => idx !== index);
        updateQuestion({ options: updatedOptions });
    };

    const setCorrectOption = (index: number) => {
        const updatedOptions = question.options.map((opt, idx) => ({
            ...opt,
            is_correct: idx === index
        }));
        updateQuestion({ options: updatedOptions });
    };

    const handleImageUpload = (imageUrl: string) => {
        updateQuestion({ image_url: imageUrl });
    };

    const renderQuestionTypeFields = () => {
        switch (question.question_type) {
            case 'multiple_choice':
                return (
                    <div className="space-y-3">
                        {question.options.map((option, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        type="radio"
                                        name={`correct-${question.id}`}
                                        checked={option.is_correct}
                                        onChange={() => setCorrectOption(idx)}
                                        className="w-5 h-5 text-orange-500 cursor-pointer"
                                    />
                                    <span className="text-sm font-medium text-gray-400 w-6">{idx + 1}.</span>
                                    <input
                                        type="text"
                                        placeholder="Type your option"
                                        value={option.option_text}
                                        onChange={(e) => updateOption(idx, e.target.value)}
                                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                            <Plus className="w-4 h-4" />
                            Add option
                        </button>
                    </div>
                );

            case 'true_false':
                return (
                    <div className="space-y-3">
                        {['True', 'False'].map((label, idx) => (
                            <div key={label} className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name={`tf-${question.id}`}
                                    checked={question.correct_answer === label.toLowerCase()}
                                    onChange={() => updateQuestion({ correct_answer: label.toLowerCase() })}
                                    className="w-5 h-5 text-orange-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-400 w-6">{idx + 1}.</span>
                                <div className="flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'ordering':
                return (
                    <div className="space-y-3">
                        {question.options.map((option, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 w-6">{idx + 1}.</span>
                                <input
                                    type="text"
                                    placeholder="Type your option"
                                    value={option.option_text}
                                    onChange={(e) => updateOption(idx, e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                            <Plus className="w-4 h-4" />
                            Add option
                        </button>
                    </div>
                );

            case 'essay':
            case 'fill_in_blank':
                return (
                    <textarea
                        placeholder="Students will type their answer here..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px] resize-none"
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
                onUpload={handleImageUpload}
            />
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-700">Question {index + 1}.</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="What is Newton's first law of motion?"
                            value={question.question_text}
                            onChange={(e) => updateQuestion({ question_text: e.target.value })}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <select
                            value={question.topic_id}
                            onChange={(e) => updateQuestion({ topic_id: e.target.value })}
                            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white min-w-[150px]"
                        >
                            <option value="">Select Topic</option>
                            {topics.map(topic => (
                                <option key={topic.id} value={topic.id}>
                                    {topic.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <select
                            value={question.question_type}
                            onChange={(e) => updateQuestion({ question_type: e.target.value })}
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
                            onChange={(e) => updateQuestion({ difficulty_level: e.target.value })}
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
                            onChange={(e) => updateQuestion({ points: parseInt(e.target.value) || 1 })}
                            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            min="1"
                        />
                        <input
                            type="number"
                            placeholder="Time Limit (seconds)"
                            value={question.time_limit_seconds || ''}
                            onChange={(e) => updateQuestion({ time_limit_seconds: e.target.value ? parseInt(e.target.value) : null })}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <textarea
                        placeholder="Explanation (optional)"
                        value={question.explanation}
                        onChange={(e) => updateQuestion({ explanation: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[80px] resize-none"
                    />

                    {renderQuestionTypeFields()}

                    {question.image_url && (
                        <div className="border border-gray-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Question Image:</p>
                            <img src={question.image_url} alt="Question" className="max-h-48 rounded-lg" />
                        </div>
                    )}

                    {showMediaLinks && (
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <input
                                type="text"
                                placeholder="Audio URL"
                                value={question.audio_url}
                                onChange={(e) => updateQuestion({ audio_url: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                                type="text"
                                placeholder="Video URL"
                                value={question.video_url}
                                onChange={(e) => updateQuestion({ video_url: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowMediaLinks(!showMediaLinks)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Link2 className="w-4 h-4" />
                                Link to Media
                            </button>
                            <button
                                onClick={() => setShowImageUpload(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
                            >
                                <Upload className="w-4 h-4" />
                                Upload Image
                            </button>
                        </div>
                        <button
                            onClick={onDelete}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-600 font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

// Main Component
export default function QuestionCreationPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<Question[]>([
        {
            id: '1',
            subject_id: id as string,
            question_text: '',
            topic_id: '',
            question_type: 'multiple_choice' as QuestionType,
            difficulty_level: 'easy' as DifficultyLevel,
            points: 1,
            time_limit_seconds: null,
            explanation: '',
            options: [],
            audio_url: '',
            image_url: '',
            video_url: ''
        }
    ]);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [showBulkUpload, setShowBulkUpload] = useState(false);

    // Fetch topics using React Query
    const { data: topicsData, isLoading: loadingTopics } = useQuery({
        queryKey: [QueryKeys.singleSubject, id],
        queryFn: () =>
            ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(
                id as string
            ),
        enabled: !!id,
    });

    const topics = topicsData?.items || [];

    // Save questions mutation
    const saveQuestionsMutation = useMutation({
        mutationFn: (questionsPayload: any[]) =>
            ApiSDK.TopicQuestionsService.createBulkQuestionApiV1QuestionsBulkQuestionsPost(questionsPayload),
        onSuccess: () => {
            showToast('Questions saved successfully!', 'success');
            setTimeout(() => {
                navigate(`/dashboard/subjects/${id}`);
            }, 1500);
        },
        onError: (error) => {
            console.error('Error saving questions:', error);
            showToast('Failed to save questions. Please try again.', 'error');
        }
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const addQuestion = () => {
        const newQuestion: Question = {
            id: `q-${Date.now()}`,
            subject_id: id as string,
            question_text: '',
            topic_id: '',
            question_type: 'multiple_choice' as QuestionType,
            difficulty_level: 'easy' as DifficultyLevel,
            points: 1,
            time_limit_seconds: null,
            explanation: '',
            options: [],
            audio_url: '',
            image_url: '',
            video_url: ''
        };
        setQuestions([...questions, newQuestion]);
        showToast('New question added', 'info');
    };

    const updateQuestion = (id: string, updatedQuestion: Question) => {
        setQuestions(questions.map(q => q.id === id ? updatedQuestion : q));
    };

    const deleteQuestion = (id: string) => {
        if (questions.length > 1) {
            setQuestions(questions.filter(q => q.id !== id));
            showToast('Question deleted', 'info');
        } else {
            showToast('You must have at least one question', 'error');
        }
    };

    const handleBulkUpload = async (file: File) => {
        showToast('Processing CSV file...', 'info');

        try {
            const text = await file.text();
            const lines = text.split('\n');
            const newQuestions: Question[] = [];

            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim()) {
                    const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').trim());
                    const rawLevel = values[3]?.toLowerCase() as DifficultyLevel;
                    const difficulty = ['easy', 'medium', 'hard'].includes(rawLevel)
                        ? rawLevel
                        : 'easy';

                    const rawQuestionType = values[3]?.toLowerCase() as QuestionType;
                    const question_type = ["multiple_choice", "true_false", "fill_in_blank", "essay", "matching", "ordering"].includes(rawQuestionType)
                        ? rawQuestionType
                        : 'multiple_choice';

                    const question: Question = {
                        id: `q-${Date.now()}-${i}`,
                        subject_id: id as string,
                        question_text: values[0] || '',
                        topic_id: values[1] || '',
                        question_type: question_type,
                        difficulty_level: difficulty,
                        points: parseInt(values[4]) || 1,
                        time_limit_seconds: values[5] ? parseInt(values[5]) : null,
                        explanation: values[6] || '',
                        options: [],
                        audio_url: values[12] || '',
                        image_url: values[13] || '',
                        video_url: values[14] || '',
                    };

                    // Add options if present
                    const optionTexts = [values[7], values[8], values[9], values[10]].filter(Boolean);
                    const correctIndex = parseInt(values[11]) || 1;

                    question.options = optionTexts.map((text, idx) => ({
                        option_text: text,
                        is_correct: idx + 1 === correctIndex,
                        display_order: idx + 1
                    }));

                    newQuestions.push(question);
                }
            }

            setQuestions([...questions, ...newQuestions]);
            showToast(`Successfully imported ${newQuestions.length} questions`, 'success');
        } catch (error) {
            console.error('Error parsing CSV:', error);
            showToast('Failed to parse CSV file', 'error');
        }
    };

    const validateQuestions = (): boolean => {
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

            // Validate options for multiple choice
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

            // Validate ordering questions
            if (q.question_type === 'ordering' && q.options.length < 2) {
                showToast('Ordering questions must have at least 2 options', 'error');
                return false;
            }
        }
        return true;
    };

    const saveQuestions = () => {
        if (!validateQuestions()) {
            return;
        }

        // Map questions to API format
        const questionsPayload = questions.map(q => ({
            subject_id: id,
            topic_id: q.topic_id,
            question_text: q.question_text,
            question_type: q.question_type,
            difficulty_level: q.difficulty_level,
            points: q.points,
            time_limit_seconds: q.time_limit_seconds,
            explanation: q.explanation || null,
            image_url: q.image_url || null,
            audio_url: q.audio_url || null,
            video_url: q.video_url || null,
            options: q.options
        }));
        console.log(questionsPayload);
        saveQuestionsMutation.mutate(questionsPayload);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}

                {showBulkUpload && (
                    <BulkUploadModal
                        onClose={() => setShowBulkUpload(false)}
                        onUpload={handleBulkUpload}
                    />
                )}

                <div className="mb-8">
                    <button
                        onClick={() => navigate(`/dashboard/subjects/${id}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back to Subject</span>
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Questions</h1>
                            <p className="text-gray-600 text-lg">Build engaging questions for your students</p>
                        </div>
                        <button
                            onClick={() => setShowBulkUpload(true)}
                            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            <FileUp className="w-5 h-5" />
                            Bulk Upload
                        </button>
                    </div>
                </div>

                {loadingTopics ? (
                    <div className="text-center py-12">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading topics...</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6 mb-6">
                            {questions.map((question, index) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    index={index}
                                    topics={topics}
                                    onUpdate={(updated) => updateQuestion(question.id, updated)}
                                    onDelete={() => deleteQuestion(question.id)}
                                />
                            ))}
                        </div>

                        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-100 px-6 py-4">
                            <button
                                onClick={addQuestion}
                                className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add Question
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={saveQuestions}
                                    disabled={saveQuestionsMutation.isPending}
                                    className={`px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 font-medium transition-all shadow-lg ${saveQuestionsMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {saveQuestionsMutation.isPending ? 'Saving...' : 'Save Questions'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
        </div>
    );
}