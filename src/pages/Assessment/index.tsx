import { SidebarRoutes } from '../../routes'
import { MdAssessment, MdOutlineDashboard } from 'react-icons/md'
import { BreadcrumbItem, Breadcrumbs } from '@heroui/react'

export default function AssessmentPage() {
  return (
    <>
    <section className='space-y-8'>
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
              color="warning"
            >
              Assessment
            </BreadcrumbItem>
          </Breadcrumbs>
      </div>
      
      <div className='space-y-3'>
          index
      </div>
      </section>
    </>
  )
}
