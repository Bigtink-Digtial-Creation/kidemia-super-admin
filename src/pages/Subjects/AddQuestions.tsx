import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { useParams } from "react-router";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard, MdOutlineTopic } from "react-icons/md";
import { subjectQuestonTitleAtom } from "../../store/subject.atom";
import { useAtomValue } from "jotai";

export default function AddQuestions() {
  const { id } = useParams<{ id: string }>();
  const title = useAtomValue(subjectQuestonTitleAtom);

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

            <BreadcrumbItem startContent={<MdOutlineTopic />}
              href={`/dashboard/subjects/${id}`}
            >
              All {title} Questions
            </BreadcrumbItem>

            <BreadcrumbItem startContent={<MdOutlineTopic />}
              color="warning"
            >
              Add {title} Questions
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <div className="space-y-3">
          <p className="text-base text-kidemia-grey">
            Fill the form to add questions
          </p>

          <div className="py-2">
            AddQuestions
          </div>
        </div>
      </section>
    </>
  )
}
