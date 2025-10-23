import {
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  CardBody,
  CardHeader,
  Spinner,
} from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { SiPrivateinternetaccess } from "react-icons/si";
import { MdOutlineDashboard } from "react-icons/md";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";

export default function SingleRoles() {
  const { id } = useParams<{ id: string }>();
  console.log({ id });

  const { data: singleRole, isLoading } = useQuery({
    queryKey: [QueryKeys.singleRole, id],
    queryFn: () => ApiSDK.RolesService.getRoleApiV1RolesRoleIdGet(id as string),
    enabled: !!id,
  });

  if (isLoading && !singleRole) {
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
            href={SidebarRoutes.roles}
            startContent={<SiPrivateinternetaccess />}
          >
            Roles
          </BreadcrumbItem>
          <BreadcrumbItem startContent={<SiPrivateinternetaccess />}>
            Role Detail
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <Card className="px-6 py-4">
        <CardHeader>
          <h2 className="text-2xl font-bold text-kidemia-primary capitalize">
            {singleRole?.display_name || "Role"}
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-kidemia-grey/70">Role Name</p>
              <p className="font-medium">{singleRole?.name}</p>
            </div>
            <div>
              <p className="text-sm text-kidemia-grey/70">Display Name</p>
              <p className="font-medium">{singleRole?.display_name}</p>
            </div>
            <div>
              <p className="text-sm text-kidemia-grey/70">Role Type</p>
              <p className="font-medium capitalize">{singleRole?.role_type}</p>
            </div>
            <div>
              <p className="text-sm text-kidemia-grey/70">Created At</p>
              <p className="font-medium">
                {new Date(singleRole?.created_at as string).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-kidemia-grey/70">Updated At</p>
              <p className="font-medium">
                {new Date(singleRole?.updated_at as string).toLocaleString()}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-lg font-semibold">Description</p>
              <p className="font-medium text-kidemia-grey/70">
                {singleRole?.description}
              </p>
            </div>
          </div>

          <div className="py-6 space-y-4">
            <h3 className="text-lg font-semibold">Permissions</h3>
            {singleRole?.permissions?.length === 0 ? (
              <p className="text-kidemia-grey/70">
                No permissions for this role
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {singleRole?.permissions?.map((permission) => (
                  <div
                    key={permission?.id}
                    className="bg-kidemia-biege/25 p-4 shadow rounded-xl text-sm space-y-1"
                  >
                    <p className="font-semibold text-kidemia-secondary capitalize">
                      {permission?.display_name}
                    </p>
                    <p className="text-kidemia-grey/70 capitalize">
                      Action: {permission?.action}
                    </p>
                    <p className="text-kidemia-grey/70 capitalize">
                      Resource: {permission?.resource}
                    </p>
                    <p className="text-kidemia-grey/70 capitalize">
                      Desc: {permission?.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
