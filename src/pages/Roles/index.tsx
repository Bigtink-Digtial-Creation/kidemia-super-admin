import { BreadcrumbItem, Breadcrumbs, Tab, Tabs } from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard } from "react-icons/md";
import { SiPrivateinternetaccess } from "react-icons/si";
import AllRoles from "../../components/RoleTables/AllRoles";
import SystemRoles from "../../components/RoleTables/SystemRoles";
import CustomRoles from "../../components/RoleTables/CustomRoles";

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
        <Tabs
          aria-label="Assessment"
          size="sm"
          variant="underlined"
          fullWidth
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-[#BF4C20]",
            tab: "w-full px-0 h-10",
            tabContent:
              "text-sm  group-data-[selected=true]:text-[#BF4C20] group-data-[selected=true]:font-semibold",
          }}
        >
          <Tab key="all" title="All Roles">
            <AllRoles />
          </Tab>
          <Tab key="system" title="System Roles">
            <SystemRoles />
          </Tab>
          <Tab key="custom" title="Custom Roles">
            <CustomRoles />
          </Tab>
        </Tabs>
      </div>
    </section>
  );
}
