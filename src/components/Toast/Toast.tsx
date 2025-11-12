import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import type { ToastType } from '../../pages/Subjects/question.types';


interface ToastProps {
    toast: ToastType;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    if (!toast) return null;

    const { message, type } = toast;
    const bg = type === 'success'
        ? 'bg-green-50 border-green-200'
        : type === 'error'
            ? 'bg-red-50 border-red-200'
            : 'bg-blue-50 border-blue-200';

    const text = type === 'success'
        ? 'text-green-800'
        : type === 'error'
            ? 'text-red-800'
            : 'text-blue-800';

    const Icon = type === 'success' ? CheckCircle : AlertCircle;
    const iconColor = type === 'success'
        ? 'text-green-500'
        : type === 'error'
            ? 'text-red-500'
            : 'text-blue-500';

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