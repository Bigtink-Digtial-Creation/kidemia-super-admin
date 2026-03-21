import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import MathNodeView from "./MathNodeView";

export const MathInline = Node.create({
    name: "mathInline",
    group: "inline",
    inline: true,
    atom: true,
    addAttributes() {
        return { latex: { default: "" } };
    },
    parseHTML() {
        return [{ tag: "math-inline" }];
    },
    renderHTML({ HTMLAttributes }) {
        return ["math-inline", mergeAttributes(HTMLAttributes)];
    },
    addNodeView() {
        return ReactNodeViewRenderer(MathNodeView);
    },
});

export const MathBlock = Node.create({
    name: "mathBlock",
    group: "block",
    atom: true,
    addAttributes() {
        return { latex: { default: "" } };
    },
    parseHTML() {
        return [{ tag: "math-block" }];
    },
    renderHTML({ HTMLAttributes }) {
        return ["math-block", mergeAttributes(HTMLAttributes)];
    },
    addNodeView() {
        return ReactNodeViewRenderer(MathNodeView);
    },
});