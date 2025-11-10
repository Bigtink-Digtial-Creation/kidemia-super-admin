import { SidebarRoutes } from "../../routes";
import { MdAssessment, MdOutlineDashboard, MdSearch } from "react-icons/md";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
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
import { FiPlusSquare, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { useEffect, useState } from "react";
import { formatDateToDDMMYYYY } from "../../utils";
import { FaEye } from "react-icons/fa";
import DeleteAssessmentModal from "../../components/Modals/DeleteAssessment";

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [asstId, setAsstId] = useState<string>("");
  const [asstName, setAsstName] = useState("");

  const pageSize = 10;
  const delAsst = useDisclosure();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: assessmentData, isLoading } = useQuery({
    queryKey: [QueryKeys.allAssessment, debouncedSearch],
    queryFn: () =>
      ApiSDK.AssessmentsService.getAssessmentsApiV1AssessmentsGet(
        undefined, // assessmentType
        undefined, // category
        undefined, // subjectId
        undefined, // status
        undefined, // examYear
        undefined, // minPrice
        undefined, // maxPrice
        undefined, // isPublic
        debouncedSearch || undefined, // search
        undefined, // skip
        100,
      ),
  });

  console.log({ assessmentData });

  const totalAssessment = assessmentData?.items.length ?? 0;
  const totalPages = Math.ceil(totalAssessment / pageSize);

  const paginatedAssessment =
    assessmentData?.items.slice((page - 1) * pageSize, page * pageSize) || [];

  if (isLoading && !assessmentData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <>
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <Breadcrumbs variant="light" color="foreground">
            <BreadcrumbItem
              href={SidebarRoutes.dashboard}
              startContent={<MdOutlineDashboard />}
            >
              Dashboard
            </BreadcrumbItem>
            <BreadcrumbItem
              href={SidebarRoutes.assessment}
              startContent={<MdAssessment />}
              color="warning"
            >
              Assessment
            </BreadcrumbItem>
          </Breadcrumbs>

          <div>
            <Button
              className="bg-kidemia-secondary text-kidemia-white font-medium  px-8"
              size="md"
              radius="sm"
              type="button"
              startContent={<FiPlusSquare className="text-lg shrink-0" />}
              onPress={() => navigate(SidebarRoutes.createAssessment)}
            >
              Create Assessment
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-end items-center">
            <div className="md:w-1/2">
              <Input
                startContent={
                  <MdSearch className="text-xl  text-kidemia-secondary" />
                }
                variant="flat"
                size="lg"
                radius="sm"
                placeholder="Search by display name or resource"
                fullWidth
                isClearable
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
            </div>
          </div>

          <Table
            aria-label="all assessment table"
            isStriped
            className="pt-4"
            bottomContent={
              <div className="flex justify-end py-3">
                <Pagination
                  radius="sm"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
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
              <TableColumn>Title</TableColumn>
              <TableColumn>Code</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Time(mins)</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Avg Score</TableColumn>
              <TableColumn>Total Attempts</TableColumn>
              <TableColumn>No. of Questions</TableColumn>
              <TableColumn>Date Created</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>

            <TableBody
              emptyContent={
                isLoading ? (
                  <Spinner size="lg" color="warning" />
                ) : (
                  "No available assessments"
                )
              }
            >
              {paginatedAssessment?.map((asst) => (
                <TableRow key={asst.id}>
                  <TableCell>{asst?.title}</TableCell>
                  <TableCell>{asst?.code}</TableCell>
                  <TableCell className="capitalize">
                    {asst?.assessment_type}
                  </TableCell>
                  <TableCell className="capitalize">{asst?.category}</TableCell>
                  <TableCell className="text-center">
                    {asst?.duration_minutes}
                  </TableCell>
                  <TableCell>{asst?.price}</TableCell>
                  <TableCell className="capitalize">{asst?.status}</TableCell>
                  <TableCell className="text-center">
                    {asst?.average_score}
                  </TableCell>
                  <TableCell className="text-center">
                    {asst?.total_attempts}
                  </TableCell>
                  <TableCell className="text-center">
                    {asst?.total_questions}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDateToDDMMYYYY(asst?.created_at)}
                  </TableCell>

                  <TableCell>
                    <div className="relative flex items-center gap-4">
                      <Tooltip content="View Details">
                        <FaEye
                          // onClick={() => navigate(`/dashboard/roles/${role.id}`)}
                          className="text-kidemia-secondary text-lg cursor-pointer shrink-0 hover:text-kidemia-primary transition-colors duration-200"
                        />
                      </Tooltip>

                      <Tooltip color="danger" content="Delete">
                        <FiTrash2
                          className="text-danger text-lg cursor-pointer shrink-0 hover:text-kidemia-primary transition-colors duration-200"
                          onClick={() => {
                            setAsstId(asst?.id);
                            setAsstName(asst?.title);
                            delAsst.onOpen();
                          }}
                        />
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <DeleteAssessmentModal
        isOpen={delAsst.isOpen}
        onClose={delAsst.onClose}
        onOpenChange={delAsst.onOpenChange}
        assessment_id={asstId}
        name={asstName}
      />
    </>
  );
}
