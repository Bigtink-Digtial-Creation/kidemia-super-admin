
export function textToTiptapJson(text: string): Record<string, any> {
    if (!text?.trim()) {
        return { type: "doc", content: [{ type: "paragraph", content: [] }] };
    }

    const nodes: any[] = [];
    let para: any[] = [];

    const pattern = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
    const segments: string[] = [];
    let last = 0;
    let m: RegExpExecArray | null;

    while ((m = pattern.exec(text)) !== null) {
        if (m.index > last) segments.push(text.slice(last, m.index));
        segments.push(m[0]);
        last = pattern.lastIndex;
    }
    if (last < text.length) segments.push(text.slice(last));

    const flush = () => {
        if (para.length) {
            nodes.push({ type: "paragraph", content: [...para] });
            para = [];
        }
    };

    for (const seg of segments) {
        if (seg.startsWith("$$") && seg.endsWith("$$")) {
            flush();
            nodes.push({ type: "mathBlock", attrs: { latex: seg.slice(2, -2).trim() } });
        } else if (seg.startsWith("$") && seg.endsWith("$")) {
            para.push({ type: "mathInline", attrs: { latex: seg.slice(1, -1).trim() } });
        } else {
            const lines = seg.split(/\n/);
            lines.forEach((line, i) => {
                if (line) {
                    // Handle **bold** and *italic*
                    line.split(/(\*\*.*?\*\*|\*.*?\*)/).forEach((p) => {
                        if (!p) return;
                        if (p.startsWith("**") && p.endsWith("**"))
                            para.push({ type: "text", text: p.slice(2, -2), marks: [{ type: "bold" }] });
                        else if (p.startsWith("*") && p.endsWith("*"))
                            para.push({ type: "text", text: p.slice(1, -1), marks: [{ type: "italic" }] });
                        else para.push({ type: "text", text: p });
                    });
                }
                if (i < lines.length - 1) flush();
            });
        }
    }

    flush();
    return {
        type: "doc",
        content: nodes.length ? nodes : [{ type: "paragraph", content: [] }],
    };
}

export function extractPlainText(text: string): string {
    return text
        .replace(/\$\$[\s\S]*?\$\$/g, (m) => m.slice(2, -2))
        .replace(/\$([\s\S]*?)\$/g, "$1")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .trim();
}