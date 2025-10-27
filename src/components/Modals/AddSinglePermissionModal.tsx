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
import { PiLockKeyFill } from "react-icons/pi";
import { usePermissions } from "../../hooks/use-permission";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SinglePermSchema } from "../../schema/role.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { apiErrorParser } from "../../utils/errorParser";

interface AddSinglePermissionModalI {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  role_id: string;
  name: string;
}
export default function AddSinglePermissionModal({
  isOpen,
  onClose,
  onOpenChange,
  role_id,
  name,
}: AddSinglePermissionModalI) {
  const { permissions } = usePermissions();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SinglePermSchema>({
    resolver: zodResolver(SinglePermSchema),
  });

  const singlePermmutation = useMutation({
    mutationFn: ({
      role_id,
      permission_id,
    }: {
      role_id: string;
      permission_id: string;
    }) =>
      ApiSDK.RolesService.addPermissionToRoleApiV1RolesRoleIdPermissionsPermissionIdPost(
        role_id,
        permission_id,
      ),
    onSuccess() {
      onClose();
      queryClient.invalidateQueries({ queryKey: [QueryKeys.singleRole] });
      addToast({
        title: "Permission added Successfully",
        color: "success",
      });
    },
    onError(error) {
      onClose();
      const parsedError = apiErrorParser(error);
      addToast({
        title: "An Error Occured",
        description: parsedError.message,
        color: "danger",
      });
    },
  });
  const onSubmit = (data: SinglePermSchema) => {
    const payload = {
      ...data,
      role_id,
    };
    singlePermmutation.mutate(payload);
  };

  return (
    <Modal size="md" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalBody>
          <div className="flex flex-col p-4 space-y-8">
            <div className="space-y-1">
              <h3 className="text-kidemia-primary text-2xl font-semibold text-center">
                Add a permission to the {name} role
              </h3>
              <p className="text-kidemia-grey text-md text-center ">
                Select a permission to add
              </p>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="pb-2 w-full">
                <Controller
                  name="permission_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      variant="flat"
                      size="lg"
                      radius="sm"
                      placeholder="Select Permission"
                      aria-label="permission"
                      startContent={
                        <PiLockKeyFill className="text-kidemia-secondary text-xl" />
                      }
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        field.onChange(selected);
                      }}
                      isInvalid={!!errors.permission_id}
                      errorMessage={errors.permission_id?.message}
                      isDisabled={singlePermmutation.isPending}
                    >
                      {permissions ? (
                        permissions.map((perm) => (
                          <SelectItem key={perm.id}>
                            {perm.display_name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key="loading">Loading...</SelectItem>
                      )}
                    </Select>
                  )}
                />
              </div>

              <div className="py-4 w-full">
                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                  radius="sm"
                  isDisabled={singlePermmutation.isPending}
                  isLoading={singlePermmutation.isPending}
                >
                  Add Permission
                </Button>
              </div>
            </Form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
