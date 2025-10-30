import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard } from "react-icons/md";
import { SiPrivateinternetaccess } from "react-icons/si";
import AllRoles from "../../components/RoleTables/AllRoles";
import SystemRoles from "../../components/RoleTables/SystemRoles";
import CustomRoles from "../../components/RoleTables/CustomRoles";
import { FiPlusSquare } from "react-icons/fi";
import AddRoleModal from "../../components/Modals/AddRoleModal";

export default function RolesPage() {
  const addRole = useDisclosure();
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
              href={SidebarRoutes.roles}
              startContent={<SiPrivateinternetaccess />}
              color="warning"

            >
              Roles
            </BreadcrumbItem>
          </Breadcrumbs>

          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium"
            size="md"
            radius="sm"
            type="button"
            startContent={<FiPlusSquare />}
            onPress={() => addRole.onOpen()}
          >
            Add New Role
          </Button>
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

      <AddRoleModal
        isOpen={addRole.isOpen}
        onOpenChange={addRole.onOpenChange}
        onClose={addRole.onClose}
      />
    </>
  );
}
