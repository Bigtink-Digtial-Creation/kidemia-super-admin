import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { MathInline } from "./MathExtension"; // ← inline only, no MathBlock

// Fewer shortcuts — only what makes sense for an answer option
const SHORTCUTS = [
    { label: "x²", latex: "x^{2}" },
    { label: "xₙ", latex: "x_{n}" },
    { label: "√", latex: "\\sqrt{x}" },
    { label: "a/b", latex: "\\frac{a}{b}" },
    { label: "π", latex: "\\pi" },
    { label: "±", latex: "\\pm" },
    { label: "≤", latex: "\\leq" },
    { label: "≥", latex: "\\geq" },
];

interface Props {
    value?: Record<string, any> | null;
    plainTextFallback?: string;
    onChange?: (json: Record<string, any>, plainText: string) => void;
    placeholder?: string;
    readOnly?: boolean;
}

export default function OptionEditor({
    value,
    plainTextFallback,
    onChange,
    readOnly = false,
}: Props) {

    const initialContent = value ?? (plainTextFallback ? plainTextFallback : "");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Disable block-level nodes that don't make sense in an option
                heading: false,
                blockquote: false,
                bulletList: false,
                orderedList: false,
                codeBlock: false,
                horizontalRule: false,
            }),
            Superscript,
            Subscript,
            MathInline, // ← inline math only
        ],
        content: initialContent,
        editable: !readOnly,
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm max-w-none focus:outline-none px-2.5 py-1.5 text-sm text-gray-800",
                style: "min-height: 36px",
            },
        },
        onUpdate({ editor }) {
            onChange?.(editor.getJSON(), editor.getText());
        },
    });

    if (readOnly) {
        return (
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none text-sm"
            />
        );
    }

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-300 bg-white">
            {/* Compact toolbar — only shows on focus via CSS or always visible */}
            <div className="flex items-center gap-0.5 px-1.5 py-1 border-b border-gray-100 bg-gray-50 flex-wrap">
                {/* Minimal formatting */}
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-1 rounded text-xs transition-colors ${editor?.isActive("bold")
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-400 hover:bg-gray-100"
                        }`}
                    title="Bold"
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-1 rounded text-xs transition-colors italic ${editor?.isActive("italic")
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-400 hover:bg-gray-100"
                        }`}
                    title="Italic"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleSuperscript().run()}
                    className={`p-1 rounded text-xs transition-colors ${editor?.isActive("superscript")
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-400 hover:bg-gray-100"
                        }`}
                    title="Superscript"
                >
                    x²
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleSubscript().run()}
                    className={`p-1 rounded text-xs transition-colors ${editor?.isActive("subscript")
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-400 hover:bg-gray-100"
                        }`}
                    title="Subscript"
                >
                    x₂
                </button>

                <div className="w-px h-3 bg-gray-200 mx-0.5 shrink-0" />

                {/* Math shortcuts */}
                {SHORTCUTS.map((s) => (
                    <button
                        key={s.label}
                        type="button"
                        onClick={() =>
                            editor?.commands.insertContent({
                                type: "mathInline",
                                attrs: { latex: s.latex },
                            })
                        }
                        title={s.latex}
                        className="px-1 py-0.5 rounded text-xs font-mono text-gray-500 hover:bg-orange-100 hover:text-orange-700 transition-colors"
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}