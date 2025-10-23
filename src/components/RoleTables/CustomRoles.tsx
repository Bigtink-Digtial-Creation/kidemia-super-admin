import { useState } from "react";
import {
  Chip,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { formatDateToDDMMYYYY } from "../../utils";
import { useNavigate } from "react-router";
import { FaEye } from "react-icons/fa";

export default function CustomRoles() {
  const navigate = useNavigate()
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const { data: customRoles, isLoading } = useQuery({
    queryKey: [QueryKeys.customRole, page],
    queryFn: () => ApiSDK.RolesService.getCustomRolesApiV1RolesCustomGet(),
  });

  const totalRoles = customRoles?.length ?? 0;
  const totalPages = Math.ceil(totalRoles / pageSize);
  const paginatedRoles =
    customRoles?.slice((page - 1) * pageSize, page * pageSize) || [];
  return (
    <div>
      <Table
        aria-label="custom roles table"
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
          <TableColumn>Permissions</TableColumn>
          <TableColumn>Role Type</TableColumn>
          <TableColumn>Date Created</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={
            isLoading ? (
              <Spinner size="lg" color="warning" />
            ) : (
              "No available custom roles"
            )
          }
        >
          {paginatedRoles?.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="capitalize whitespace-nowrap">
                {role?.display_name}
              </TableCell>
              <TableCell>{role?.name}</TableCell>
              <TableCell>{role?.description}</TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {role.permissions?.length ? (
                    role.permissions.map((perm) => (
                      <Chip
                        key={perm.id}
                        color="secondary"
                        variant="flat"
                        size="sm"
                        className="capitalize"
                      >
                        {perm.display_name}
                      </Chip>
                    ))
                  ) : (
                    <span className="text-kidemia-grey italic">
                      No permissions
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="capitalize">{role?.role_type}</TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDateToDDMMYYYY(role?.created_at)}
              </TableCell>
              <TableCell>
                <Tooltip content="View Details">
                  <FaEye
                    onClick={() => navigate(`/dashboard/roles/${role.id}`)}
                    className="text-kidemia-secondary text-xl cursor-pointer shrink-0 hover:text-kidemia-primary transition-colors duration-200" />
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
