import { BreadcrumbItem, Breadcrumbs } from '@heroui/react'
import { SidebarRoutes } from '../../routes'
import { SiPrivateinternetaccess } from 'react-icons/si'
import { MdOutlineDashboard } from 'react-icons/md'
import { useParams } from 'react-router'

export default function SingleRoles() {
  const {id} = useParams<{id:string}>()
  console.log({id});
  
  return (
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
            href={SidebarRoutes.roles}
            startContent={<SiPrivateinternetaccess />}
          >
            Roles
          </BreadcrumbItem>
          <BreadcrumbItem
            startContent={<SiPrivateinternetaccess />}
          >
            Role Detail
          </BreadcrumbItem>
        </Breadcrumbs>

      
      </div>

      <div>
        lol
      </div>
    </section>
  )
}
