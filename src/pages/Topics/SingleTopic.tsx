import { useState } from "react";
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

export default function SingleTopic() {
  const { id } = useParams<{ id: string }>();
  const title = useAtomValue(subjectTitleAtom);
  const [page, setPage] = useState<number>(1);

  const pageSize = 10;
  console.log(id);

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

  console.log({ topics });

  if (isLoading && !topics) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
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
        <p className="text-base text-kidemia-grey">Explore All Topics</p>

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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
