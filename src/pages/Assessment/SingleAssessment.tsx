import { BreadcrumbItem, Breadcrumbs, Spinner } from "@heroui/react";
import { useParams } from "react-router";
import { SidebarRoutes } from "../../routes";
import { MdAssessment, MdOutlineDashboard } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import StatCard from "../../components/Dashboard/StatCard";
import { BsFillQuestionSquareFill, BsHandThumbsDownFill } from "react-icons/bs";
import { LiaFilePowerpointSolid } from "react-icons/lia";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { SiSpeedtest } from "react-icons/si";

export default function SingleAssessment() {
  const { id } = useParams<{ id: string }>();
  console.log({ id });

  const { data: singleAssessment, isLoading } = useQuery({
    queryKey: [QueryKeys.singleAssement, id],
    queryFn: () =>
      ApiSDK.AssessmentsService.getAssessmentApiV1AssessmentsAssessmentIdGet(
        id!,
        false,
      ),
    enabled: !!id,
  });

  console.log({ singleAssessment });

  if (isLoading && !singleAssessment) {
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
              href={SidebarRoutes.assessment}
              startContent={<MdAssessment />}
            >
              Assessment
            </BreadcrumbItem>
            <BreadcrumbItem startContent={<MdAssessment />} color="warning">
              Assessment Detail
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-5 lg:gap-4">
            <StatCard
              icon={BsFillQuestionSquareFill}
              title="Total Questions"
              figure={singleAssessment?.total_questions || "00"}
            />
            <StatCard
              icon={LiaFilePowerpointSolid}
              title="Total Points"
              figure={singleAssessment?.total_points || "00"}
            />
            <StatCard
              icon={BsHandThumbsDownFill}
              title="Total Fails"
              figure={singleAssessment?.total_fails || "00"}
            />
            <StatCard
              icon={FaCheck}
              title="Total Passes"
              figure={singleAssessment?.total_passes || "00"}
            />
            <StatCard
              icon={FaCheckDouble}
              title="Total Completions"
              figure={singleAssessment?.total_completions || "00"}
            />
            <StatCard
              icon={SiSpeedtest}
              title="Total Attempts"
              figure={singleAssessment?.total_attempts || "00"}
            />
          </div>

          <div className="py-2">SingleAssessment form here</div>
        </div>
      </section>
    </>
  );
}
