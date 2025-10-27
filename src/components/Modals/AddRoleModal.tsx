import {
  addToast,
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { MdOutlineMessage, MdSubject } from "react-icons/md";
import { PiLockKeyFill } from "react-icons/pi";
import { usePermissions } from "../../hooks/use-permission";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddRoleSchema } from "../../schema/role.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiSDK } from "../../sdk";
import type { RoleCreate } from "../../sdk/generated";
import { QueryKeys } from "../../utils/queryKeys";
import { apiErrorParser } from "../../utils/errorParser";
import z from "zod";


interface Permission {
  id: string; // UUID string
  display_name: string;
}

interface AddRoleModalI {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  permissions?: Permission[] | null;
  isLoading?: boolean;
}

const roleType = [
  { key: "custom", label: "Custom" },
  { key: "system", label: "System" },
];
export default function AddRoleModal({
  isOpen,
  onOpenChange,
  onClose,
}: AddRoleModalI) {

  const { permissions, isLoading } = usePermissions();
  const queryClient = useQueryClient()

  const { register, handleSubmit, control, formState: { errors } } = useForm<AddRoleSchema>({
    resolver: zodResolver(AddRoleSchema),
    defaultValues: {
      name: "",
      display_name: "",
      description: "",
      role_type: undefined,
      permission_ids: [],
    },
  })


  const addRoleMutation = useMutation({
    mutationFn: (formData: RoleCreate) => ApiSDK.RolesService.createRoleApiV1RolesPost(formData),
    onSuccess() {
      onClose()
      queryClient.invalidateQueries({ queryKey: [QueryKeys.roles] })
      addToast({
        title: "Role created successfully",
        color: "success"
      })
    },
    onError(error) {
      onClose()
      const parsedError = apiErrorParser(error)
      addToast({
        title: "An Error Occured",
        description: parsedError.message,
        color: "danger"
      })
    }
  })

  const onSubmit = (data: AddRoleSchema) => {
    // addRoleMutation.mutate(data)
    console.log({ data });

  }

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
                Add a Role
              </h3>
              <p className="text-kidemia-grey text-md text-center ">
                Fill the form to add a role
              </p>
            </div>

            <Form className="py-4 space-y-2" onSubmit={handleSubmit(onSubmit)}>
              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Name of Role"
                  startContent={
                    <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  description="A unique role name"
                  {...register("name")}
                  isInvalid={!!errors?.name?.message}
                  errorMessage={errors?.name?.message}
                  // isDisabled={addRoleMutation.isPending}
                />
              </div>
              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Role Display Name"
                  startContent={
                    <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  description="Human-readable role name"
                  {...register("display_name")}
                  isInvalid={!!errors?.display_name?.message}
                  errorMessage={errors?.display_name?.message}
                  // isDisabled={addRoleMutation.isPending}
                />
              </div>

              <div className="pb-2 w-full">
                {/* <Controller
                  name="role_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) =>
                        field.onChange(Array.from(keys)[0])
                      }
                      variant="flat"
                      size="lg"
                      radius="sm"
                      placeholder="Role Type"
                      startContent={<PiLockKeyFill className="text-kidemia-secondary text-xl" />}
                      isInvalid={!!errors.role_type}
                      errorMessage={errors.role_type?.message}
                    // isDisabled={addRoleMutation.isPending}
                    >
                      {roleType.map((role) => (
                        <SelectItem key={role.key}>{role.label}</SelectItem>
                      ))}
                    </Select>
                  )}
                /> */}
                <Controller
                  name="role_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) =>
                        field.onChange(Array.from(keys)[0] || undefined) // CHANGE: Handle undefined
                      }
                      variant="flat"
                      size="lg"
                      radius="sm"
                      placeholder="Role Type"
                      startContent={<PiLockKeyFill className="text-kidemia-secondary text-xl" />}
                      isInvalid={!!errors.role_type}
                      errorMessage={errors.role_type?.message}
                      // isDisabled={addRoleMutation.isPending}
                    >
                      {roleType.map((role) => (
                        <SelectItem key={role.key}>{role.label}</SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>
              <div className="pb-2 w-full">
                {/* <Controller
                  name="permission_ids"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      selectionMode="multiple"
                      selectedKeys={field.value || []}
                      onSelectionChange={(keys) =>
                        field.onChange(Array.from(keys))
                      }
                      isLoading={isLoading}
                      variant="flat"
                      size="lg"
                      radius="sm"
                      placeholder="Role Permissions"
                      startContent={<PiLockKeyFill className="text-kidemia-secondary text-xl" />}
                      isInvalid={!!errors.permission_ids}
                      errorMessage={errors.permission_ids?.message}
                    // isDisabled={addRoleMutation.isPending}
                    >
                      {permissions?.map((perm) => (
                        <SelectItem key={perm.id}>{perm.display_name}</SelectItem>
                      ))}
                    </Select>
                  )}
                /> */}


                {/* <Controller
                  name="permission_ids"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      selectionMode="multiple"
                      selectedKeys={new Set(field.value ?? [])} // ✅ convert array to Set
                      onSelectionChange={(keys) => field.onChange(Array.from(keys))} // ✅ convert Set to array
                      isLoading={isLoading}
                      variant="flat"
                      size="lg"
                      radius="sm"
                      placeholder="Role Permissions"
                      startContent={<PiLockKeyFill className="text-kidemia-secondary text-xl" />}
                      isInvalid={!!errors.permission_ids}
                      errorMessage={errors.permission_ids?.message}
                    >
                      {permissions?.map((perm) => (
                        <SelectItem key={perm.id}>{perm.display_name}</SelectItem>
                      ))}
                    </Select>
                  )}
                /> */}
                {/*
                {permissions && permissions.length > 0 ? (
                  <Controller
                    name="permission_ids"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        selectionMode="multiple"
                        selectedKeys={new Set(field.value?.filter(id =>
                          permissions.some(perm => perm.id === id)
                        ) ?? [])}
                        onSelectionChange={(keys) => field.onChange(Array.from(keys))}
                        isLoading={isLoading}
                        variant="flat"
                        size="lg"
                        radius="sm"
                        placeholder="Role Permissions"
                        startContent={<PiLockKeyFill className="text-kidemia-secondary text-xl" />}
                        isInvalid={!!errors.permission_ids}
                        errorMessage={errors.permission_ids?.message}
                      >
                        {permissions.map((perm) => (
                          <SelectItem key={perm.id}>{perm.display_name}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                ) : (
                  <div>Loading permissions...</div>
                )} */}

                {/* <Controller
                  name="permission_ids"
                  control={control}
                  render={({ field }) => {
                    // Normalize field.value to an array
                    const valueAsArray = Array.isArray(field.value)
                      ? field.value
                      : typeof field.value === 'string' && field.value
                        ? field.value.split(',') // Convert comma-separated string to array
                        : [];

                    // Filter valid IDs
                    const validIds = valueAsArray.filter((id: any) =>
                      permissions?.some(perm => String(perm.id) === String(id))
                    );

                    return (
                      <Select
                        {...field}
                        selectionMode="multiple"
                        selectedKeys={new Set(validIds)}
                        onSelectionChange={(keys) => field.onChange(Array.from(keys))}
                        isLoading={isLoading}
                        variant="flat"
                        size="lg"
                        radius="sm"
                        placeholder="Role Permissions"
                        startContent={<PiLockKeyFill className="text-kidemia-secondary text-xl" />}
                        isInvalid={!!errors.permission_ids}
                        errorMessage={errors.permission_ids?.message}
                      >
                        {permissions?.map((perm) => (
                          <SelectItem key={perm.id}>{perm.display_name}</SelectItem>
                        ))}
                      </Select>
                    );
                  }}
                /> */}

                <Controller
                  name="permission_ids"
                  control={control}
                  render={({ field }) => {
                    // CHANGE: Add debug log
                    console.log("field.value:", field.value, "type:", typeof field.value);

                    // CHANGE: Normalize field.value to array with UUID validation
                    const valueAsArray = Array.isArray(field.value)
                      ? field.value
                      : typeof field.value === 'string' && field.value
                        ? field.value.split(',').filter((id: unknown) => z.uuid().safeParse(id).success)
                        : [];

                    // CHANGE: Filter valid UUIDs that exist in permissions
                    const validIds = valueAsArray.filter((id: any) =>
                      permissions?.some(perm => String(perm.id) === String(id))
                    );

                    return (
                      <Select
                        {...field}
                        selectionMode="multiple"
                        selectedKeys={new Set(validIds)}
                        onSelectionChange={(keys) => field.onChange(Array.from(keys))}
                        isLoading={isLoading}
                        variant="flat"
                        size="lg"
                        radius="sm"
                        placeholder="Role Permissions"
                        startContent={<PiLockKeyFill className="text-kidemia-secondary text-xl" />}
                        isInvalid={!!errors.permission_ids}
                        errorMessage={errors.permission_ids?.message}
                      // isDisabled={addRoleMutation.isPending}
                      >
                        {permissions ? (
                          permissions.map((perm) => (
                            <SelectItem key={perm.id}>{perm.display_name}</SelectItem>
                          ))
                        ) : (
                          <SelectItem key="loading">Loading...</SelectItem>
                        )}
                      </Select>
                    );
                  }}
                />
              </div>

              <div className="pb-2 w-full">
                <Textarea
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Role Description"
                  startContent={
                    <MdOutlineMessage className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  {...register("description")}
                  isInvalid={!!errors?.description?.message}
                  errorMessage={errors?.description?.message}
                  // isDisabled={addRoleMutation.isPending}
                />
              </div>

              <div className="py-4 w-full">
                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                  radius="sm"
                  // isDisabled={addRoleMutation.isPending}
                  // isLoading={addRoleMutation.isPending}
                >
                  Add Role
                </Button>
              </div>
            </Form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
