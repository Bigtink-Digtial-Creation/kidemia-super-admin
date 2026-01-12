import React, { useEffect } from 'react';
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
    useUpdateAssessmentCategory,
} from '../../../../hooks/useAssessmentCategories';
import { createCategorySchema, type CreateCategoryForm } from '../../../../hooks/useAssessmentCategories';

interface EditAssessmentCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: any | null;
}

export const EditAssessmentCategoryModal: React.FC<EditAssessmentCategoryModalProps> = ({
    isOpen,
    onClose,
    category
}) => {
    const updateCategory = useUpdateAssessmentCategory();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateCategoryForm>({
        resolver: zodResolver(createCategorySchema),
    });

    useEffect(() => {
        if (category && isOpen) {
            reset({
                category_name: category.category_name || '',
                display_name: category.display_name || '',
                description: category.description || '',
                color_code: category.color_code || '#BF4C20',
                is_active: category.is_active !== false,
            });
        }
    }, [category, isOpen, reset]);

    const onSubmit = async (data: CreateCategoryForm) => {
        if (!category?.id) return;

        try {
            await updateCategory.mutateAsync({
                categoryId: category.id,
                data: data,
            });
            addToast({
                title: 'Success',
                description: 'Assessment category updated successfully',
                color: 'success',
            });
            onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to update category',
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
                            <h2 className="text-2xl font-bold text-kidemia-primary">Edit Assessment Category</h2>

                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Controller
                                name="category_name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Internal Name"
                                        variant="flat"
                                        isInvalid={!!errors.category_name}
                                        errorMessage={errors.category_name?.message}
                                        isDisabled={updateCategory.isPending}
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
                                        variant="flat"
                                        isInvalid={!!errors.display_name}
                                        errorMessage={errors.display_name?.message}
                                        isDisabled={updateCategory.isPending}
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
                                        label="Description"
                                        variant="flat"
                                        minRows={3}
                                        isDisabled={updateCategory.isPending}
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
                                        isDisabled={updateCategory.isPending}
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
                                            <p className="text-sm text-gray-600">Make this category available</p>
                                        </div>
                                        <Switch
                                            isSelected={field.value}
                                            onValueChange={field.onChange}
                                            color="warning"
                                            isDisabled={updateCategory.isPending}
                                        />
                                    </div>
                                )}
                            />

                            <div className="flex items-center gap-4 pt-4">
                                <Button type="button" variant="flat" size="lg" className="flex-1" onPress={onClose} isDisabled={updateCategory.isPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" size="lg" className="flex-1 bg-kidemia-secondary text-white font-medium" isLoading={updateCategory.isPending}>
                                    Update Category
                                </Button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};