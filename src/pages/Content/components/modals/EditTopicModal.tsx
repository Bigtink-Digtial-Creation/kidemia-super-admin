import z from 'zod';
import { useEffect } from 'react';
import { useUpdateTopic } from '../../../../hooks/useSubjects';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    addToast,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    Textarea,
} from '@heroui/react';

const editTopicSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    code: z.string().min(1, 'Code is required'),
    description: z.string().optional(),
});

type EditTopicForm = z.infer<typeof editTopicSchema>;

interface EditTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    topic: {
        id: string;
        name: string;
        code: string;
        description?: string | null;
    } | null;
}

export const EditTopicModal: React.FC<EditTopicModalProps> = ({
    isOpen,
    onClose,
    topic,
}) => {
    const updateTopic = useUpdateTopic();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditTopicForm>({
        resolver: zodResolver(editTopicSchema),
        defaultValues: {
            name: '',
            code: '',
            description: '',
        },
    });

    // Populate form when the topic changes (modal opens for a specific topic)
    useEffect(() => {
        if (topic) {
            reset({
                name: topic.name,
                code: topic.code,
                description: topic.description ?? '',
            });
        }
    }, [topic, reset]);

    const onSubmit = async (data: EditTopicForm) => {
        if (!topic) return;
        try {
            await updateTopic.mutateAsync({ topicId: topic.id, data });
            addToast({
                title: 'Success',
                description: 'Topic updated successfully',
                color: 'success',
            });
            onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to update topic',
                color: 'danger',
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalContent>
                <ModalBody className="py-8 px-6">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-center">Edit Topic</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Topic Name"
                                        placeholder="Enter topic name"
                                        variant="flat"
                                        size="lg"
                                        radius="sm"
                                        isInvalid={!!errors.name}
                                        errorMessage={errors.name?.message}
                                        isDisabled={updateTopic.isPending}
                                    />
                                )}
                            />

                            <Controller
                                name="code"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Topic Code"
                                        placeholder="e.g. MATH-101"
                                        variant="flat"
                                        size="lg"
                                        radius="sm"
                                        isInvalid={!!errors.code}
                                        errorMessage={errors.code?.message}
                                        isDisabled={updateTopic.isPending}
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
                                        placeholder="Enter topic description"
                                        variant="flat"
                                        size="lg"
                                        radius="sm"
                                        minRows={3}
                                        isDisabled={updateTopic.isPending}
                                    />
                                )}
                            />

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="flat"
                                    size="lg"
                                    radius="sm"
                                    className="flex-1"
                                    onPress={onClose}
                                    isDisabled={updateTopic.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="lg"
                                    radius="sm"
                                    className="flex-1 bg-kidemia-secondary text-white"
                                    isLoading={updateTopic.isPending}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};