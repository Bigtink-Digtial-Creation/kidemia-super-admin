import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { MathInline, MathBlock } from "./MathExtension";

interface Props {
    question_content?: Record<string, any> | null | string;
    question_text?: string | null;
    className?: string;
}


export default function QuestionRenderer({ question_content, question_text, className = "" }: Props) {
    const content = question_content ?? question_text ?? "";

    const editor = useEditor({
        extensions: [StarterKit, Superscript, Subscript, MathInline, MathBlock],
        content,
        editable: false,
        editorProps: {
            attributes: {
                class: `prose prose-sm max-w-none ${className}`,
            },
        },
    });

    return <EditorContent editor={editor} />;
}