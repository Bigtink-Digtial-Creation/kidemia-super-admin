import {
  Breadcrumbs,
  BreadcrumbItem,
  Button,
  useDisclosure,
} from "@heroui/react";
import { AuthRoutes, SidebarRoutes } from "../../routes";
import { MdOutlineDashboard } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { Link } from "react-router";
import DeleteAccountModal from "../../components/Sidebar/DeleteAccountModal";

export default function SettingsPage() {
  const delAcct = useDisclosure();
  return (
    <>
      <div className="space-y-8">
        <div>
          <Breadcrumbs variant="light" color="foreground">
            <BreadcrumbItem
              href={SidebarRoutes.dashboard}
              startContent={<MdOutlineDashboard />}
            >
              Dashboard
            </BreadcrumbItem>
            <BreadcrumbItem
              href={SidebarRoutes.settings}
              startContent={<FiSettings />}
              color="warning"
            >
              Settings
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <div className="space-y-6">
          <div className="bg-kidemia-biege/25 py-5 px-8 w-full rounded-2xl shadow-sm flex justify-between items-center">
            <div className="space-y-2">
              <h3 className="text-lg text-kidemia-black font-medium">
                Account Settings
              </h3>
              <p className="text-sm text-kidemia-grey">
                Modify Name and accont related informations
              </p>
            </div>

            <div>
              <Link
                to={SidebarRoutes.profile}
                className="text-base text-kidemia-secondary hover:underline"
              >
                Update Profile
              </Link>
            </div>
          </div>

          <div className="bg-kidemia-biege/25 py-5 px-8 w-full rounded-2xl shadow-sm flex justify-between items-center">
            <div className="space-y-2">
              <h3 className="text-lg text-kidemia-black font-medium">
                Change Password
              </h3>
              <p className="text-sm text-kidemia-grey">
                Change or update your password
              </p>
            </div>

            <div>
              <Link
                to={AuthRoutes.changePassword}
                className="text-base text-kidemia-secondary hover:underline"
              >
                Change Pasword
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg text-red-500">Danger Zone</h3>

          <div className="bg-kidemia-biege/25 py-5 px-8 w-full rounded-2xl shadow-sm flex justify-between items-center">
            <div className="space-y-2">
              <h3 className="text-lg text-kidemia-black font-medium">
                Delete Account
              </h3>
              <p className="text-sm text-kidemia-grey">
                Delete your account with us
              </p>
            </div>

            <div>
              <Button
                className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
                size="md"
                radius="sm"
                onPress={() => delAcct.onOpen()}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
      <DeleteAccountModal
        isOpen={delAcct.isOpen}
        onOpenChange={delAcct.onOpenChange}
        onClose={delAcct.onClose}
      />
    </>
  );
}
