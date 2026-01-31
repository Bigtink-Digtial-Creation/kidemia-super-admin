import { useMemo, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ApiSDK } from "../../../sdk";
import { QueryKeys } from "../../../utils/queryKeys";
import BallSpinner from "../../../components/Spinner/BallSpinner";

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

    const { data: questionRows = [], isLoading } = useQuery<QuestionRow[]>({
        queryKey: [QueryKeys.questionsById, subjectId, topicIds, filterMode],
        queryFn: async () => {
            try {
                let rows: QuestionRow[] = [];

                if (filterMode === "by-subject" && subjectId) {
                    const resp = await ApiSDK.TopicQuestionsService.getQuestionsApiV1QuestionsGet(subjectId);
                    rows = (resp?.items ?? []).map((q) => ({
                        id: String(q.id),
                        question_text: q.question_text,
                        difficulty: q.difficulty_level,
                        marks: q.points ?? 1,
                        topic_name: q.topic?.name,
                    }));
                }
                else if (filterMode === "by-topic" && topicIds?.length) {
                    const resp = await ApiSDK.TopicQuestionsService.getQuestionsByTopicsApiV1QuestionsByTopicsPost(topicIds);
                    const topics = resp?.topics ?? [];
                    rows = topics.flatMap((topic) =>
                        (topic.questions ?? []).map((q) => ({
                            id: String(q.id), // Used q.id from API
                            question_text: q.question_text,
                            difficulty: q.difficulty_level,
                            marks: 1,
                            topic_name: topic.topic_name,
                        }))
                    );
                }
                else if (filterMode === "manual") {
                    const resp = await ApiSDK.TopicQuestionsService.getQuestionsByTopicsApiV1QuestionsByTopicsPost([]);
                    const topics = resp?.topics ?? [];
                    rows = topics.flatMap((topic) =>
                        (topic.questions ?? []).map((q) => ({
                            id: String(q.id), // Used q.id from API
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

    const filteredQuestions = useMemo(() => {
        if (!searchQuery.trim()) return questionRows;
        const query = searchQuery.toLowerCase();
        return questionRows.filter((q) => q.question_text.toLowerCase().includes(query));
    }, [questionRows, searchQuery]);

    const handleSelectionChange = (keys: any) => {
        let newSelectedKeys: Set<string>;

        if (keys === "all") {
            // Select all currently filtered rows
            newSelectedKeys = new Set(filteredQuestions.map((q) => String(q.id)));
        } else {
            // Convert selection to set of strings
            newSelectedKeys = new Set(Array.from(keys).map(String));
        }

        setSelectedKeys(newSelectedKeys);

        // Find the full row data for the parent callback
        const selectedRows = filteredQuestions.filter((row) =>
            newSelectedKeys.has(String(row.id))
        );
        onSelectionChange(selectedRows);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case "easy": return "success";
            case "medium": return "warning";
            case "hard": return "danger";
            default: return "default";
        }
    };

    if (isLoading) {
        return (
            <div className="py-20 flex justify-center items-center">
                <BallSpinner />
            </div>
        );
    }

    return (
        <div className="w-full">
            <Table
                aria-label="Questions table with selection"
                selectionMode="multiple"
                selectedKeys={selectedKeys.size === filteredQuestions.length && filteredQuestions.length > 0 ? "all" : selectedKeys}
                onSelectionChange={handleSelectionChange}
                shadow="none"
                radius="none"
                removeWrapper
                classNames={{
                    base: "max-h-[500px] overflow-scroll",
                    table: "min-w-full",
                    thead: "[&>tr]:first:rounded-none",
                    th: "bg-gray-50 text-gray-600 border-b border-gray-100 py-4",
                    td: "py-3 border-b border-gray-50",
                }}
            >
                <TableHeader>
                    <TableColumn>QUESTION</TableColumn>
                    <TableColumn>TOPIC</TableColumn>
                    <TableColumn>DIFFICULTY</TableColumn>
                    <TableColumn>POINTS</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No questions found">
                    {filteredQuestions.map((row) => (
                        <TableRow key={row.id} className="hover:bg-gray-50/50 transition-colors">
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
                            <TableCell className="font-medium text-gray-700">{row.marks}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>
                    Total: <span className="text-gray-900">{filteredQuestions.length}</span>
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <div>
                    Selected: <span className="text-kidemia-secondary">{selectedKeys.size}</span>
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <div>
                    Marks:{" "}
                    <span className="text-gray-900">
                        {filteredQuestions
                            .filter((row) => selectedKeys.has(String(row.id)))
                            .reduce((sum, row) => sum + row.marks, 0)}
                    </span>
                </div>
            </div>
        </div>
    );
}