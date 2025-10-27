import { usePermissions } from "../../hooks/use-permission";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Chip,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard, MdSearch } from "react-icons/md";
import { GoPasskeyFill } from "react-icons/go";
import { FiPlusSquare } from "react-icons/fi";
import { useEffect, useState } from "react";
import { formatDateToDDMMYYYY, getChipColor } from "../../utils";
import { useDebounce } from "../../hooks/use-debounce";
import CreatePermissionModal from "../../components/Modals/CreatePermissionModal";

export default function PermissionsPage() {
  const addPerm = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const pageSize = 10;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const { permissions, isLoading } = usePermissions();

  const filteredPermissions =
    permissions?.filter((perm) => {
      const search = debouncedSearchTerm.toLowerCase();
      return (
        perm.display_name?.toLowerCase().includes(search) ||
        perm.resource?.toLowerCase().includes(search)
      );
    }) || [];

  const totalPermissions = filteredPermissions.length;
  const totalPages = Math.ceil(totalPermissions / pageSize);

  const paginatedPermissions = filteredPermissions.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  if (isLoading && !permissions) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

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
              href={SidebarRoutes.permissions}
              startContent={<GoPasskeyFill />}
            >
              Permissions
            </BreadcrumbItem>
          </Breadcrumbs>

          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium"
            size="md"
            radius="sm"
            type="button"
            startContent={<FiPlusSquare />}
            onPress={() => addPerm.onOpen()}
          >
            Add New Permission
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-end items-center">
            <div className="md:w-1/2">
              <Input
                startContent={
                  <MdSearch className="text-xl  text-kidemia-secondary" />
                }
                variant="flat"
                size="lg"
                radius="sm"
                placeholder="Search by display name or resource"
                fullWidth
                isClearable
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
              />
            </div>
          </div>
          <Table
            aria-label="permission table"
            isStriped
            className="pt-4"
            bottomContent={
              <div className="flex justify-end py-3">
                <Pagination
                  radius="sm"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                  showControls
                  classNames={{
                    cursor: "border-1 bg-transparent text-kidemia-primary",
                    item: "bg-transparent shadow-none cursor-pointer",
                  }}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn>Display Name</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Description</TableColumn>
              <TableColumn>Action</TableColumn>
              <TableColumn>Resources</TableColumn>
              <TableColumn>Date Created</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                isLoading ? (
                  <Spinner size="lg" color="warning" />
                ) : (
                  "No available permissions"
                )
              }
            >
              {paginatedPermissions?.map((perm) => (
                <TableRow key={perm?.id}>
                  <TableCell className="capitalize whitespace-nowrap">
                    {perm.display_name}
                  </TableCell>
                  <TableCell>{perm.name}</TableCell>
                  <TableCell>{perm.description}</TableCell>
                  <TableCell>
                    <Chip
                      color={getChipColor(perm?.action)}
                      variant="flat"
                      className="text-xs px-3 capitalize font-bold"
                    >
                      {perm.action}
                    </Chip>
                  </TableCell>
                  <TableCell>{perm.resource}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDateToDDMMYYYY(perm?.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <CreatePermissionModal
        isOpen={addPerm.isOpen}
        onOpenChange={addPerm.onOpenChange}
        onClose={addPerm.onClose}
      />
    </>
  );
}
