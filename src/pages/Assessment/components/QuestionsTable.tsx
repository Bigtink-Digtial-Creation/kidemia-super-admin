import { useMemo, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Spinner,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ApiSDK } from "../../../sdk";
import { QueryKeys } from "../../../utils/queryKeys";

export interface QuestionRow {
    id: string;
    question_text: string;
    difficulty: string;
    marks: number;
    topic_name?: string;
}

interface QuestionsTableProps {
    subjectId?: string;
    topicIds?: string[];
    filterMode: "by-subject" | "by-topic" | "manual";
    searchQuery?: string;
    onSelectionChange: (selectedRows: QuestionRow[]) => void;
}

export default function QuestionsTable({
    subjectId,
    topicIds,
    filterMode,
    searchQuery = "",
    onSelectionChange,
}: QuestionsTableProps) {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

    // Fetch questions based on filters
    const { data: questionRows = [], isLoading } = useQuery<QuestionRow[]>({
        queryKey: [QueryKeys.questionsById, subjectId, topicIds, filterMode],
        queryFn: async () => {
            try {
                let rows: QuestionRow[] = [];

                // --- by-subject ---
                if (filterMode === "by-subject" && subjectId) {
                    const resp = await ApiSDK.TopicQuestionsService.getQuestionsApiV1QuestionsGet(subjectId);
                    rows = (resp?.items ?? []).map((q) => ({
                        id: q.id,
                        question_text: q.question_text,
                        difficulty: q.difficulty_level,
                        marks: q.points ?? 1,
                    }));
                }

                // --- by-topic ---
                else if (filterMode === "by-topic" && topicIds?.length) {
                    const resp = await ApiSDK.TopicQuestionsService.getQuestionsByTopicsApiV1QuestionsByTopicsPost(topicIds);
                    const topics = resp?.topics ?? [];
                    rows = topics.flatMap((topic) =>
                        (topic.questions ?? []).map((q, idx) => ({
                            id: `${topic.topic_name}-${idx}`,
                            question_text: q.question_text,
                            difficulty: q.difficulty_level,
                            marks: 1,
                            topic_name: topic.topic_name,
                        }))
                    );
                }

                // --- manual ---
                else if (filterMode === "manual") {
                    const resp = await ApiSDK.TopicQuestionsService.getQuestionsByTopicsApiV1QuestionsByTopicsPost([]);
                    const topics = resp?.topics ?? [];
                    rows = topics.flatMap((topic) =>
                        (topic.questions ?? []).map((q, idx) => ({
                            id: `${topic.topic_name}-${idx}`,
                            question_text: q.question_text,
                            difficulty: q.difficulty_level,
                            marks: 1,
                            topic_name: topic.topic_name,
                        }))
                    );
                }

                return rows;
            } catch (error) {
                console.error("Failed to fetch questions", error);
                return [];
            }
        },
        enabled:
            filterMode === "by-subject"
                ? !!subjectId
                : filterMode === "by-topic"
                    ? (topicIds?.length ?? 0) > 0
                    : true,
    });

    // Filter by search query
    const filteredQuestions = useMemo(() => {
        if (!searchQuery.trim()) return questionRows;
        const query = searchQuery.toLowerCase();
        return questionRows.filter((q) => q.question_text.toLowerCase().includes(query));
    }, [questionRows, searchQuery]);

    // Handle selection changes
    const handleSelectionChange = (keys: any) => {
        // Convert whatever comes from Table to a Set<string>
        const newSelectedKeys = new Set(
            Array.isArray(keys)
                ? keys.map(String)
                : keys instanceof Set
                    ? Array.from(keys).map(String)
                    : [String(keys)]
        );

        setSelectedKeys(newSelectedKeys);

        const selectedRows = filteredQuestions.filter((row) => newSelectedKeys.has(row.id));
        onSelectionChange(selectedRows);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case "easy":
                return "success";
            case "medium":
                return "warning";
            case "hard":
                return "danger";
            default:
                return "default";
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Spinner size="lg" color="warning" />
            </div>
        );
    }

    return (
        <div className="w-full">
            <Table
                aria-label="Questions table with selection"
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                onSelectionChange={handleSelectionChange}
                classNames={{ wrapper: "max-h-[500px] overflow-auto" }}
            >
                <TableHeader>
                    <TableColumn>QUESTION</TableColumn>
                    <TableColumn>TOPIC</TableColumn>
                    <TableColumn>DIFFICULTY</TableColumn>
                    <TableColumn>MARKS</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No questions found">
                    {filteredQuestions.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <div className="max-w-md truncate" title={row.question_text}>
                                    {row.question_text}
                                </div>
                            </TableCell>
                            <TableCell>{row.topic_name || "N/A"}</TableCell>
                            <TableCell>
                                <Chip size="sm" variant="flat" color={getDifficultyColor(row.difficulty)}>
                                    {row.difficulty}
                                </Chip>
                            </TableCell>
                            <TableCell>{row.marks}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-2 text-sm text-gray-600">
                Total Questions: <span className="font-semibold">{filteredQuestions.length}</span>
                {" | "}
                Selected: <span className="font-semibold">{selectedKeys.size}</span>
                {" | "}
                Total Marks:{" "}
                <span className="font-semibold">
                    {filteredQuestions
                        .filter((row) => selectedKeys.has(row.id))
                        .reduce((sum, row) => sum + row.marks, 0)}
                </span>
            </div>
        </div>
    );
}
