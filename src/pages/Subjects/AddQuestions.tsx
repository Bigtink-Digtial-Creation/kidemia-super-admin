import React, { useState } from 'react';
import {
  ChevronLeft,
  Link2,
  Upload,
  Trash2,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  FileUp,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { useNavigate, useParams } from "react-router";
import { ApiSDK } from '../../sdk';
import { QueryKeys } from "../../utils/queryKeys";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { DifficultyLevel, QuestionCreate, QuestionType } from "../../sdk/generated";

/* ---------------------------
   Local TypeScript interfaces
   --------------------------- */

interface OptionLocal {
  option_text: string;
  is_correct: boolean;
  display_order: number; // local UI field name (will map to option_order)
  explanation?: string | null;
  image_url?: string | null;
  // match_pair_id, correct_order omitted unless you support matching/ordering specifics
}

interface QuestionLocal {
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
  correct_answer?: string | null; // used for true_false (optional)
  audio_url: string;
  image_url: string;
  video_url: string;
  tag_ids?: string[] | null;
}

interface Topic {
  id: string;
  name: string;
  code?: string;
}

type ToastType = { message: string; type: 'success' | 'error' | 'info' } | null;

/* ---------------------------
   Runtime allowed values
   --------------------------- */

// We cannot reference the SDK types as runtime values (they're type-only).
// Define runtime arrays and type-guard functions to validate strings before casting.
const ALLOWED_QUESTION_TYPES = [
  'multiple_choice',
  'true_false',
  'fill_in_blank',
  'essay',
  'matching',
  'ordering'
] as const;
type AllowedQuestionType = typeof ALLOWED_QUESTION_TYPES[number];

const ALLOWED_DIFFICULTY_LEVELS = ['easy', 'medium', 'hard', 'expert'] as const;
type AllowedDifficultyLevel = typeof ALLOWED_DIFFICULTY_LEVELS[number];

function isValidQuestionType(v: string): v is AllowedQuestionType {
  return (ALLOWED_QUESTION_TYPES as readonly string[]).includes(v);
}
function isValidDifficultyLevel(v: string): v is AllowedDifficultyLevel {
  return (ALLOWED_DIFFICULTY_LEVELS as readonly string[]).includes(v);
}

/* ---------------------------
   Toast component
   --------------------------- */
const Toast: React.FC<{ toast: ToastType; onClose: () => void }> = ({ toast, onClose }) => {
  if (!toast) return null;
  const { message, type } = toast;
  const bg = type === 'success' ? 'bg-green-50 border-green-200' : type === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200';
  const text = type === 'success' ? 'text-green-800' : type === 'error' ? 'text-red-800' : 'text-blue-800';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const iconColor = type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-blue-500';

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg border shadow-lg ${bg} ${text} animate-slideIn`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <p className="font-medium">{message}</p>
      <button onClick={onClose} className="ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/* ---------------------------
   Image Upload Modal
   --------------------------- */

const ImageUploadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onUpload: (imageUrl: string) => void;
}> = ({ isOpen, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => ApiSDK.UploadService.uploadImageApiV1UploadImagePost(file),
    onSuccess: (response: any) => {
      // assume response has { url: string } like your earlier code
      onUpload(response.url);
      onClose();
      setSelectedFile(null);
      setPreview(null);
    },
    onError: (err) => {
      console.error('Upload failed', err);
    }
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) {
      setSelectedFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith('image/')) {
      setSelectedFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Upload Question Image</h2>
            <p className="text-sm text-gray-500 mt-0.5">Add an image to your question</p>
          </div>
          <button
            onClick={() => {
              setSelectedFile(null);
              setPreview(null);
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                ? 'border-orange-500 bg-orange-50 scale-[1.01]'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
          >
            {preview ? (
              <div className="space-y-3">
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                <p className="text-gray-900 text-sm font-medium">{selectedFile?.name}</p>
              </div>
            ) : (
              <>
                <ImageIcon
                  className={`w-12 h-12 mx-auto mb-3 ${dragActive ? 'text-orange-500' : 'text-gray-400'
                    }`}
                />
                <p className="text-gray-900 font-semibold text-base mb-1">
                  Drag & drop your image here
                </p>
                <p className="text-gray-500 text-xs mb-4">or click below to browse</p>
              </>
            )}

            <label className="inline-block px-6 py-2.5 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all text-sm font-medium text-gray-700">
              <span>{preview ? 'Change Image' : 'Browse Files'}</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              Supported formats: JPG, PNG, GIF, WebP
            </span>
          </div>

          {uploadMutation.isError && (
            <div className="text-red-600 text-sm text-center">
              Failed to upload image. Please try again.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
          <button
            onClick={() => {
              setSelectedFile(null);
              setPreview(null);
              onClose();
            }}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className={`px-6 py-2 rounded-lg text-sm font-semibold ${selectedFile && !uploadMutation.isPending
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
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

/* ---------------------------
   Bulk Upload Modal
   --------------------------- */

const BulkUploadModal: React.FC<{ isOpen: boolean; onClose: () => void; onUpload: (file: File) => void }> = ({ isOpen, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setSelectedFile(f);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setSelectedFile(f);
  };

  const handleConfirm = () => {
    if (!selectedFile) return;
    onUpload(selectedFile);
    onClose();
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
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-lg p-2"><X className="w-6 h-6" /></button>
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

          <button onClick={downloadTemplate} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold">
            <Download className="w-5 h-5" />
            Download CSV Template
          </button>

          <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            className={`border-3 border-dashed rounded-xl p-12 text-center transition-all ${dragActive ? 'border-orange-500 bg-orange-50 scale-[1.02]' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
            <FileUp className={`w-16 h-16 mx-auto mb-4 ${dragActive ? 'text-orange-500' : 'text-gray-400'}`} />
            <p className="text-gray-900 font-bold text-lg mb-2">{selectedFile ? selectedFile.name : 'Drag & drop your CSV file here'}</p>
            <p className="text-gray-500 text-sm mb-6">or click below to browse</p>
            <label className="inline-block px-8 py-3 bg-white border-2 border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all font-semibold text-gray-700">
              <span>Browse Files</span>
              <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div className="text-center"><span className="inline-block px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">Supported format: CSV</span></div>
        </div>

        <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold">Cancel</button>
          <button onClick={handleConfirm} disabled={!selectedFile} className={`px-8 py-3 rounded-xl font-semibold ${selectedFile ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>Upload Questions</button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------
   Question Card Component
   --------------------------- */

const QuestionCard: React.FC<{
  question: QuestionLocal;
  index: number;
  topics: Topic[];
  onUpdate: (fields: Partial<QuestionLocal>) => void;
  onDelete: () => void;
}> = ({ question, index, topics, onUpdate, onDelete }) => {
  const [showMediaLinks, setShowMediaLinks] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const addOption = () => {
    const newOpt: OptionLocal = { option_text: '', is_correct: false, display_order: question.options.length + 1 };
    onUpdate({ options: [...question.options, newOpt] });
  };

  const updateOptionText = (idx: number, text: string) => {
    onUpdate({ options: question.options.map((o, i) => (i === idx ? { ...o, option_text: text } : o)) });
  };

  const toggleOptionCorrect = (idx: number) => {
    onUpdate({ options: question.options.map((o, i) => ({ ...o, is_correct: i === idx ? !o.is_correct : o.is_correct })) });
  };

  const removeOption = (idx: number) => {
    onUpdate({ options: question.options.filter((_, i) => i !== idx).map((o, i) => ({ ...o, display_order: i + 1 })) });
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
                  <input type="radio" name={`correct-${question.id}`} checked={!!opt.is_correct} onChange={() => toggleOptionCorrect(idx)} className="w-5 h-5 text-orange-500 cursor-pointer" />
                  <span className="text-sm font-medium text-gray-400 w-6">{idx + 1}.</span>
                  <input type="text" placeholder="Type your option" value={opt.option_text} onChange={(e) => updateOptionText(idx, e.target.value)} className="flex-1 px-4 py-3 border border-gray-200 rounded-lg" />
                </div>
                <button onClick={() => removeOption(idx)} className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm">
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            ))}
            <button onClick={addOption} className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" /> Add option
            </button>
          </div>
        );

      case 'true_false':
        return (
          <div className="space-y-3">
            {['true', 'false'].map((label, idx) => (
              <div key={label} className="flex items-center gap-3">
                <input type="radio" name={`tf-${question.id}`} checked={question.correct_answer === label} onChange={() => onUpdate({ correct_answer: label })} className="w-5 h-5 text-orange-500 cursor-pointer" />
                <span className="text-sm font-medium text-gray-400 w-6">{idx + 1}.</span>
                <div className="flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">{label === 'true' ? 'True' : 'False'}</div>
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
                <input type="text" placeholder="Type your option" value={opt.option_text} onChange={(e) => updateOptionText(idx, e.target.value)} className="flex-1 px-4 py-3 border border-gray-200 rounded-lg" />
                <button onClick={() => removeOption(idx)} className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm">
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            ))}
            <button onClick={addOption} className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" /> Add option
            </button>
          </div>
        );

      case 'essay':
      case 'fill_in_blank':
        return <textarea placeholder="Students will type their answer here..." className="w-full px-4 py-3 border border-gray-200 rounded-lg min-h-[100px] resize-none" disabled />;

      default:
        return null;
    }
  };

  return (
    <>
      <ImageUploadModal isOpen={showImageUpload} onClose={() => setShowImageUpload(false)} onUpload={handleImageUploaded} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700">Question {index + 1}.</h3>
          <button className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <input type="text" placeholder="What is Newton's first law of motion?" value={question.question_text} onChange={(e) => onUpdate({ question_text: e.target.value })} className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <select value={question.topic_id} onChange={(e) => onUpdate({ topic_id: e.target.value })} className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white min-w-[150px]">
              <option value="">Select Topic</option>
              {topics.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
            </select>
          </div>

          <div className="flex gap-4">
            <select value={question.question_type} onChange={(e) => onUpdate({ question_type: e.target.value })} className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
              <option value="">Select Type</option>
              <option value="multiple_choice">Multiple choice</option>
              <option value="true_false">True/False</option>
              <option value="fill_in_blank">Fill in blank</option>
              <option value="essay">Essay</option>
              <option value="matching">Matching</option>
              <option value="ordering">Ordering</option>
            </select>
            <select value={question.difficulty_level} onChange={(e) => onUpdate({ difficulty_level: e.target.value })} className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white min-w-[150px]">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="flex gap-4">
            <input type="number" placeholder="Points" value={question.points} onChange={(e) => onUpdate({ points: Number(e.target.value) || 1 })} className="px-4 py-3 border border-gray-200 rounded-lg" min={1} />
            <input type="number" placeholder="Time Limit (seconds)" value={question.time_limit_seconds ?? ''} onChange={(e) => onUpdate({ time_limit_seconds: e.target.value ? Number(e.target.value) : null })} className="flex-1 px-4 py-3 border border-gray-200 rounded-lg" />
          </div>

          <textarea placeholder="Explanation (optional)" value={question.explanation} onChange={(e) => onUpdate({ explanation: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[80px] resize-none" />

          {renderQuestionTypeFields()}

          {question.image_url && (
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Question Image:</p>
              <img src={question.image_url} alt="Question" className="max-h-48 rounded-lg" />
            </div>
          )}

          {showMediaLinks && (
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <input type="text" placeholder="Audio URL" value={question.audio_url} onChange={(e) => onUpdate({ audio_url: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
              <input type="text" placeholder="Video URL" value={question.video_url} onChange={(e) => onUpdate({ video_url: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex gap-3">
              <button onClick={() => setShowMediaLinks(!showMediaLinks)} className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"><Link2 className="w-4 h-4" /> Link to Media</button>
              <button onClick={() => setShowImageUpload(true)} className="flex items-center gap-2 px-4 py-2 text-sm text-orange-500 hover:text-orange-600 font-medium"><Upload className="w-4 h-4" /> Upload Image</button>
            </div>
            <button onClick={onDelete} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-600 font-medium"><Trash2 className="w-4 h-4" /> Delete</button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ---------------------------
   Main Page Component
   --------------------------- */

export default function QuestionCreationPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuestionLocal[]>([
    {
      id: `q-${Date.now()}`,
      subject_id: id || '',
      question_text: '',
      topic_id: '',
      question_type: 'multiple_choice',
      difficulty_level: 'easy',
      points: 1,
      time_limit_seconds: null,
      explanation: '',
      options: [],
      audio_url: '',
      image_url: '',
      video_url: '',
      tag_ids: null
    }
  ]);

  const [toast, setToast] = useState<ToastType>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showImageModalForQuestionId, setShowImageModalForQuestionId] = useState<string | null>(null);

  const { data: topicsData, isLoading: loadingTopics } = useQuery({
    queryKey: [QueryKeys.singleSubject, id],
    queryFn: () => ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(id || ''),
    enabled: !!id,
  });

  const topics: Topic[] = topicsData?.items || [];

  const saveQuestionsMutation = useMutation({
    mutationFn: (payload: QuestionCreate[]) =>
      ApiSDK.TopicQuestionsService.createBulkQuestionApiV1QuestionsBulkQuestionsPost(payload),
    onSuccess: () => {
      showToastMessage('Questions saved successfully!', 'success');
      setTimeout(() => navigate(`/dashboard/subjects/${id}`), 1000);
    },
    onError: (err) => {
      console.error('Save questions error', err);
      showToastMessage('Failed to save questions. Please check your data and try again.', 'error');
    }
  });

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const addQuestion = () => {
    const q: QuestionLocal = {
      id: `q-${Date.now()}`,
      subject_id: id || '',
      question_text: '',
      topic_id: '',
      question_type: 'multiple_choice',
      difficulty_level: 'easy',
      points: 1,
      time_limit_seconds: null,
      explanation: '',
      options: [],
      audio_url: '',
      image_url: '',
      video_url: '',
      tag_ids: null
    };
    setQuestions(prev => [...prev, q]);
    showToastMessage('New question added', 'info');
  };

  const updateQuestion = (qid: string, updates: Partial<QuestionLocal>) => {
    setQuestions(prev => prev.map(q => q.id === qid ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (qid: string) => {
    if (questions.length <= 1) {
      showToastMessage('You must have at least one question', 'error');
      return;
    }
    setQuestions(prev => prev.filter(q => q.id !== qid));
    showToastMessage('Question deleted', 'info');
  };

  /* ---------------------------
     CSV Bulk parsing
     --------------------------- */
  const handleBulkUpload = async (file: File) => {
    showToastMessage('Processing CSV file...', 'info');
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length <= 1) {
        showToastMessage('CSV contains no rows', 'error');
        return;
      }
      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const newQuestions: QuestionLocal[] = [];

      for (let i = 1; i < lines.length; i++) {
        const raw = lines[i];
        if (!raw.trim()) continue;
        // split respecting quoted commas (simple approach)
        const values = raw.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(s => s.replace(/^"|"$/g, '').trim()) || [];
        // Column indices based on your template:
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
          subject_id: id || '',
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
          // ensure two options: True and False
          q.options = [
            { option_text: 'True', is_correct: correctIndex === 1, display_order: 1 },
            { option_text: 'False', is_correct: correctIndex === 2, display_order: 2 },
          ];
          // Also set correct_answer for UI convenience
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

      setQuestions(prev => [...prev, ...newQuestions]);
      showToastMessage(`Imported ${newQuestions.length} questions`, 'success');
    } catch (err) {
      console.error('CSV parse error', err);
      showToastMessage('Failed to parse CSV', 'error');
    }
  };

  /* ---------------------------
     Validation + Map to API payload
     --------------------------- */

  const validateQuestions = (): boolean => {
    for (const q of questions) {
      if (!q.question_text.trim()) { showToastMessage('Please fill in all question texts', 'error'); return false; }
      if (!q.topic_id) { showToastMessage('Please select a topic for all questions', 'error'); return false; }
      if (!q.question_type) { showToastMessage('Please select a question type for all questions', 'error'); return false; }

      if (q.question_type === 'multiple_choice') {
        if (q.options.length < 2) { showToastMessage('Multiple choice questions must have at least 2 options', 'error'); return false; }
        if (!q.options.some(opt => opt.is_correct)) { showToastMessage('Please mark the correct answer for all multiple choice questions', 'error'); return false; }
        if (q.options.some(opt => !opt.option_text.trim())) { showToastMessage('Please fill in all option texts', 'error'); return false; }
      }

      if (q.question_type === 'ordering' && q.options.length < 2) { showToastMessage('Ordering questions must have at least 2 options', 'error'); return false; }
    }
    return true;
  };

  const mapToApiPayload = (): QuestionCreate[] => {
    return questions.map(q => {
      // ensure values are valid runtime enums (cast after check)
      const question_type = isValidQuestionType(String(q.question_type).toLowerCase()) ? (String(q.question_type).toLowerCase() as QuestionType) : 'multiple_choice';
      const difficulty_level = isValidDifficultyLevel(String(q.difficulty_level).toLowerCase()) ? (String(q.difficulty_level).toLowerCase() as DifficultyLevel) : 'easy';

      // Map options to API shape
      const options = q.question_type === 'true_false'
        ? [
          { option_text: 'True', option_order: 1, is_correct: q.correct_answer === 'true' || q.options.some(o => o.option_text.toLowerCase() === 'true' && o.is_correct) },
          { option_text: 'False', option_order: 2, is_correct: q.correct_answer === 'false' || q.options.some(o => o.option_text.toLowerCase() === 'false' && o.is_correct) }
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

  const saveQuestions = () => {
    if (!validateQuestions()) return;
    const payload = mapToApiPayload();
    console.log('payload', payload);
    saveQuestionsMutation.mutate(payload);
  };

  /* ---------------------------
     Render
     --------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Toast toast={toast} onClose={() => setToast(null)} />

        <div className="mb-8">
          <button onClick={() => navigate(`/dashboard/subjects/${id}`)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Subject</span>
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-600 mb-2">Create Questions</h1>
              <p className="text-gray-600 text-sm">Build engaging questions for your students</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowBulkUpload(true)} className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold">
                <FileUp className="w-5 h-5" />
                Bulk Upload
              </button>
            </div>
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
              {questions.map((q, idx) => (
                <QuestionCard key={q.id} question={q} index={idx} topics={topics} onUpdate={(fields) => updateQuestion(q.id, fields)} onDelete={() => deleteQuestion(q.id)} />
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

      {showBulkUpload && <BulkUploadModal isOpen={showBulkUpload} onClose={() => setShowBulkUpload(false)} onUpload={handleBulkUpload} />}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}
