import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import {
    addToast,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
} from "@heroui/react";
import { Shield } from "lucide-react";
import type { RoleResponse } from "../../../../sdk/generated";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateRole } from "../../../../hooks/useRoles";

interface UpdateRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: RoleResponse | null;
}

/* ✅ Schema: metadata only */
const updateRoleSchema = z.object({
    display_name: z
        .string()
        .min(2, "Display name must be at least 2 characters"),
    description: z
        .string()
        .nullable()
        .optional()
        .or(z.literal("")),
});

type UpdateRoleForm = z.infer<typeof updateRoleSchema>;

export const UpdateRoleModal: React.FC<UpdateRoleModalProps> = ({
    isOpen,
    onClose,
    role,
}) => {
    const updateRole = useUpdateRole();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateRoleForm>({
        resolver: zodResolver(updateRoleSchema),
        defaultValues: {
            display_name: "",
            description: "",
        },
    });

    /* Sync form with role when modal opens */
    useEffect(() => {
        if (role && isOpen) {
            reset({
                display_name: role.display_name ?? "",
                description: role.description ?? "",
            });
        }
    }, [role, isOpen, reset]);

    const onSubmit = async (data: UpdateRoleForm) => {
        if (!role) return;

        try {
            await updateRole.mutateAsync({
                roleId: role.id,
                data: {
                    display_name: data.display_name,
                    description: data.description || "",
                },
            });

            addToast({
                title: "Success",
                description: "Role updated successfully",
                color: "success",
            });

            onClose();
        } catch (error: any) {
            addToast({
                title: "Error",
                description: error.message || "Failed to update role",
                color: "danger",
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            scrollBehavior="inside"
        >
            <ModalContent>
                <ModalHeader className="flex items-center gap-2 border-b px-4 py-3">
                    <Shield className="h-5 w-5 text-kidemia-primary" />
                    <span className="text-kidemia-primary font-semibold">
                        Update Role
                    </span>
                </ModalHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody className="px-4 py-4 space-y-4">
                        {/* Display Name */}
                        <Controller
                            name="display_name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Display name"
                                    placeholder="e.g. Billing Admin"
                                    variant="flat"
                                    size="md"
                                    radius="sm"
                                    isInvalid={!!errors.display_name}
                                    errorMessage={errors.display_name?.message}
                                    isDisabled={updateRole.isPending}
                                />
                            )}
                        />

                        {/* Description */}
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    value={field.value ?? ""}
                                    label="Description"
                                    placeholder="Describe what this role is used for"
                                    variant="flat"
                                    size="md"
                                    radius="sm"
                                    minRows={3}
                                    isInvalid={!!errors.description}
                                    errorMessage={errors.description?.message}
                                    isDisabled={updateRole.isPending}
                                />
                            )}
                        />
                    </ModalBody>

                    <ModalFooter className="border-t px-4 py-3 flex flex-col-reverse sm:flex-row gap-2">
                        <Button
                            variant="light"
                            onPress={onClose}
                            isDisabled={updateRole.isPending}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            color="warning"
                            className="bg-kidemia-primary text-white font-semibold w-full sm:w-auto"
                            isLoading={updateRole.isPending}
                        >
                            Update role
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};
