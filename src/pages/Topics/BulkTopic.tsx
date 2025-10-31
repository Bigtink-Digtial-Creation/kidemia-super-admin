import { useAtomValue } from "jotai";
import { subjectTitleAtom } from "../../store/subject.atom";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard, MdOutlineTopic } from "react-icons/md";

export default function BulkTopic() {
  const title = useAtomValue(subjectTitleAtom);

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
        <p className="text-base text-kidemia-grey">Add Bulk Topics</p>
      </div>
    </section>
  );
}
