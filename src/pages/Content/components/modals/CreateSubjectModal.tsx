import React from 'react';
import Color from 'color';
import {
    Modal,
    ModalContent,
    ModalBody,
    Button,
    Input,

    addToast
} from '@heroui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateSubject } from '../../../../hooks/useSubjects';

const createSubjectSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    code: z
        .string()
        .min(3, 'Code is required')
        .regex(
            /^[A-Z]{2,6}\d{2,4}$/,
            'Code must look like MATH101 or ENG202'
        ),
    description: z.string().optional(),
    color_code: z
        .string().optional(),
});

type CreateSubjectForm = z.infer<typeof createSubjectSchema>;

interface CreateSubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateSubjectModal: React.FC<CreateSubjectModalProps> = ({
    isOpen,
    onClose,
}) => {
    const createSubject = useCreateSubject();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateSubjectForm>({
        resolver: zodResolver(createSubjectSchema),
        defaultValues: {
            name: '',
            code: '',
            description: '',
            color_code: '#BF4C20',
        },
    });

    const onSubmit = async (data: CreateSubjectForm) => {
        try {
            await createSubject.mutateAsync(data);
            addToast({
                title: 'Success',
                description: 'Subject created successfully',
                color: 'success',
            });
            reset();
            onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to create subject',
                color: 'danger',
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="xl"
            placement="center"
            classNames={{
                base: 'bg-kidemia-white',
                backdrop: 'bg-black/50',
            }}
        >
            <ModalContent>
                <ModalBody className="py-8 px-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                <span className="text-gray-900">Create </span>
                                <span className="text-kidemia-secondary">Subject</span>
                            </h2>

                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Name of subject"
                                        variant="flat"
                                        size="lg"
                                        radius="sm"
                                        isInvalid={!!errors.name}
                                        errorMessage={errors.name?.message}
                                        isDisabled={createSubject.isPending}
                                        classNames={{
                                            input: 'placeholder:text-gray-600',
                                            inputWrapper: 'bg-kidemia-biege/30 border-none',
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                name="code"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Subject code (e.g. MATH101)"
                                        variant="flat"
                                        size="lg"
                                        radius="sm"
                                        isInvalid={!!errors.code}
                                        errorMessage={errors.code?.message}
                                        isDisabled={createSubject.isPending}
                                        classNames={{
                                            input: 'uppercase placeholder:text-gray-600',
                                            inputWrapper: 'bg-kidemia-biege/30 border-none',
                                        }}
                                        onChange={(e) =>
                                            field.onChange(e.target.value.toUpperCase())
                                        }
                                    />
                                )}
                            />


                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Brief description of the subject"
                                        variant="flat"
                                        size="lg"
                                        radius="sm"
                                        isInvalid={!!errors.description}
                                        errorMessage={errors.description?.message}
                                        isDisabled={createSubject.isPending}
                                        classNames={{
                                            input: 'placeholder:text-gray-600',
                                            inputWrapper: 'bg-kidemia-biege/30 border-none',
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                name="color_code"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Color (e.g. red, navy, #333333)"
                                        value={field.value}
                                        onChange={(e) => {
                                            const input = e.target.value;

                                            try {
                                                const hex = Color(input).hex();
                                                field.onChange(hex);
                                            } catch {
                                                field.onChange(input);
                                            }
                                        }}
                                        startContent={
                                            <div
                                                className="w-4 h-4 rounded-full border"
                                                style={{
                                                    backgroundColor: (() => {
                                                        try {
                                                            return Color(field.value).hex();
                                                        } catch {
                                                            return '#ccc';
                                                        }
                                                    })(),
                                                }}
                                            />
                                        }
                                    />
                                )}
                            />


                            <div className="flex items-center gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="flat"
                                    size="lg"
                                    radius="sm"
                                    className="flex-1 bg-kidemia-biege/50 text-kidemia-secondary font-medium"
                                    onPress={handleClose}
                                    isDisabled={createSubject.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="lg"
                                    radius="sm"
                                    className="flex-1 bg-kidemia-secondary text-white font-medium"
                                    isLoading={createSubject.isPending}
                                >
                                    Create Subject
                                </Button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};