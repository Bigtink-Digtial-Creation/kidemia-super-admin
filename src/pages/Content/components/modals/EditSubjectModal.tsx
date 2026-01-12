import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Color from 'color'; // Ensure this is installed: npm install color
import {
    addToast,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
} from "@heroui/react";
import { useUpdateSubject } from "../../../../hooks/useSubjects";

const editSubjectSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    code: z
        .string()
        .min(3, 'Code is required')
        .regex(/^[A-Z]{2,6}\d{2,4}$/, 'Code must look like MATH101 or ENG202'),
    description: z.string().optional(),
    color_code: z.string().optional(),
});

type EditSubjectForm = z.infer<typeof editSubjectSchema>;

interface EditSubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    subject: any | null;
}

export const EditSubjectModal: React.FC<EditSubjectModalProps> = ({
    isOpen,
    onClose,
    subject,
}) => {
    const updateSubject = useUpdateSubject();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditSubjectForm>({
        resolver: zodResolver(editSubjectSchema),
    });

    useEffect(() => {
        if (subject && isOpen) {
            reset({
                name: subject.name,
                code: subject.code || '',
                description: subject.description || '',
                color_code: subject.color_code || '#BF4C20',
            });
        }
    }, [subject, isOpen, reset]);

    const onSubmit = async (data: EditSubjectForm) => {
        if (!subject) return;
        try {
            await updateSubject.mutateAsync({
                subjectId: subject.id,
                data,
            });
            addToast({
                title: 'Success',
                description: 'Subject updated successfully',
                color: 'success',
            });
            onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to update subject',
                color: 'danger',
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
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
                                <span className="text-gray-900">Edit </span>
                                <span className="text-kidemia-secondary">Subject</span>
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Name Input */}
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
                                        isDisabled={updateSubject.isPending}
                                        classNames={{
                                            input: 'placeholder:text-gray-600',
                                            inputWrapper: 'bg-kidemia-biege/30 border-none',
                                        }}
                                    />
                                )}
                            />

                            {/* Code Input */}
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
                                        isDisabled={updateSubject.isPending}
                                        classNames={{
                                            input: 'uppercase placeholder:text-gray-600',
                                            inputWrapper: 'bg-kidemia-biege/30 border-none',
                                        }}
                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                    />
                                )}
                            />

                            {/* Description Input */}
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
                                        isDisabled={updateSubject.isPending}
                                        classNames={{
                                            input: 'placeholder:text-gray-600',
                                            inputWrapper: 'bg-kidemia-biege/30 border-none',
                                        }}
                                    />
                                )}
                            />

                            {/* Color Input with Script Conversion */}
                            <Controller
                                name="color_code"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Color (e.g. red, navy, #333333)"
                                        value={field.value}
                                        variant="flat"
                                        size="lg"
                                        radius="sm"
                                        isDisabled={updateSubject.isPending}
                                        classNames={{
                                            input: 'placeholder:text-gray-600',
                                            inputWrapper: 'bg-kidemia-biege/30 border-none',
                                        }}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            try {
                                                // Attempt to convert name to hex immediately
                                                const hex = Color(input).hex();
                                                field.onChange(hex);
                                            } catch {
                                                // If it's not a valid color yet (typing), just update the text
                                                field.onChange(input);
                                            }
                                        }}
                                        startContent={
                                            <div
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{
                                                    backgroundColor: (() => {
                                                        try {
                                                            return Color(field.value).hex();
                                                        } catch {
                                                            return '#ccc'; // Fallback circle color
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
                                    onPress={onClose}
                                    isDisabled={updateSubject.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="lg"
                                    radius="sm"
                                    className="flex-1 bg-kidemia-secondary text-white font-medium"
                                    isLoading={updateSubject.isPending}
                                >
                                    Update Subject
                                </Button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};