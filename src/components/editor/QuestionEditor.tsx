import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { MathInline, MathBlock } from "./MathExtension";
import {
    Bold, Italic, List, ListOrdered,
    Superscript as SupIcon, Subscript as SubIcon,
    FunctionSquare,
    UnderlineIcon,
} from "lucide-react";
import Underline from "@tiptap/extension-underline";

const SHORTCUTS = [
    { label: "x²", latex: "x^{2}" },
    { label: "xₙ", latex: "x_{n}" },
    { label: "√x", latex: "\\sqrt{x}" },
    { label: "a/b", latex: "\\frac{a}{b}" },
    { label: "∫", latex: "\\int_{a}^{b}f(x)\\,dx" },
    { label: "∑", latex: "\\sum_{i=1}^{n}x_i" },
    { label: "π", latex: "\\pi" },
    { label: "±", latex: "\\pm" },
    { label: "≤", latex: "\\leq" },
    { label: "≥", latex: "\\geq" },
    { label: "≠", latex: "\\neq" },
    { label: "∞", latex: "\\infty" },
    { label: "θ", latex: "\\theta" },
    { label: "α", latex: "\\alpha" },
];

interface Props {
    value?: Record<string, any> | null;
    plainTextFallback?: string;
    onChange?: (json: Record<string, any>, plainText: string) => void;
    minHeight?: string;
    readOnly?: boolean;
}

export default function QuestionEditor({
    value,
    plainTextFallback,
    onChange,
    minHeight = "100px",
    readOnly = false,
}: Props) {

    const initialContent = value ?? (plainTextFallback ? plainTextFallback : "");
    const editor = useEditor({
        extensions: [
            StarterKit,
            Superscript,
            Subscript,
            MathInline,
            Underline,
            MathBlock,
        ],
        content: initialContent,
        editable: !readOnly,
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm max-w-none focus:outline-none px-3 py-2.5 text-gray-800",
                style: `min-height: ${minHeight}`,
            },
        },
        onUpdate({ editor }) {
            onChange?.(editor.getJSON(), editor.getText());
        },
    });

    const btn = (
        onClick: () => void,
        content: React.ReactNode,
        active = false,
        title = ""
    ) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded-lg transition-colors ${active
                ? "bg-orange-100 text-orange-700"
                : "text-gray-500 hover:bg-gray-100"
                }`}
        >
            {content}
        </button>
    );

    if (readOnly) {
        return (
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none text-gray-800"
            />
        );
    }

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-300 bg-white">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50 flex-wrap">
                {btn(
                    () => editor?.chain().focus().toggleBold().run(),
                    <Bold size={13} />,
                    editor?.isActive("bold"),
                    "Bold"
                )}
                {btn(
                    () => editor?.chain().focus().toggleItalic().run(),
                    <Italic size={13} />,
                    editor?.isActive("italic"),
                    "Italic"
                )}
                {btn(
                    () => editor?.chain().focus().toggleUnderline().run(),
                    <UnderlineIcon size={13} />,
                    editor?.isActive("underline"),
                    "Underline"
                )}
                {btn(
                    () => editor?.chain().focus().toggleSuperscript().run(),
                    <SupIcon size={13} />,
                    editor?.isActive("superscript"),
                    "Superscript"
                )}
                {btn(
                    () => editor?.chain().focus().toggleSubscript().run(),
                    <SubIcon size={13} />,
                    editor?.isActive("subscript"),
                    "Subscript"
                )}
                {btn(
                    () => editor?.chain().focus().toggleBulletList().run(),
                    <List size={13} />,
                    editor?.isActive("bulletList"),
                    "Bullet list"
                )}
                {btn(
                    () => editor?.chain().focus().toggleOrderedList().run(),
                    <ListOrdered size={13} />,
                    editor?.isActive("orderedList"),
                    "Ordered list"
                )}

                <div className="w-px h-4 bg-gray-200 mx-1 shrink-0" />

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
                        className="px-1.5 py-1 rounded text-xs font-mono text-gray-600 hover:bg-orange-100 hover:text-orange-700 transition-colors"
                    >
                        {s.label}
                    </button>
                ))}

                <div className="w-px h-4 bg-gray-200 mx-1 shrink-0" />

                {btn(
                    () =>
                        editor?.commands.insertContent({
                            type: "mathBlock",
                            attrs: { latex: "" },
                        }),
                    <FunctionSquare size={13} />,
                    false,
                    "Insert block equation"
                )}
            </div>

            <EditorContent editor={editor} />

            <div className="px-3 py-1 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                    Click a formula to edit ·{" "}
                    <code className="text-orange-500 bg-orange-50 px-0.5 rounded">
                        $x^2$
                    </code>{" "}
                    in CSV ·{" "}
                    <code className="text-orange-500 bg-orange-50 px-0.5 rounded">
                        $$...$$
                    </code>{" "}
                    for block equations
                </p>
            </div>
        </div>
    );
}