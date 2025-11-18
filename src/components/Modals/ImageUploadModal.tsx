import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
// import { ApiSDK } from '../../sdk';

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (imageUrl: string) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
    isOpen,
    onClose,
    onUpload
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);


    const UploadService = {
        async uploadImageApiV1UploadImagePost(file: File) {
            console.log('[Mock UploadService] uploading:', file.name);
            await new Promise((r) => setTimeout(r, 1500));
            return {
                url: URL.createObjectURL(file),
                message: 'Upload successful',
            };
        },
    };

    const uploadMutation = useMutation({
        // mutationFn: (file: File) => ApiSDK.UploadService.uploadImageApiV1UploadImagePost(file),
        mutationFn: (file: File) => UploadService.uploadImageApiV1UploadImagePost(file),
        onSuccess: (response: any) => {
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

    const handleClose = () => {
        setSelectedFile(null);
        setPreview(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto animate-scaleIn">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Upload Question Image</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Add an image to your question</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

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
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-h-48 mx-auto rounded-lg object-contain"
                                />
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
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
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

                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                    <button
                        onClick={handleClose}
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