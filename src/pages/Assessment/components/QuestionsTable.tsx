import { useEffect, useMemo, useState } from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Chip, Button, addToast,
} from "@heroui/react";
import { ApiSDK } from "../../../sdk";
import BallSpinner from "../../../components/Spinner/BallSpinner";
import QuestionRenderer from "../../../components/editor/QuestionRenderer";

const PAGE_SIZE = 50;

export interface QuestionRow {
    id: string;
    question_text: string;
    question_content?: Record<string, any> | null;
    difficulty: string;
    marks: number;
    topic_name?: string;
}

interface Cursor { skip: number; total: number; done: boolean; }

interface QuestionsTableProps {
    subjectId?: string;
    subjectIds?: string[];
    topicIds?: string[];
    filterMode: "by-subject" | "by-subjects" | "by-topic" | "manual";
    searchQuery?: string;
    onSelectionChange: (selectedRows: QuestionRow[]) => void;
}

const mapQuestion = (q: any, topicNameOverride?: string): QuestionRow => ({
    id: String(q.id),
    question_text: q.question_text,
    question_content: q.question_content ?? null,
    difficulty: q.difficulty_level,
    marks: q.points ?? 1,
    topic_name: topicNameOverride ?? q.topic?.name,
});

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

    const [rows, setRows] = useState<QuestionRow[]>([]);
    const [singleCursor, setSingleCursor] = useState<Cursor>({ skip: 0, total: 0, done: false });
    const [subjectCursors, setSubjectCursors] = useState<Record<string, Cursor>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Reset + fetch first page whenever the filter context changes
    useEffect(() => {
        let cancelled = false;

        const loadInitial = async () => {
            setIsLoading(true);
            setRows([]);
            setSelectedKeys(new Set());
            setSingleCursor({ skip: 0, total: 0, done: false });
            setSubjectCursors({});

            try {
                if (filterMode === "by-subject" && subjectId) {
                    const resp = await ApiSDK.TopicQuestionsService.getQuestionsApiV1QuestionsGet(
                        subjectId, null, null, null, null, null, 0, PAGE_SIZE
                    );
                    if (cancelled) return;
                    const items = (resp?.items ?? []).map((q: any) => mapQuestion(q));
                    setRows(items);
                    setSingleCursor({ skip: PAGE_SIZE, total: resp?.total ?? 0, done: items.length < PAGE_SIZE });

                } else if (filterMode === "by-subjects" && subjectIds?.length) {
                    const results = await Promise.all(
                        subjectIds.map((sid) =>
                            ApiSDK.TopicQuestionsService.getQuestionsApiV1QuestionsGet(
                                sid, null, null, null, null, null, 0, PAGE_SIZE
                            )
                        )
                    );
                    if (cancelled) return;
                    let merged: QuestionRow[] = [];
                    const cursors: Record<string, Cursor> = {};
                    results.forEach((resp, i) => {
                        const sid = subjectIds[i];
                        const items = (resp?.items ?? []).map((q: any) => mapQuestion(q));
                        merged = merged.concat(items);
                        cursors[sid] = { skip: PAGE_SIZE, total: resp?.total ?? 0, done: items.length < PAGE_SIZE };
                    });
                    setRows(merged);
                    setSubjectCursors(cursors);

                } else if (filterMode === "by-topic" && topicIds?.length) {
                    const resp = await ApiSDK.TopicQuestionsService.getQuestionsByTopicsApiV1QuestionsByTopicsPost(topicIds);
                    if (cancelled) return;
                    const topics = resp?.topics ?? [];
                    setRows(topics.flatMap((t) => (t.questions ?? []).map((q: any) => mapQuestion(q, t.topic_name))));
                }
            } catch (error: any) {
                addToast({
                    title: "An error occurred",
                    description: error?.body?.detail || error?.body?.message || error?.message || "Network Error",
                    color: "danger",
                });
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        loadInitial();
        return () => { cancelled = true; };
    }, [subjectId, JSON.stringify(subjectIds), JSON.stringify(topicIds), filterMode]);

    const hasMore = useMemo(() => {
        if (filterMode === "by-subject") return !singleCursor.done;
        if (filterMode === "by-subjects") return Object.values(subjectCursors).some((c) => !c.done);
        return false; // by-topic has no pagination on the current endpoint
    }, [filterMode, singleCursor, subjectCursors]);

    const loadMore = async () => {
        setIsLoadingMore(true);
        try {
            if (filterMode === "by-subject" && subjectId && !singleCursor.done) {
                const resp = await ApiSDK.TopicQuestionsService.getQuestionsApiV1QuestionsGet(
                    subjectId, null, null, null, null, null, singleCursor.skip, PAGE_SIZE
                );
                const items = (resp?.items ?? []).map((q: any) => mapQuestion(q));
                setRows((prev) => [...prev, ...items]);
                setSingleCursor((prev) => ({
                    skip: prev.skip + PAGE_SIZE,
                    total: resp?.total ?? prev.total,
                    done: items.length < PAGE_SIZE,
                }));

            } else if (filterMode === "by-subjects" && subjectIds?.length) {
                const pending = subjectIds.filter((sid) => !subjectCursors[sid]?.done);
                const results = await Promise.all(
                    pending.map((sid) =>
                        ApiSDK.TopicQuestionsService.getQuestionsApiV1QuestionsGet(
                            sid, null, null, null, null, null, subjectCursors[sid]?.skip ?? 0, PAGE_SIZE
                        )
                    )
                );
                let newItems: QuestionRow[] = [];
                const updated = { ...subjectCursors };
                results.forEach((resp, i) => {
                    const sid = pending[i];
                    const items = (resp?.items ?? []).map((q: any) => mapQuestion(q));
                    newItems = newItems.concat(items);
                    updated[sid] = {
                        skip: (subjectCursors[sid]?.skip ?? 0) + PAGE_SIZE,
                        total: resp?.total ?? subjectCursors[sid]?.total ?? 0,
                        done: items.length < PAGE_SIZE,
                    };
                });
                setRows((prev) => [...prev, ...newItems]);
                setSubjectCursors(updated);
            }
        } catch (error: any) {
            addToast({
                title: "An error occurred",
                description: error?.body?.detail || error?.body?.message || error?.message || "Network Error",
                color: "danger",
            });
        } finally {
            setIsLoadingMore(false);
        }
    };

    const filteredQuestions = useMemo(() => {
        if (!searchQuery.trim()) return rows;
        const query = searchQuery.toLowerCase();
        return rows.filter((q) => q.question_text.toLowerCase().includes(query));
    }, [rows, searchQuery]);

    const handleSelectionChange = (keys: any) => {
        let newSelectedKeys: Set<string>;
        if (keys === "all") {
            newSelectedKeys = new Set(filteredQuestions.map((q) => String(q.id)));
        } else {
            newSelectedKeys = new Set(Array.from(keys).map(String));
        }
        setSelectedKeys(newSelectedKeys);
        onSelectionChange(filteredQuestions.filter((row) => newSelectedKeys.has(String(row.id))));
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
                    selectedKeys.size === filteredQuestions.length && filteredQuestions.length > 0
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
                            <TableRow key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell>
                                    <div className="max-w-md">
                                        {hasRichContent ? (
                                            <div>
                                                <div className={`overflow-hidden transition-all ${isExpanded ? "" : "max-h-12"}`}>
                                                    <QuestionRenderer
                                                        key={row.id}
                                                        question_content={row.question_content}
                                                        question_text={row.question_text}
                                                        className="text-sm text-gray-800"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : row.id); }}
                                                    className="mt-0.5 text-xs text-orange-500 hover:text-orange-600 font-medium"
                                                >
                                                    {isExpanded ? "Show less" : "Show more"}
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-800 line-clamp-2 cursor-default" title={row.question_text}>
                                                {row.question_text}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell><span className="text-sm text-gray-500">{row.topic_name || "—"}</span></TableCell>
                                <TableCell>
                                    <Chip size="sm" variant="flat" color={getDifficultyColor(row.difficulty)}>
                                        {row.difficulty}
                                    </Chip>
                                </TableCell>
                                <TableCell><span className="font-medium text-gray-700">{row.marks}</span></TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {hasMore && (
                <div className="flex justify-center mt-4">
                    <Button size="sm" variant="flat" isLoading={isLoadingMore} onClick={loadMore}>
                        Load more questions
                    </Button>
                </div>
            )}

            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>Loaded: <span className="text-gray-900">{filteredQuestions.length}</span></div>
                <div className="w-px h-3 bg-gray-200" />
                <div>Selected: <span className="text-kidemia-secondary">{selectedKeys.size}</span></div>
                <div className="w-px h-3 bg-gray-200" />
                <div>
                    Marks:{" "}
                    <span className="text-gray-900">
                        {filteredQuestions.filter((row) => selectedKeys.has(String(row.id))).reduce((sum, row) => sum + row.marks, 0)}
                    </span>
                </div>
            </div>
        </div>
    );
}