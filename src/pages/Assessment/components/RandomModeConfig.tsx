import {
    Input
} from "@heroui/react";


export default function RandomModeConfig({
    config,
    onChange,
    topics,
}: {
    config: {
        number_of_questions: number;
        topic_distribution: { topic_id: string; percent: number }[];
        difficulty_distribution: { easy: number; medium: number; hard: number };
    };
    onChange: (next: any) => void;
    topics: string[];
}) {
    const setNumber = (n: number) => onChange({ ...config, number_of_questions: n });
    const setDifficulty = (k: keyof typeof config.difficulty_distribution, v: number) =>
        onChange({ ...config, difficulty_distribution: { ...config.difficulty_distribution, [k]: v } });

    return (
        <div className="p-3 border border-kidemia-grey/10 rounded-md bg-white">
            <h5 className="font-semibold mb-2">Random Mode Configuration</h5>
            <Input
                variant="flat"
                label="Number of Questions"
                type="number"
                value={String(config.number_of_questions)}
                onChange={(e) => setNumber(Number(e.target.value))}
            />

            <div className="mt-3">
                <label className="text-sm font-medium">Difficulty Distribution (must sum to 100)</label>
                <div className="flex gap-2 mt-2">
                    <Input variant="flat" label="Easy %" type="number" value={String(config.difficulty_distribution.easy)} onChange={(e) => setDifficulty("easy", Number(e.target.value))} />
                    <Input variant="flat" label="Medium %" type="number" value={String(config.difficulty_distribution.medium)} onChange={(e) => setDifficulty("medium", Number(e.target.value))} />
                    <Input variant="flat" label="Hard %" type="number" value={String(config.difficulty_distribution.hard)} onChange={(e) => setDifficulty("hard", Number(e.target.value))} />
                </div>
            </div>

            {/* topic distribution UI - simple */}
            {topics.length > 0 && (
                <div className="mt-3">
                    <label className="text-sm font-medium">Topic Distribution (optional)</label>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                        {topics.map((t) => {
                            const existing = config.topic_distribution.find((x) => x.topic_id === t);
                            return (
                                <div key={t} className="flex gap-2 items-center">
                                    <div className="flex-1 text-sm">{t}</div>
                                    <Input
                                        variant="flat"
                                        type="number"
                                        value={String(existing?.percent ?? 0)}
                                        onChange={(e) => {
                                            const percent = Number(e.target.value);
                                            const copy = config.topic_distribution.filter((x) => x.topic_id !== t);
                                            if (percent > 0) copy.push({ topic_id: t, percent });
                                            onChange({ ...config, topic_distribution: copy });
                                        }}
                                        style={{ width: 90 }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}