import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";

interface ModalProps {
    title: string;
    subtitle?: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
    size?: "sm" | "md" | "lg";
}

export function Modal({ title, subtitle, onClose, children, footer, size = "md" }: ModalProps) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    const maxW = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : "max-w-lg";

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={`bg-white w-full ${maxW} shadow-2xl rounded-t-3xl sm:rounded-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh]`}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-gray-800">{title}</h2>
                        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">{footer}</div>
                )}
            </div>
        </div>
    );
}