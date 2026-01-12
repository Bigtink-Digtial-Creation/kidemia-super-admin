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
import {
    createCategorySchema, useCreateAssessmentCategory,
    type CreateCategoryForm
} from '../../../../hooks/useAssessmentCategories';

interface CreateAssessmentCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateAssessmentCategoryModal: React.FC<CreateAssessmentCategoryModalProps> = ({
    isOpen,
    onClose
}) => {
    const createCategory = useCreateAssessmentCategory();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateCategoryForm>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            category_name: '',
            display_name: '',
            description: '',
            color_code: '#BF4C20',
            is_active: true,
        },
    });

    const onSubmit = async (data: CreateCategoryForm) => {
        try {
            await createCategory.mutateAsync(data);
            addToast({
                title: 'Success',
                description: 'Assessment category created successfully',
                color: 'success',
            });
            handleClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to create category',
                color: 'danger',
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="xl" placement="center">
            <ModalContent>
                <ModalBody className="py-8 px-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-kidemia-primary">Create Assessment Category</h2>

                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Controller
                                name="category_name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Internal Name"
                                        placeholder="e.g. math_primary_1"
                                        variant="flat"
                                        isInvalid={!!errors.category_name}
                                        errorMessage={errors.category_name?.message}
                                        isDisabled={createCategory.isPending}
                                    />
                                )}
                            />

                            <Controller
                                name="display_name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Display Name"
                                        placeholder="e.g. Mathematics Primary 1"
                                        variant="flat"
                                        isInvalid={!!errors.display_name}
                                        errorMessage={errors.display_name?.message}
                                        isDisabled={createCategory.isPending}
                                    />
                                )}
                            />

                            <Controller
                                name="description"
                                control={control}
                                render={({ field: { value, ...rest } }) => (
                                    <Textarea
                                        {...rest}
                                        value={value ?? ''}
                                        label="Description (Optional)"
                                        variant="flat"
                                        minRows={3}
                                        isDisabled={createCategory.isPending}
                                    />
                                )}
                            />

                            <Controller
                                name="color_code"
                                control={control}
                                render={({ field: { value, ...rest } }) => (
                                    <Input
                                        {...rest}
                                        value={value ?? ''}
                                        label="Category Color"
                                        variant="flat"
                                        startContent={
                                            <div
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: value || '#BF4C20' }}
                                            />
                                        }
                                        isDisabled={createCategory.isPending}
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
                                            <p className="text-sm text-gray-600">Make this category available for use</p>
                                        </div>
                                        <Switch
                                            isSelected={field.value}
                                            onValueChange={field.onChange}
                                            color="warning"
                                            isDisabled={createCategory.isPending}
                                        />
                                    </div>
                                )}
                            />

                            <div className="flex items-center gap-4 pt-4">
                                <Button type="button" variant="flat" size="lg" className="flex-1" onPress={handleClose} isDisabled={createCategory.isPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" size="lg" className="flex-1 bg-kidemia-secondary text-white font-medium" isLoading={createCategory.isPending}>
                                    Create Category
                                </Button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};