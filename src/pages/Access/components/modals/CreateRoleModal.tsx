import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    Select,
    SelectItem,
    addToast,
} from '@heroui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, AlertCircle } from 'lucide-react';
import { useCreateRole } from '../../../../hooks/useRoles';

const createRoleSchema = z.object({
    name: z
        .string()
        .min(3, 'Name must be at least 3 characters')
        .regex(/^[a-z_]+$/, 'Lowercase letters and underscores only'),
    display_name: z.string().min(3, 'Display name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    role_type: z.enum(['custom', 'system']),
});

type CreateRoleForm = z.infer<typeof createRoleSchema>;

interface CreateRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
    isOpen,
    onClose,
}) => {
    const createRole = useCreateRole();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateRoleForm>({
        resolver: zodResolver(createRoleSchema),
        defaultValues: {
            name: '',
            display_name: '',
            description: '',
            role_type: 'custom',
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data: CreateRoleForm) => {
        try {
            await createRole.mutateAsync(data);
            addToast({
                title: 'Success',
                description: 'Role created successfully',
                color: 'success',
            });
            handleClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to create role',
                color: 'danger',
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" scrollBehavior="inside">
            <ModalContent>
                <ModalHeader className="flex items-center gap-2 border-b px-4 py-3">
                    <Shield className="h-5 w-5 text-kidemia-primary" />
                    <span className="text-kidemia-primary font-semibold">
                        Create role
                    </span>
                </ModalHeader>

                <ModalBody className="px-4 py-4">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        {/* Role ID */}
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Role ID"
                                    placeholder="e.g. content_manager"
                                    description="Immutable identifier. Lowercase letters and underscores only."
                                    variant="flat"
                                    size="md"
                                    radius="sm"
                                    isInvalid={!!errors.name}
                                    errorMessage={errors.name?.message}
                                    isDisabled={createRole.isPending}
                                />
                            )}
                        />

                        {/* Display name */}
                        <Controller
                            name="display_name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Display name"
                                    placeholder="e.g. Content Manager"
                                    variant="flat"
                                    size="md"
                                    radius="sm"
                                    isInvalid={!!errors.display_name}
                                    errorMessage={errors.display_name?.message}
                                    isDisabled={createRole.isPending}
                                />
                            )}
                        />

                        {/* Role type */}
                        <Controller
                            name="role_type"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Role type"
                                    selectedKeys={[field.value]}
                                    onSelectionChange={(keys) =>
                                        field.onChange(Array.from(keys)[0])
                                    }
                                    variant="flat"
                                    size="md"
                                    radius="sm"
                                    isInvalid={!!errors.role_type}
                                    errorMessage={errors.role_type?.message}
                                    isDisabled={createRole.isPending}
                                >
                                    <SelectItem key="custom">Custom</SelectItem>
                                    <SelectItem key="system">System</SelectItem>
                                </Select>
                            )}
                        />

                        {/* Description */}
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    label="Description"
                                    placeholder="Describe what this role is responsible for"
                                    variant="flat"
                                    size="md"
                                    radius="sm"
                                    minRows={3}
                                    isInvalid={!!errors.description}
                                    errorMessage={errors.description?.message}
                                    isDisabled={createRole.isPending}
                                />
                            )}
                        />

                        {/* Guidelines – inside body */}
                        <div className="flex gap-3 text-sm text-gray-700 border-l-4 border-blue-500 bg-blue-50 px-3 py-2 rounded-sm">
                            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium mb-1">Naming guidelines</p>
                                <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                                    <li>Use lowercase letters and underscores</li>
                                    <li>Choose clear, descriptive names</li>
                                    <li>Avoid abbreviations</li>
                                </ul>
                            </div>
                        </div>

                        {/* Hidden submit for enter key */}
                        <button type="submit" hidden />

                    </form>
                </ModalBody>

                <ModalFooter className="border-t px-4 py-3 flex flex-col-reverse sm:flex-row gap-2">
                    <Button
                        variant="light"
                        onPress={handleClose}
                        isDisabled={createRole.isPending}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>

                    <Button
                        color="warning"
                        className="bg-kidemia-secondary text-white font-semibold w-full sm:w-auto"
                        isLoading={createRole.isPending}
                        onPress={() => handleSubmit(onSubmit)()}
                    >
                        Create role
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
