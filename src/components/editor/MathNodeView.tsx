import { useState } from "react";
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import katex from "katex";

// interface Props {
//     node: { attrs: { latex: string }; type: { name: string } };
//     updateAttributes: (attrs: { latex: string }) => void;
//     selected: boolean;
// }

export default function MathNodeView({ node, updateAttributes, selected }: ReactNodeViewProps) {
    const [editing, setEditing] = useState(!node.attrs.latex);
    const [draft, setDraft] = useState(node.attrs.latex || "");
    const isBlock = node.type.name === "mathBlock";

    const preview = (() => {
        try {
            return katex.renderToString(draft || "\\square", {
                displayMode: isBlock,
                throwOnError: false,
            });
        } catch {
            return `<span style="color:red;font-size:11px">Invalid LaTeX</span>`;
        }
    })();

    if (editing) {
        return (
            <NodeViewWrapper
                className={isBlock ? "block my-3" : "inline-block mx-1 align-middle"}
            >
                <div className="border-2 border-orange-300 rounded-xl p-3 bg-orange-50 space-y-2 min-w-48">
                    <p className="text-xs font-semibold text-orange-700">
                        {isBlock ? "Block equation" : "Inline math"} — LaTeX
                    </p>
                    <textarea
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows={isBlock ? 3 : 1}
                        placeholder={isBlock ? "\\frac{a}{b}" : "x^{2} + 3x = 0"}
                        className="w-full font-mono text-sm border border-orange-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none bg-white"
                    />
                    <div className="bg-white rounded-lg p-2 border border-orange-200 min-h-8 flex items-center justify-center overflow-x-auto">
                        <span dangerouslySetInnerHTML={{ __html: preview }} />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                updateAttributes({ latex: draft });
                                setEditing(false);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-orange-500"
                        >
                            Apply
                        </button>
                        {node.attrs.latex && (
                            <button
                                type="button"
                                onClick={() => {
                                    setDraft(node.attrs.latex);
                                    setEditing(false);
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </NodeViewWrapper>
        );
    }

    return (
        <NodeViewWrapper
            className={`cursor-pointer rounded transition-all ${isBlock
                ? "block my-3 text-center py-1"
                : "inline-block mx-0.5 align-middle"
                } ${selected ? "ring-2 ring-orange-400" : "hover:ring-1 hover:ring-orange-200"}`}
            onClick={() => setEditing(true)}
            title="Click to edit"
        >
            <span dangerouslySetInnerHTML={{ __html: preview }} />
        </NodeViewWrapper>
    );
}