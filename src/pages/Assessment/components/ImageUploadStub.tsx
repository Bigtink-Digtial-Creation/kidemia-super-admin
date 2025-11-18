import { useState } from "react";
import { FiImage } from "react-icons/fi";

function uid(prefix = "") {
    return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}
export default function ImageUploadStub({ onUpload }: { onUpload: (id: string) => void }) {
    const [fileName, setFileName] = useState<string | null>(null);
    return (
        <div className="p-2 border rounded flex items-center gap-2">
            <div className="flex-1 text-sm">{fileName ?? "No image selected"}</div>
            <input
                id="banner"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setFileName(f.name);
                    // upload to media service and return id; here we just fake
                    onUpload(uid("img_"));
                }}
            />
            <label htmlFor="banner" className="cursor-pointer p-2 rounded border">
                <FiImage />
            </label>
        </div>
    );
}
