import { useState } from "react";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
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
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { useAtomValue } from "jotai";
import { formatDateToDDMMYYYY, getDifficultyColor } from "../../utils";
import { subjectTitleAtom } from "../../store/subject.atom";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { FiPlusSquare, FiTrash2 } from "react-icons/fi";
import DeleteTopicModal from "../../components/Modals/DeleteTopicModal";
import UpdateTopicModal from "../../components/Modals/UpdateTopicModal";

export default function SingleTopic() {
  const { id } = useParams<{ id: string }>();
  const title = useAtomValue(subjectTitleAtom);
  const [page, setPage] = useState<number>(1);
  const [topicId, setTopicId] = useState<string>("");
  const [topicName, setTopicName] = useState<string>("");
  const delTopic = useDisclosure();
  const updateTopic = useDisclosure();

  const pageSize = 10;

  const { data: topicsData, isLoading } = useQuery({
    queryKey: [QueryKeys.subjectTopics, id, page],
    queryFn: () =>
      ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(
        id as string,
      ),
    enabled: !!id,
  });

  const topics = topicsData?.items || [];
  const totalItems = topics?.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedTopics = topics?.slice((page - 1) * pageSize, page * pageSize);

  if (isLoading && !topics) {
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
              href={SidebarRoutes.topics}
              startContent={<MdOutlineTopic />}
            >
              Topics
            </BreadcrumbItem>

            <BreadcrumbItem startContent={<MdOutlineTopic />} color="warning">
              {title}
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-base text-kidemia-grey">Explore All Topics</p>
            <div className="flex justify-between items-center gap-6">
              <Button
                className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary"
                variant="faded"
                size="md"
                radius="sm"
                type="button"
                startContent={<FiPlusSquare />}
              >
                Add New Topic
              </Button>
              <Button
                className="bg-kidemia-secondary text-kidemia-white font-medium"
                size="md"
                radius="sm"
                type="submit"
                startContent={<FiPlusSquare />}
              >
                Add Bulk Topic
              </Button>
            </div>
          </div>

          <div>
            <Table
              aria-label="topics table"
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
                <TableColumn>Name</TableColumn>
                <TableColumn>Code</TableColumn>
                <TableColumn>No of Questions</TableColumn>
                <TableColumn>Content</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Level</TableColumn>
                <TableColumn>Time(mins)</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Doc Url</TableColumn>
                <TableColumn>Video Url</TableColumn>
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
                {paginatedTopics?.map((topic) => (
                  <TableRow key={topic.id}>
                    <TableCell className="whitespace-nowrap">
                      {topic.name}
                    </TableCell>
                    <TableCell>{topic.code}</TableCell>
                    <TableCell className="text-center">
                      {topic.questions_count}
                    </TableCell>
                    <TableCell>{topic.content || "---"}</TableCell>
                    <TableCell>{topic.description || "---"}</TableCell>
                    <TableCell>
                      <Chip
                        color={getDifficultyColor(
                          topic?.difficulty_level as string,
                        )}
                        variant="flat"
                        className="text-xs px-3 capitalize font-bold"
                        size="sm"
                      >
                        {topic.difficulty_level}
                      </Chip>
                    </TableCell>
                    <TableCell className="text-center">
                      {topic.estimated_time_minutes}
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={topic.is_active === true ? "success" : "warning"}
                        className="text-xs px-3 capitalize font-bold"
                        variant="flat"
                        size="sm"
                      >
                        {topic.is_active === true ? "Active" : "Inactive"}
                      </Chip>
                    </TableCell>
                    <TableCell>{topic.document_url || "---"}</TableCell>
                    <TableCell>{topic.video_url || "---"}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDateToDDMMYYYY(topic.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="relative flex items-center gap-4">
                        <Tooltip content="Update">
                          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <PiPencilSimpleLineBold
                              onClick={() => {
                                setTopicId(topic?.id);
                                setTopicName(topic?.name);
                                updateTopic.onOpen();
                              }}
                            />
                          </span>
                        </Tooltip>

                        <Tooltip color="danger" content="Delete">
                          <span className="text-lg text-danger cursor-pointer active:opacity-50">
                            <FiTrash2
                              onClick={() => {
                                setTopicId(topic?.id);
                                setTopicName(topic?.name);
                                delTopic.onOpen();
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

      <DeleteTopicModal
        isOpen={delTopic.isOpen}
        onClose={delTopic.onClose}
        onOpenChange={delTopic.onOpenChange}
        topic_id={topicId}
        name={topicName}
      />

      <UpdateTopicModal
        isOpen={updateTopic.isOpen}
        onClose={updateTopic.onClose}
        onOpenChange={updateTopic.onOpenChange}
        topic_id={topicId}
        name={topicName}
      />
    </>
  );
}
