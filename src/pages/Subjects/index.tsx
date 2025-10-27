import { useEffect, useMemo, useState } from "react";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { PiBooksBold } from "react-icons/pi";
import { MdOutlineDashboard, MdSearch } from "react-icons/md";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { formatDateToDDMMYYYY } from "../../utils";
import { useDebounce } from "../../hooks/use-debounce";
import { HiDotsHorizontal } from "react-icons/hi";
import DeleteSubjectModal from "../../components/Modals/DeleteSubjectModal";
import UpdateSubjectModal from "../../components/Modals/UpdateSubjectModal";

export default function SubjectsPage() {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [subjectName, setSubjectName] = useState<string>("");

  const delectSubject = useDisclosure();
  const updateSubject = useDisclosure();

  const pageSize = 10;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const { data: subjects, isLoading } = useQuery({
    queryKey: [QueryKeys.subjects, page],
    queryFn: () =>
      ApiSDK.SubjectsService.getSubjectsApiV1SubjectsGet(),
    placeholderData: keepPreviousData,
  });

  const filteredSubjects = useMemo(() => {
    if (!debouncedSearchTerm) return subjects?.items ?? [];
    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return (subjects?.items ?? []).filter(
      (subject) =>
        subject.name.toLowerCase().includes(lowerSearch) ||
        subject.code.toLowerCase().includes(lowerSearch),
    );
  }, [subjects, debouncedSearchTerm]);

  const totalItems = filteredSubjects.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedSubjects = filteredSubjects.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  if (isLoading && !subjects) {
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
              startContent={<PiBooksBold />}
            >
              Subjects
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <div className="space-y-3">
          <div className="flex justify-end items-center">
            <div>
              <Input
                startContent={
                  <MdSearch className="text-xl  text-kidemia-secondary" />
                }
                variant="flat"
                size="lg"
                radius="sm"
                placeholder="Search by subject name or code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                fullWidth
                isClearable
              />
            </div>
          </div>

          <div>
            <Table
              aria-label="subject table"
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
                <TableColumn>No of Topics</TableColumn>
                <TableColumn>No of Questions</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Featured</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Date Created</TableColumn>
                <TableColumn className="w-12">Action</TableColumn>
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
                {paginatedSubjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.code}</TableCell>
                    <TableCell className="text-center">
                      {subject.topics_count}
                    </TableCell>
                    <TableCell className="text-center">
                      {subject.questions_count}
                    </TableCell>
                    <TableCell>{subject.description}</TableCell>
                    <TableCell>
                      <Chip
                        color={
                          subject.is_featured === true ? "success" : "warning"
                        }
                        className="text-xs px-3 capitalize font-bold"
                        variant="flat"
                      >
                        {subject.is_featured === true
                          ? "Featured"
                          : "Not Featured"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={
                          subject.is_active === true ? "success" : "warning"
                        }
                        className="text-xs px-3 capitalize font-bold"
                        variant="flat"
                      >
                        {subject.is_active === true ? "Active" : "Inactive"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {formatDateToDDMMYYYY(subject.created_at)}
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <HiDotsHorizontal className="text-kidemia-secondary text-xl cursor-pointer shrink-0" />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                          <DropdownItem
                            key="view"
                            className="text-kidemia-secondary"
                            color="warning"
                            onPress={() => {
                              if (subject?.id) {
                                setSubjectId(subject.id);
                                updateSubject.onOpen();
                              }
                            }}
                          >
                            View Subject
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            onPress={() => {
                              if (subject?.id) {
                                setSubjectId(subject.id);
                                setSubjectName(subject.name);
                                delectSubject.onOpen();
                              }
                            }}
                          >
                            Delete Subject
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <UpdateSubjectModal
        isOpen={updateSubject.isOpen}
        onOpenChange={updateSubject.onOpenChange}
        onClose={updateSubject.onClose}
        id={subjectId}
      />

      {subjectId ? (
        <DeleteSubjectModal
          isOpen={delectSubject.isOpen}
          onClose={delectSubject.onClose}
          onOpenChange={delectSubject.onOpenChange}
          id={subjectId}
          name={subjectName}
        />
      ) : null}
    </>
  );
}
