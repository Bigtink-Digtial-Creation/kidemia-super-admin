import React from 'react';
import {
    Modal,
    ModalContent,
    ModalBody,
    Button,
    Input,
    Textarea,
    Switch,
    addToast,
} from '@heroui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTagSchema, useUpdateTag, type CreateTagForm } from '../../../../hooks/useTag';

interface EditTagModalProps {
    isOpen: boolean;
    onClose: () => void;
    tag: any | null;
}

export const EditTagModal: React.FC<EditTagModalProps> = ({
    isOpen,
    onClose,
    tag,
}) => {
    const updateTag = useUpdateTag();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTagForm>({
        resolver: zodResolver(createTagSchema),
    });

    React.useEffect(() => {
        if (tag) {
            reset({
                name: tag.name,
                description: tag.description || '',
                is_active: tag.is_active !== false,
            });
        }
    }, [tag, reset]);

    const onSubmit = async (data: CreateTagForm) => {
        if (!tag) return;

        try {
            await updateTag.mutateAsync({
                tagId: tag.id,
                data,
            });
            addToast({
                title: 'Success',
                description: 'Tag updated successfully',
                color: 'success',
            });
            onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.body?.detail || 'Failed to update tag',
                color: 'danger',
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" placement="center">
            <ModalContent>
                <ModalBody className="py-8 px-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-kidemia-primary">
                                Edit Tag
                            </h2>

                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Tag Name"
                                        placeholder="Enter tag name"
                                        variant="flat"
                                        size="lg"
                                        radius="sm"
                                        isInvalid={!!errors.name}
                                        errorMessage={errors.name?.message}
                                        isDisabled={updateTag.isPending}
                                        classNames={{
                                            inputWrapper: 'bg-gray-50 border-none',
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        label="Description (Optional)"
                                        placeholder="Enter tag description"
                                        variant="flat"
                                        size="lg"
                                        radius="sm"
                                        minRows={3}
                                        isDisabled={updateTag.isPending}
                                        classNames={{
                                            inputWrapper: 'bg-gray-50 border-none',
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                name="is_active"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Active Status</p>
                                            <p className="text-sm text-gray-600">
                                                Make this tag available for use
                                            </p>
                                        </div>
                                        <Switch
                                            isSelected={field.value}
                                            onValueChange={field.onChange}
                                            color="warning"
                                            isDisabled={updateTag.isPending}
                                        />
                                    </div>
                                )}
                            />

                            <div className="flex items-center gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="flat"
                                    size="lg"
                                    radius="sm"
                                    className="flex-1"
                                    onPress={onClose}
                                    isDisabled={updateTag.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="lg"
                                    radius="sm"
                                    className="flex-1 bg-kidemia-secondary text-kidemia-white font-medium"
                                    isLoading={updateTag.isPending}
                                >
                                    Update Tag
                                </Button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};