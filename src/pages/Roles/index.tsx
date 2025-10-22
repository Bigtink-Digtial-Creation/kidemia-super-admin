import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard } from "react-icons/md";
import { SiPrivateinternetaccess } from "react-icons/si";
import AllRoles from "../../components/RoleTables/AllRoles";

export default function RolesPage() {
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
            href={SidebarRoutes.roles}
            startContent={<SiPrivateinternetaccess />}
          >
            Roles
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="space-y-3">
        <AllRoles />
      </div>
    </section>
  );
}
