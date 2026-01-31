import { SidebarRoutes } from "../../routes";
import { MdSearch } from "react-icons/md";
import {
  Button,
  Input,
  Pagination,
  useDisclosure,
  Chip,
  Select,
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  addToast,
} from "@heroui/react";
import { FiPlusSquare, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdAssessment } from "react-icons/md"; // Added for header icon
import DeleteAssessmentModal from "../../components/Modals/DeleteAssessment";
import BallSpinner from "../../components/Spinner/BallSpinner";
import { useAssessmentCategories } from "../../hooks/useAssessmentCategories";
import { useAtomValue } from "jotai";
import { loggedinUserAtom } from "../../store/user.atom";

type AssessmentStatus = 'draft' | 'review' | 'published' | 'scheduled' | 'archived' | 'suspended';

export default function AssessmentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { allCategories, isLoading: categoriesLoading } = useAssessmentCategories();

  const storedUser = useAtomValue(loggedinUserAtom);
  const userRoles = storedUser?.user?.roles?.map(r => r.name) ?? [];
  const canManageStatus = ['super_admin', 'admin'].some(role => userRoles.includes(role));

  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [isPublic,] = useState<string>("all");
  const [asstId, setAsstId] = useState<string>("");
  const [asstName, setAsstName] = useState("");

  const pageSize = 10;
  const delAsst = useDisclosure();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: assessmentData, isLoading: assessmentsLoading } = useQuery({
    queryKey: [QueryKeys.allAssessment, debouncedSearch, category, status, isPublic],
    queryFn: () =>
      ApiSDK.AssessmentsService.getAssessmentsApiV1AssessmentsGet(
        'exam',
        category === "all" ? undefined : (category as any),
        undefined,
        status === "all" ? undefined : (status as any),
        undefined,
        undefined,
        undefined,
        isPublic === "all" ? undefined : isPublic === "true",
        debouncedSearch || undefined,
        undefined,
        100,
      ),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: AssessmentStatus }) =>
      ApiSDK.AssessmentsService.updateAssessmentApiV1AssessmentsAssessmentIdPut(
        id,
        { status: newStatus }
      ),
    onSuccess: (resp) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.allAssessment] });
      const new_status = resp.status
      addToast({
        title: "Successful",
        description: `Status updated to ${new_status} successfully`,
      })
    },
  });

  const statuses: { label: string; value: AssessmentStatus; color: "default" | "success" | "warning" | "danger" | "primary" | "secondary" }[] = [
    { label: "Draft", value: "draft", color: "default" },
    { label: "Published", value: "published", color: "success" },
    { label: "Review", value: "review", color: "warning" },
    { label: "Archived", value: "archived", color: "danger" },
  ];

  const totalAssessment = assessmentData?.items.length ?? 0;
  const totalPages = Math.ceil(totalAssessment / pageSize);
  const paginatedAssessment = assessmentData?.items.slice((page - 1) * pageSize, page * pageSize) || [];

  if ((assessmentsLoading || categoriesLoading) && !assessmentData) {
    return <div className="h-screen flex justify-center items-center"><BallSpinner /></div>;
  }

  return (
    <>
      <section className="p-4 md:p-6 space-y-6">
        {/* --- HEADER (Matched to Plan Design) --- */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-kidemia-primary/10 rounded-lg shrink-0">
              <MdAssessment className="h-6 w-6 text-kidemia-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Assessment Management</h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Manage, monitor, and organize assessments.</p>
            </div>
          </div>
          <Button
            className="bg-kidemia-secondary text-white font-medium w-full md:w-auto"
            radius="sm"
            startContent={<FiPlusSquare className="text-lg" />}
            onPress={() => navigate(SidebarRoutes.createAssessment)}
          >
            Create Assessment
          </Button>
        </div>

        {/* --- FILTERS (Matched to Plan Design) --- */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Input
            placeholder="Search by title or code..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            startContent={<MdSearch className="h-5 w-5 text-gray-400" />}
            variant="flat"
            size="lg"
            radius="sm"
            className="w-full flex-1"
          />
          <div className="flex w-full md:w-auto gap-2">
            <Select
              placeholder="Category"
              selectedKeys={[category]}
              onSelectionChange={(k) => setCategory(Array.from(k)[0] as string)}
              variant="flat"
              size="lg"
              radius="sm"
              className="w-full md:w-48"
            >
              {[
                <SelectItem key="all" textValue="All Categories">All Categories</SelectItem>,
                ...allCategories.map((cat) => (
                  <SelectItem key={cat.category_name} textValue={cat.display_name}>{cat.display_name}</SelectItem>
                ))
              ]}
            </Select>
            <Select
              placeholder="Status"
              selectedKeys={[status]}
              onSelectionChange={(k) => setStatus(Array.from(k)[0] as string)}
              variant="flat"
              size="lg"
              radius="sm"
              className="w-full md:w-40"
            >
              {[
                <SelectItem key="all" textValue="All Status">All Status</SelectItem>,
                ...statuses.map((s) => (
                  <SelectItem key={s.value} textValue={s.label}>{s.label}</SelectItem>
                ))
              ]}
            </Select>
          </div>
        </div>

        {/* --- DESKTOP VIEW: Original Table with Pink Stripes --- */}
        <div className="hidden lg:block   overflow-hidden  ">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">TITLE & CODE</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">CATEGORY</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">STATUS</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">QUESTIONS</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssessment.map((asst, index) => (
                <tr
                  key={asst.id}
                  className={`border-b border-gray-100 ${index % 2 === 1 ? 'bg-pink-50/30' : 'bg-white'}`}
                >
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{asst.title}</span>
                      <span className="text-xs text-gray-400 font-mono uppercase">{asst.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <Chip variant="flat" size="sm" color="primary" className="bg-kidemia-primary text-white">
                      {allCategories.find(c => c.category_name === asst.category)?.display_name || asst.category}
                    </Chip>
                  </td>
                  <td className="px-6 py-6">
                    <Chip
                      variant="flat"
                      size="sm"
                      color={statuses.find(s => s.value === asst.status)?.color || "default"}
                      className="capitalize"
                    >
                      {asst.status}
                    </Chip>
                  </td>
                  <td className="px-6 py-6 text-center font-bold text-gray-700">
                    {asst.total_questions}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => navigate(SidebarRoutes.singleAssessment.replace(':id', asst.id))}
                      >
                        <FaEye className="text-gray-400 hover:text-kidemia-secondary text-lg" />
                      </Button>

                      {canManageStatus && (
                        <Dropdown placement="bottom-end">
                          <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">
                              <FiRefreshCw className="text-gray-400" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu onAction={(key) => updateStatusMutation.mutate({ id: asst.id, newStatus: key as AssessmentStatus })}>
                            <DropdownItem key="published">Publish</DropdownItem>
                            <DropdownItem key="review">Review</DropdownItem>
                            <DropdownItem key="draft">Draft</DropdownItem>
                            <DropdownItem key="archived" color="danger" className="text-danger">Archive</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )}

                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => { setAsstId(asst.id); setAsstName(asst.title); delAsst.onOpen(); }}
                      >
                        <FiTrash2 className="text-gray-300 hover:text-danger" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Desktop */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalAssessment)} of {totalAssessment}
              </p>
              <Pagination total={totalPages} page={page} onChange={setPage} size="sm" classNames={{ cursor: 'bg-kidemia-secondary text-white' }} />
            </div>
          )}
        </div>

        {/* --- MOBILE VIEW: Cards (Kept Same) --- */}
        <div className="lg:hidden space-y-4">
          {paginatedAssessment.map((asst) => (
            <div key={asst.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800">{asst.title}</h3>
                  <p className="text-tiny text-slate-400">{asst.code}</p>
                </div>
                <Chip size="sm" color={statuses.find(s => s.value === asst.status)?.color || "default"} variant="flat">
                  {asst.status}
                </Chip>
              </div>
              <div className="grid grid-cols-2 gap-4 text-small text-slate-500 py-2 border-y border-slate-50">
                <div>
                  <span className="text-tiny uppercase text-slate-400 block">Category</span>
                  <span className="font-medium text-gray-900">{asst.category}</span>
                </div>
                <div>
                  <span className="text-tiny uppercase text-slate-400 block">Questions</span>
                  <span className="font-medium text-gray-900">{asst.total_questions}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-kidemia-secondary text-white" size="sm" onPress={() => navigate(SidebarRoutes.singleAssessment.replace(':id', asst.id))}>
                  View Details
                </Button>
                <Button isIconOnly color="danger" variant="flat" size="sm" onPress={() => { setAsstId(asst.id); setAsstName(asst.title); delAsst.onOpen(); }}>
                  <FiTrash2 />
                </Button>
              </div>
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination total={totalPages} page={page} onChange={setPage} size="sm" classNames={{ cursor: 'bg-kidemia-secondary text-white' }} />
            </div>
          )}
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