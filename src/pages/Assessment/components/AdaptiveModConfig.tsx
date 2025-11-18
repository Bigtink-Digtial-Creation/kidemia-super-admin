
import { Input, Select, SelectItem } from "@heroui/react";

export default function AdaptiveModeConfig({ config, onChange }: { config: any; onChange: (c: any) => void }) {
    return (
        <div className="p-3 border border-kidemia-grey/10 rounded-md bg-white">
            <h5 className="font-semibold mb-2">Adaptive Mode Configuration</h5>
            <Select
                variant="flat"
                label="Starting Difficulty"
                selectedKeys={[config.starting_difficulty]}
                onSelectionChange={(keys) => onChange({ ...config, starting_difficulty: Array.from(keys)[0] })}
            >
                <SelectItem key="easy">Easy</SelectItem>
                <SelectItem key="medium">Medium</SelectItem>
                <SelectItem key="hard">Hard</SelectItem>
            </Select>

            <Input
                variant="flat"
                label="Sensitivity (1-5)"
                type="number"
                min={1}
                max={5}
                value={String(config.sensitivity)}
                onChange={(e) => onChange({ ...config, sensitivity: Number(e.target.value) })}
            />
        </div>
    );
}