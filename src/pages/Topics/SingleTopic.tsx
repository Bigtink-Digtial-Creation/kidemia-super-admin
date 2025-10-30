import { BreadcrumbItem, Breadcrumbs, Spinner } from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard, MdOutlineTopic } from "react-icons/md";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { useAtomValue } from "jotai";
import { subectTitleAtom } from "../../store/subject.atom";

export default function SingleTopic() {
  const { id } = useParams<{ id: string }>()
  const title = useAtomValue(subectTitleAtom)
  console.log(id);

  const { data: topics, isLoading } = useQuery({
    queryKey: [QueryKeys.subjectTopics, id],
    queryFn: () => ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(id as string),
    enabled: !!id
  })

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

          <BreadcrumbItem
            startContent={<MdOutlineTopic />}
            color="warning"

          >
            {title}
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="space-y-3">
        <p className='text-base text-kidemia-grey'>Explore  All Topics</p>

      </div>
    </section>
  )
}
