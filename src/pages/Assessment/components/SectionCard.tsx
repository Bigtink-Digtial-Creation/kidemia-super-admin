import { FiTrash } from "react-icons/fi";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
type SectionShape = {
    id: string;
    title: string;
    description?: string;
    number_of_questions: number;
    topic_ids: string[];
    difficulty_distribution: { easy: number; medium: number; hard: number };
};

export default function SectionCard({
    section,
    onChange,
    onDelete,
    topics,
    index,
}: {
    section: SectionShape;
    onChange: (next: Partial<SectionShape>) => void;
    onDelete: () => void;
    topics: string[];
    index: number;
}) {
    const updateDiff = (k: Partial<SectionShape>) => onChange(k);

    const sum = section.difficulty_distribution.easy + section.difficulty_distribution.medium + section.difficulty_distribution.hard;
    const invalid = sum !== 100;

    return (
        <div className="p-3 border border-kidemia-grey/20 rounded-lg bg-white">
            <div className="flex justify-between items-center">
                <div className="font-semibold">Section {index + 1} — {section.title}</div>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={onDelete} title="Delete section" className="text-red-500">
                        <FiTrash />
                    </button>
                </div>
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                    variant="flat"
                    label="Title"
                    value={section.title}
                    onChange={(e) => updateDiff({ title: e.target.value })}
                />
                <Input
                    variant="flat"
                    label="Number of Questions"
                    type="number"
                    value={String(section.number_of_questions)}
                    onChange={(e) => updateDiff({ number_of_questions: Number(e.target.value) })}
                />
                <Select
                    variant="flat"
                    label="Topics"
                    selectedKeys={section.topic_ids}
                    onSelectionChange={(keys) => updateDiff({ topic_ids: Array.from(keys) as string[] })}
                >
                    {topics.map((t) => (
                        <SelectItem key={t}>{t}</SelectItem>
                    ))}
                </Select>
            </div>

            <div className="mt-3">
                <label className="text-sm font-medium">Difficulty distribution (must sum to 100) {invalid && <span className="text-red-500"> — total {sum}%</span>}</label>
                <div className="flex gap-2 mt-2">
                    <Input
                        variant="flat"
                        label="Easy %"
                        type="number"
                        value={String(section.difficulty_distribution.easy)}
                        onChange={(e) => updateDiff({ difficulty_distribution: { ...section.difficulty_distribution, easy: Number(e.target.value) } })}
                    />
                    <Input
                        variant="flat"
                        label="Medium %"
                        type="number"
                        value={String(section.difficulty_distribution.medium)}
                        onChange={(e) => updateDiff({ difficulty_distribution: { ...section.difficulty_distribution, medium: Number(e.target.value) } })}
                    />
                    <Input
                        variant="flat"
                        label="Hard %"
                        type="number"
                        value={String(section.difficulty_distribution.hard)}
                        onChange={(e) => updateDiff({ difficulty_distribution: { ...section.difficulty_distribution, hard: Number(e.target.value) } })}
                    />
                </div>
            </div>

            <div className="mt-2">
                <Textarea
                    variant="flat"
                    label="Description (optional)"
                    value={section.description ?? ""}
                    onChange={(e) => updateDiff({ description: e.target.value })}
                />
            </div>
        </div>
    );
}