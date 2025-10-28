import {
  addToast,
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdOutlineMessage, MdSubject } from "react-icons/md";
import { UpdatePermSchema } from "../../schema/role.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import type { PermissionUpdate } from "../../sdk/generated";
import { apiErrorParser } from "../../utils/errorParser";
import { useEffect } from "react";

interface EditPermModalI {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  permission_id: string;
  name: string;
}

export default function EditPermModal({
  isOpen,
  onClose,
  onOpenChange,
  permission_id,
  name,
}: EditPermModalI) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePermSchema>({
    resolver: zodResolver(UpdatePermSchema),
    defaultValues: {
      display_name: "",
      description: "",
    },
  });

  const { data: singlePerms, isLoading } = useQuery({
    queryKey: [QueryKeys.permissionId, permission_id],
    queryFn: () =>
      ApiSDK.PermissionsService.getPermissionApiV1PermissionsPermissionIdGet(
        permission_id,
      ),
    enabled: !!permission_id,
  });

  useEffect(() => {
    if (singlePerms) {
      reset({
        display_name: singlePerms.display_name,
        description: singlePerms.description ?? "",
      });
    }
  }, [singlePerms, reset]);

  const updatePermMutation = useMutation({
    mutationFn: (formData: PermissionUpdate) =>
      ApiSDK.PermissionsService.updatePermissionApiV1PermissionsPermissionIdPatch(
        permission_id,
        formData,
      ),
    onSuccess() {
      addToast({
        title: "Permission updated",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.permissionId, permission_id],
      });
      onClose();
    },
    onError(error) {
      const parsedError = apiErrorParser(error);
      addToast({
        title: "An Error Occured",
        description: parsedError.message,
        color: "danger",
      });
      onClose();
    },
  });
  const onSubmit = (data: UpdatePermSchema) => {
    const payload: PermissionUpdate = {
      display_name: data.display_name,
      description: data.description,
    };
    updatePermMutation.mutate(payload);
  };

  return (
    <Modal size="md" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalBody className="py-8">
          <div className="flex flex-col justify-center px-4 space-y-4">
            <div className="space-y-1">
              <h3 className="text-kidemia-primary text-2xl font-semibold text-center capitalize">
                Update {name} Permision
              </h3>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Spinner size="lg" color="warning" />
              </div>
            ) : (
              <Form
                onSubmit={handleSubmit(onSubmit)}
                className="py-4 space-y-2"
              >
                <div className="pb-2 w-full">
                  <Input
                    variant="flat"
                    size="lg"
                    radius="sm"
                    label="Name of Role"
                    labelPlacement="inside"
                    startContent={
                      <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                    }
                    type="text"
                    description="A unique role name"
                    {...register("display_name")}
                    defaultValue={singlePerms?.display_name}
                    errorMessage={errors?.display_name?.message}
                    isDisabled={updatePermMutation.isPending}
                  />
                </div>

                <div className="pb-2 w-full">
                  <Textarea
                    variant="flat"
                    size="lg"
                    radius="sm"
                    label="Role Description"
                    labelPlacement="inside"
                    startContent={
                      <MdOutlineMessage className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                    }
                    {...register("description")}
                    defaultValue={singlePerms?.description || ""}
                    errorMessage={errors?.description?.message}
                    isDisabled={updatePermMutation.isPending}
                  />
                </div>

                <div className="py-4 w-full">
                  <Button
                    type="submit"
                    variant="solid"
                    size="lg"
                    className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                    radius="sm"
                    isDisabled={updatePermMutation.isPending}
                    isLoading={updatePermMutation.isPending}
                  >
                    Update Permission
                  </Button>
                </div>
              </Form>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
