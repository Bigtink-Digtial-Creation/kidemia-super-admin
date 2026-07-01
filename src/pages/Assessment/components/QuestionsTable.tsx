import { useMemo, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    addToast,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ApiSDK } from "../../../sdk";
import { QueryKeys } from "../../../utils/queryKeys";
import BallSpinner from "../../../components/Spinner/BallSpinner";
import QuestionRenderer from "../../../components/editor/QuestionRenderer";

export interface QuestionRow {
    id: string;
    question_text: string;
    question_content?: Record<string, any> | null; // ← add
    difficulty: string;
    marks: number;
    topic_name?: string;
}

interface QuestionsTableProps {
    subjectId?: string;
    subjectIds?: string[];
    topicIds?: string[];
    filterMode: "by-subject" | "by-subjects" | "by-topic" | "manual";
    searchQuery?: string;
    onSelectionChange: (selectedRows: QuestionRow[]) => void;
}

export default function QuestionsTable({
    subjectId,
    subjectIds,
    topicIds,
    filterMode,
    searchQuery = "",
    onSelectionChange,
}: QuestionsTableProps) {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const { data: questionRows = [], isLoading } = useQuery<QuestionRow[]>({
        queryKey: [QueryKeys.questionsById, subjectId, subjectIds, topicIds, filterMode],
        queryFn: async () => {
            try {
                let rows: QuestionRow[] = [];

                if (filterMode === "by-subject" && subjectId) {
                    const resp =
                        await ApiSDK.TopicQuestionsService.getQuestionsApiV1QuestionsGet(
                            subjectId
                        );
                    rows = (resp?.items ?? []).map((q) => ({
                        id: String(q.id),
                        question_text: q.question_text,
                        question_content: q.question_content ?? null, // ← add
                        difficulty: q.difficulty_level,
                        marks: q.points ?? 1,
                        topic_name: q.topic?.name,
                    }));
                } else if (filterMode === "by-subjects" && subjectIds?.length) {
                    const results = await Promise.all(
                        subjectIds.map((sid) =>
                            ApiSDK.TopicQuestionsService.getQuestionsApiV1QuestionsGet(sid)
                        )
                    );
                    rows = results.flatMap((resp) =>
                        (resp?.items ?? []).map((q) => ({
                            id: String(q.id),
                            question_text: q.question_text,
                            question_content: q.question_content ?? null,
                            difficulty: q.difficulty_level,
                            marks: q.points ?? 1,
                            topic_name: q.topic?.name,
                        }))
                    );
                } else if (filterMode === "by-topic" && topicIds?.length) {
                    const resp =
                        await ApiSDK.TopicQuestionsService.getQuestionsByTopicsApiV1QuestionsByTopicsPost(
                            topicIds
                        );
                    const topics = resp?.topics ?? [];
                    rows = topics.flatMap((topic) =>
                        (topic.questions ?? []).map((q) => ({
                            id: String(q.id),
                            question_text: q.question_text,
                            question_content: (q as any).question_content ?? null, // ← add
                            difficulty: q.difficulty_level,
                            marks: 1,
                            topic_name: topic.topic_name,
                        }))
                    );
                } else if (filterMode === "manual") {
                    const resp =
                        await ApiSDK.TopicQuestionsService.getQuestionsByTopicsApiV1QuestionsByTopicsPost(
                            []
                        );
                    const topics = resp?.topics ?? [];
                    rows = topics.flatMap((topic) =>
                        (topic.questions ?? []).map((q) => ({
                            id: String(q.id),
                            question_text: q.question_text,
                            question_content: (q as any).question_content ?? null, // ← add
                            difficulty: q.difficulty_level,
                            marks: 1,
                            topic_name: topic.topic_name,
                        }))
                    );
                }

                return rows;
            } catch (error: any) {
                addToast({
                    title: "An error occurred",
                    description:
                        error?.body?.message ||
                        error?.body?.detail ||
                        error?.message ||
                        "Network Error",
                    color: "danger",
                });
                return [];
            }
        },
        enabled:
            filterMode === "by-subject"
                ? !!subjectId
                : filterMode === "by-subjects"
                    ? (subjectIds?.length ?? 0) > 0
                    : filterMode === "by-topic"
                        ? (topicIds?.length ?? 0) > 0
                        : true,

    });

    // Search works against plain text — fast and doesn't require parsing JSON
    const filteredQuestions = useMemo(() => {
        if (!searchQuery.trim()) return questionRows;
        const query = searchQuery.toLowerCase();
        return questionRows.filter((q) =>
            q.question_text.toLowerCase().includes(query)
        );
    }, [questionRows, searchQuery]);

    const handleSelectionChange = (keys: any) => {
        let newSelectedKeys: Set<string>;
        if (keys === "all") {
            newSelectedKeys = new Set(filteredQuestions.map((q) => String(q.id)));
        } else {
            newSelectedKeys = new Set(Array.from(keys).map(String));
        }
        setSelectedKeys(newSelectedKeys);
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
            case "expert": return "secondary";
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
                selectedKeys={
                    selectedKeys.size === filteredQuestions.length &&
                        filteredQuestions.length > 0
                        ? "all"
                        : selectedKeys
                }
                onSelectionChange={handleSelectionChange}
                shadow="none"
                radius="none"
                removeWrapper
                classNames={{
                    base: "max-h-[500px] overflow-scroll",
                    table: "min-w-full",
                    thead: "[&>tr]:first:rounded-none",
                    th: "bg-gray-50 text-gray-600 border-b border-gray-100 py-4",
                    td: "py-3 border-b border-gray-50 align-top",
                }}
            >
                <TableHeader>
                    <TableColumn>QUESTION</TableColumn>
                    <TableColumn>TOPIC</TableColumn>
                    <TableColumn>DIFFICULTY</TableColumn>
                    <TableColumn>POINTS</TableColumn>
                </TableHeader>

                <TableBody emptyContent="No questions found">
                    {filteredQuestions.map((row) => {
                        const isExpanded = expandedId === row.id;
                        const hasRichContent = !!row.question_content;

                        return (
                            <TableRow
                                key={row.id}
                                className="hover:bg-gray-50/50 transition-colors"
                            >
                                <TableCell>
                                    <div className="max-w-md">
                                        {hasRichContent ? (
                                            // Rich content — use renderer, clamp to 2 lines when collapsed
                                            <div>
                                                <div
                                                    className={`overflow-hidden transition-all ${isExpanded ? "" : "max-h-12"
                                                        }`}
                                                >
                                                    <QuestionRenderer
                                                        key={row.id}
                                                        question_content={row.question_content}
                                                        question_text={row.question_text}
                                                        className="text-sm text-gray-800"
                                                    />
                                                </div>
                                                {/* Only show expand if content is likely taller than 2 lines */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // don't trigger row selection
                                                        setExpandedId(isExpanded ? null : row.id);
                                                    }}
                                                    className="mt-0.5 text-xs text-orange-500 hover:text-orange-600 font-medium"
                                                >
                                                    {isExpanded ? "Show less" : "Show more"}
                                                </button>
                                            </div>
                                        ) : (
                                            // Plain text — simple truncation, title tooltip for full text
                                            <p
                                                className="text-sm text-gray-800 line-clamp-2 cursor-default"
                                                title={row.question_text}
                                            >
                                                {row.question_text}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <span className="text-sm text-gray-500">
                                        {row.topic_name || "—"}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color={getDifficultyColor(row.difficulty)}
                                    >
                                        {row.difficulty}
                                    </Chip>
                                </TableCell>

                                <TableCell>
                                    <span className="font-medium text-gray-700">{row.marks}</span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {/* Footer stats */}
            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>
                    Total:{" "}
                    <span className="text-gray-900">{filteredQuestions.length}</span>
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <div>
                    Selected:{" "}
                    <span className="text-kidemia-secondary">{selectedKeys.size}</span>
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