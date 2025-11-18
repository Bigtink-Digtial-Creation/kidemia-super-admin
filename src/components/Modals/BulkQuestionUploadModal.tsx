import React, { useState } from 'react';
import { X, FileUp, Download } from 'lucide-react';

interface BulkUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
    isOpen,
    onClose,
    onUpload
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
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

    if (!isOpen) return null;

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
                        className="text-gray-400 hover:text-gray-600 rounded-lg p-2"
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
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold"
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
                        <FileUp
                            className={`w-16 h-16 mx-auto mb-4 ${dragActive ? 'text-orange-500' : 'text-gray-400'
                                }`}
                        />
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
                            Supported format: CSV
                        </span>
                    </div>
                </div>

                <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedFile}
                        className={`px-8 py-3 rounded-xl font-semibold ${selectedFile
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
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