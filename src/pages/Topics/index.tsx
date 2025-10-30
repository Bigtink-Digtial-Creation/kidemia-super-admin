import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Chip,
  Spinner,
} from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard, MdOutlineTopic } from "react-icons/md";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { subjectTitleAtom } from "../../store/subject.atom";

export default function TopicsPage() {
  const navigate = useNavigate();
  const setSubjectTitle = useSetAtom(subjectTitleAtom);

  const { data: subjects, isLoading } = useQuery({
    queryKey: [QueryKeys.subjects],
    queryFn: () => ApiSDK.SubjectsService.getSubjectsApiV1SubjectsGet(),
    placeholderData: keepPreviousData,
  });

  const subject = subjects?.items || [];

  if (isLoading && !subjects) {
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
        </Breadcrumbs>
      </div>

      <div className="space-y-3">
        <p className="text-base text-kidemia-grey">
          Explore Topics Organized by Subject
        </p>
        {subject?.length === 0 ? (
          <p className="text-kidemia-grey/70 text-center">
            No Available Subjects
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {subject?.map((sub) => (
              <div
                key={sub.id}
                className="bg-kidemia-biege/25 p-4 shadow rounded-xl text-sm space-y-2"
              >
                <p className="font-semibold text-kidemia-secondary capitalize">
                  {sub?.name} ({sub?.code})
                </p>
                <p className="text-kidemia-grey/70 capitalize">
                  {sub?.description}
                </p>

                <div className="flex  justify-between items-center">
                  <div className="py-2 flex gap-2">
                    <Chip
                      color={sub.is_active === true ? "success" : "warning"}
                      className="text-xs px-3 capitalize font-bold"
                      variant="flat"
                      size="sm"
                    >
                      {sub.is_active === true ? "Active" : "Inactive"}
                    </Chip>

                    <Chip
                      color={sub.is_featured === true ? "success" : "warning"}
                      className="text-xs px-3 capitalize font-bold"
                      variant="flat"
                      size="sm"
                    >
                      {sub.is_featured === true ? "Featured" : "Not Featured"}
                    </Chip>
                  </div>
                  <div>
                    <Button
                      variant="light"
                      color="warning"
                      radius="full"
                      size="sm"
                      className="text-sm text-kidemia-secondary font-semibold hover:underline"
                      onPress={() => {
                        setSubjectTitle(sub?.name);
                        navigate(`/dashboard/topics/${sub.id}`);
                      }}
                    >
                      View Topics
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
