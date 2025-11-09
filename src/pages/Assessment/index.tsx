import { SidebarRoutes } from "../../routes";
import { MdAssessment, MdOutlineDashboard } from "react-icons/md";
import { BreadcrumbItem, Breadcrumbs, Button } from "@heroui/react";
import { FiPlusSquare } from "react-icons/fi";
import { useNavigate } from "react-router";

export default function AssessmentPage() {
  const navigate = useNavigate();
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

        <div className="space-y-3">index</div>
      </section>
    </>
  );
}
