import {
  addToast,
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdOutlineMessage, MdSubject } from "react-icons/md";
import { PermissionSchema } from "../../schema/role.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiSDK } from "../../sdk";
import type { PermissionCreate } from "../../sdk/generated";
import { QueryKeys } from "../../utils/queryKeys";
import { apiErrorParser } from "../../utils/errorParser";

interface CreatePermissionModalI {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}
export default function CreatePermissionModal({
  isOpen,
  onOpenChange,
  onClose,
}: CreatePermissionModalI) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PermissionSchema>({
    resolver: zodResolver(PermissionSchema),
  });

  const addPermMutation = useMutation({
    mutationFn: (formData: PermissionCreate) =>
      ApiSDK.PermissionsService.createPermissionApiV1PermissionsPost(formData),
    onSuccess() {
      addToast({
        title: "Permission created successfully",
        color: "success",
      });
      onClose();
      reset();
      queryClient.invalidateQueries({ queryKey: [QueryKeys.permissions] });
    },
    onError(error) {
      onClose();
      reset();
      const parsedError = apiErrorParser(error);
      addToast({
        title: "An Error Occured",
        description: parsedError.message,
        color: "danger",
      });
    },
  });

  const onSubmit = (data: PermissionSchema) => {
    console.log(data);
    addPermMutation.mutate(data);
  };

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
    >
      <ModalContent>
        <ModalBody className="py-8">
          <div className="flex flex-col justify-center px-4 space-y-4">
            <div className="space-y-1">
              <h3 className="text-kidemia-primary text-2xl font-semibold text-center">
                Add a New Permission
              </h3>
              <p className="text-kidemia-grey text-md text-center ">
                Fill the form to add a permission
              </p>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)} className="py-4 space-y-2">
              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Name of Permission"
                  startContent={
                    <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  description="Unique permission name (e.g., 'users:create')"
                  {...register("name")}
                  isInvalid={!!errors?.name?.message}
                  errorMessage={errors?.name?.message}
                  isDisabled={addPermMutation.isPending}
                />
              </div>

              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Display Name"
                  startContent={
                    <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  description="Human-readable permission name"
                  {...register("display_name")}
                  isInvalid={!!errors?.display_name?.message}
                  errorMessage={errors?.display_name?.message}
                  isDisabled={addPermMutation.isPending}
                />
              </div>
              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Resource"
                  startContent={
                    <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  description="Resource name (e.g., 'users', 'roles')"
                  {...register("resource")}
                  isInvalid={!!errors?.resource?.message}
                  errorMessage={errors?.resource?.message}
                  isDisabled={addPermMutation.isPending}
                />
              </div>

              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Action"
                  startContent={
                    <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  description="Action name (e.g., 'create', 'read', 'update', 'delete')"
                  {...register("action")}
                  isInvalid={!!errors?.action?.message}
                  errorMessage={errors?.action?.message}
                  isDisabled={addPermMutation.isPending}
                />
              </div>

              <div className="pb-2 w-full">
                <Textarea
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Description"
                  startContent={
                    <MdOutlineMessage className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  {...register("description")}
                  isInvalid={!!errors?.description?.message}
                  errorMessage={errors?.description?.message}
                  isDisabled={addPermMutation.isPending}
                />
              </div>

              <div className="py-4 w-full">
                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                  radius="sm"
                  isDisabled={addPermMutation.isPending}
                  isLoading={addPermMutation.isPending}
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
