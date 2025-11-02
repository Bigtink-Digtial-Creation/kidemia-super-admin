import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Chip,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard, MdOutlineTopic } from "react-icons/md";
import { subjectQuestonTitleAtom } from "../../store/subject.atom";
import { useAtomValue } from "jotai";
import {
  formatDateToDDMMYYYY,
  getDifficultyColor,
  toTitleCase,
} from "../../utils";
import { FiEye, FiTrash2 } from "react-icons/fi";
import DeleteQuestionModal from "../../components/Modals/DeleteQuestionModal";

export default function SingleSubject() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<number>(1);
  const [questionId, setQuestionId] = useState<string>("");
  const title = useAtomValue(subjectQuestonTitleAtom);
  const delQuestion = useDisclosure();

  const pageSize = 10;

  const { data: questionsData, isLoading } = useQuery({
    queryKey: [QueryKeys.questionsById, id],
    queryFn: () =>
      ApiSDK.TopicQuestionsService.getQuestionsApiV1QuestionsGet(id as string),
    enabled: !!id,
  });

  const questions = questionsData?.items || [];
  const totalItems = questions?.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedQuestions = questions?.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  if (isLoading && !questions) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <>
      <section className="space-y-8">
        <div>
          <Breadcrumbs variant="light" color="foreground">
            <BreadcrumbItem
              href={SidebarRoutes.dashboard}
              startContent={<MdOutlineDashboard />}
            >
              Dashboard
            </BreadcrumbItem>
            <BreadcrumbItem
              href={SidebarRoutes.subjects}
              startContent={<MdOutlineTopic />}
            >
              Subjects
            </BreadcrumbItem>

            <BreadcrumbItem startContent={<MdOutlineTopic />} color="warning">
              {title} Questions
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-base text-kidemia-grey">
              Explore All {title} Questions
            </p>
          </div>

          <div>
            <Table
              aria-label="questions table"
              isStriped
              className="pt-4"
              bottomContent={
                <div className="flex justify-end py-3">
                  <Pagination
                    radius="sm"
                    page={page}
                    total={totalPages}
                    onChange={(newPage) => setPage(newPage)}
                    showControls
                    classNames={{
                      cursor: "border-1 bg-transparent text-kidemia-primary",
                      item: "bg-transparent shadow-none cursor-pointer",
                    }}
                  />
                </div>
              }
            >
              <TableHeader>
                <TableColumn>Question</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>Reviewed By</TableColumn>
                <TableColumn>Difficulty Level</TableColumn>
                <TableColumn>Time(mins)</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Points</TableColumn>
                <TableColumn>Success Rate</TableColumn>
                <TableColumn>Date Created</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>

              <TableBody
                emptyContent={
                  isLoading ? (
                    <Spinner size="lg" color="warning" />
                  ) : (
                    "No available data"
                  )
                }
              >
                {paginatedQuestions?.map((questions) => (
                  <TableRow key={questions.id}>
                    <TableCell>{questions.question_text}</TableCell>
                    <TableCell>
                      {toTitleCase(questions.question_type)}
                    </TableCell>
                    <TableCell>{questions.reviewed_by || "---"}</TableCell>
                    <TableCell>
                      <Chip
                        color={getDifficultyColor(
                          questions?.difficulty_level as string,
                        )}
                        variant="flat"
                        className="text-xs px-3 capitalize font-bold"
                        size="sm"
                      >
                        {questions.difficulty_level}
                      </Chip>
                    </TableCell>

                    <TableCell className="text-center">
                      {questions.time_limit_seconds}
                    </TableCell>
                    <TableCell className="capitalize">
                      {questions.status}
                    </TableCell>
                    <TableCell className="text-center">
                      {questions.points}
                    </TableCell>
                    <TableCell className="text-center">
                      {questions.success_rate}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDateToDDMMYYYY(questions.created_at)}
                    </TableCell>

                    <TableCell>
                      <div className="relative flex items-center gap-4">
                        <Tooltip content="View Details">
                          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <FiEye
                            // onClick={() => {
                            //   setTopicId(topic?.id);
                            //   setTopicName(topic?.name);
                            //   updateTopic.onOpen();
                            // }}
                            />
                          </span>
                        </Tooltip>

                        <Tooltip color="danger" content="Delete">
                          <span className="text-lg text-danger cursor-pointer active:opacity-50">
                            <FiTrash2
                              onClick={() => {
                                setQuestionId(questions?.id);
                                delQuestion.onOpen();
                              }}
                            />
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <DeleteQuestionModal
        isOpen={delQuestion.isOpen}
        onClose={delQuestion.onClose}
        onOpenChange={delQuestion.onOpenChange}
        question_id={questionId}
      />
    </>
  );
}
