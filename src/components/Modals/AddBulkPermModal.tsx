/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addToast,
  Button,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { usePermissions } from "../../hooks/use-permission";
import { zodResolver } from "@hookform/resolvers/zod";
import { BulkPermSchema } from "../../schema/role.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { apiErrorParser } from "../../utils/errorParser";
import { PiLockKeyFill } from "react-icons/pi";
import z from "zod";

interface AddBulkPermModalI {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  role_id: string;
  name: string;
  existingPermissionIds?: string[];
}

export default function AddBulkPermModal({
  isOpen,
  onClose,
  onOpenChange,
  role_id,
  name,
  existingPermissionIds = [],
}: AddBulkPermModalI) {
  const { permissions, isLoading } = usePermissions();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(BulkPermSchema),
    defaultValues: {
      permission_ids: [],
    },
  });

  const bulkPermMutation = useMutation({
    mutationFn: ({
      role_id,
      permission_ids,
    }: {
      role_id: string;
      permission_ids: string[];
    }) =>
      ApiSDK.RolesService.assignPermissionsToRoleApiV1RolesRoleIdPermissionsPost(
        role_id,
        { permission_ids },
      ),
    onSuccess() {
      addToast({
        title: "Permission added Successfully",
        color: "success",
      });
      reset();
      onClose();
      queryClient.invalidateQueries({ queryKey: [QueryKeys.singleRole] });
    },
    onError(error) {
      const parsedError = apiErrorParser(error);
      addToast({
        title: "An Error Occured",
        description: parsedError.message,
        color: "danger",
      });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: BulkPermSchema) => {
    const newIds = Array.isArray(data.permission_ids)
      ? data.permission_ids
      : [data.permission_ids];

    const mergedIds = Array.from(
      new Set([...existingPermissionIds, ...newIds]),
    );

    const payload = {
      role_id,
      permission_ids: mergedIds,
    };
    bulkPermMutation.mutate(payload);
  };

  return (
    <Modal size="md" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalBody>
          <div className="flex flex-col p-4 space-y-8">
            <div className="space-y-1">
              <h3 className="text-kidemia-primary text-2xl font-semibold text-center">
                Add mutiple permissions to the {name} role
              </h3>
              <p className="text-kidemia-grey text-md text-center ">
                Select multiple permissions to add
              </p>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="pb-2 w-full">
                <Controller
                  name="permission_ids"
                  control={control}
                  render={({ field }) => {
                    const valueAsArray = Array.isArray(field.value)
                      ? field.value
                      : typeof field.value === "string" && field.value
                        ? field?.value
                            ?.split(",")
                            .filter(
                              (id: unknown) => z.uuid().safeParse(id).success,
                            )
                        : [];
                    const validIds = valueAsArray.filter((id: any) =>
                      permissions?.some(
                        (perm) => String(perm.id) === String(id),
                      ),
                    );

                    return (
                      <Select
                        {...field}
                        selectionMode="multiple"
                        selectedKeys={new Set(validIds)}
                        onSelectionChange={(keys) =>
                          field.onChange(Array.from(keys))
                        }
                        isLoading={isLoading}
                        variant="flat"
                        size="lg"
                        radius="sm"
                        placeholder="Role Permissions"
                        aria-label="permission"
                        startContent={
                          <PiLockKeyFill className="text-kidemia-secondary text-xl" />
                        }
                        isInvalid={!!errors.permission_ids}
                        errorMessage={errors.permission_ids?.message}
                        isDisabled={bulkPermMutation.isPending}
                      >
                        {permissions ? (
                          permissions.map((perm) => (
                            <SelectItem
                              key={perm.id}
                              isDisabled={existingPermissionIds.includes(
                                perm.id,
                              )}
                            >
                              {perm.display_name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem key="loading">Loading...</SelectItem>
                        )}
                      </Select>
                    );
                  }}
                />
              </div>

              <div className="py-4 w-full">
                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                  radius="sm"
                  isDisabled={bulkPermMutation.isPending}
                  isLoading={bulkPermMutation.isPending}
                >
                  Add Bulk Permissions
                </Button>
              </div>
            </Form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
