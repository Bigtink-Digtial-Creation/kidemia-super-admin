import z from "zod";
import { useCreateTopic } from "../../../../hooks/useSubjects";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast, Button, Input, Modal, ModalBody, ModalContent, Textarea } from "@heroui/react";


const createTopicSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    code: z.string().min(1, 'Code is required'),
    subject_id: z.string(),
});

type CreateTopicForm = z.infer<typeof createTopicSchema>;

interface CreateTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    subjectId: string | undefined;
    subjectName: string;
}

export const CreateTopicModal: React.FC<CreateTopicModalProps> = ({
    isOpen,
    onClose,
    subjectId,
    subjectName,
}) => {
    const createTopic = useCreateTopic();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTopicForm>({
        resolver: zodResolver(createTopicSchema),
        defaultValues: {
            name: '',
            description: '',
            code: '',
            subject_id: subjectId || '',
        },
    });

    const onSubmit = async (data: CreateTopicForm) => {
        try {
            await createTopic.mutateAsync(data);
            addToast({
                title: 'Success',
                description: 'Topic created successfully',
                color: 'success',
            });
            reset();
            onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to create topic',
                color: 'danger',
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalContent>
                <ModalBody className="py-8 px-6">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-center">
                            Add Topic to {subjectName}
                        </h2>

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
                                        isDisabled={createTopic.isPending}
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
                                        isInvalid={!!errors.code}
                                        errorMessage={errors.code?.message}
                                        isDisabled={createTopic.isPending}
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
                                        isDisabled={createTopic.isPending}
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
                                    isDisabled={createTopic.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="lg"
                                    radius="sm"
                                    className="flex-1 bg-kidemia-secondary text-white"
                                    isLoading={createTopic.isPending}
                                >
                                    Create Topic
                                </Button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};