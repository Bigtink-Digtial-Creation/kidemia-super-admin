import React from 'react';
import {
    Modal,
    ModalContent,
    ModalBody,
    Button,
    Input,
    Textarea,
    Select,
    SelectItem,
    Switch,
    addToast,
} from '@heroui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateSetting } from '../../../../hooks/usePlatformSettings';
import {
    createSettingSchema,
    type CreateSettingForm,
} from '../../../../schema/platform-setting.schema';

interface CreateSettingModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultCategory?: string;
}

export const CreateSettingModal: React.FC<CreateSettingModalProps> = ({
    isOpen,
    onClose,
    defaultCategory = 'general',
}) => {
    const createSetting = useCreateSetting();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateSettingForm>({
        resolver: zodResolver(createSettingSchema),
        defaultValues: {
            key: '',
            value: '',
            category: defaultCategory,
            description: '',
            is_secret: false,
            is_active: true,
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data: CreateSettingForm) => {
        try {
            await createSetting.mutateAsync(data);
            addToast({
                title: 'Success',
                description: 'Setting created successfully',
                color: 'success',
            });
            handleClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to create setting',
                color: 'danger',
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="xl"
            placement="center"
            scrollBehavior="inside"
            classNames={{
                base: 'bg-kidemia-white max-h-[90vh]',
                backdrop: 'bg-black/50',
            }}
        >
            <ModalContent>
                <ModalBody className="py-4 px-4 sm:py-6 sm:px-6 overflow-y-auto">
                    <div className="space-y-6">
                        {/* Header */}
                        <h2 className="text-2xl font-bold">
                            <span className="text-gray-900">Add </span>
                            <span className="text-kidemia-secondary">
                                Platform Setting
                            </span>
                        </h2>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4 focus:outline-none"
                        >
                            {/* Setting Key */}
                            <Controller
                                name="key"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="e.g. paystack.public_key"
                                        variant="flat"
                                        size="lg"
                                        radius="sm"
                                        isInvalid={!!errors.key}
                                        errorMessage={errors.key?.message}
                                        classNames={{
                                            inputWrapper:
                                                'bg-kidemia-biege/30 border-none',
                                            input: 'font-mono',
                                        }}
                                    />
                                )}
                            />

                            {/* Category */}
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        selectedKeys={[field.value]}
                                        variant="flat"
                                        size="lg"
                                        radius="sm"
                                        classNames={{
                                            trigger:
                                                'bg-kidemia-biege/30 border-none',
                                        }}
                                    >
                                        <SelectItem key="payment">
                                            Payment
                                        </SelectItem>
                                        <SelectItem key="email">Email</SelectItem>
                                        <SelectItem key="security">
                                            Security
                                        </SelectItem>
                                        <SelectItem key="notifications">
                                            Notifications
                                        </SelectItem>
                                        <SelectItem key="api">API</SelectItem>
                                        <SelectItem key="general">
                                            General
                                        </SelectItem>
                                    </Select>
                                )}
                            />

                            {/* Value */}
                            <Controller
                                name="value"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="Enter value"
                                        variant="flat"
                                        minRows={3}
                                        classNames={{
                                            inputWrapper:
                                                'bg-kidemia-biege/30 border-none',
                                            input: 'font-mono',
                                        }}
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
                                        placeholder="Optional description"
                                        variant="flat"
                                        minRows={3}
                                        classNames={{
                                            inputWrapper:
                                                'bg-kidemia-biege/30 border-none',
                                        }}
                                    />
                                )}
                            />

                            {/* Switches */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Controller
                                    name="is_secret"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center justify-between p-3 bg-kidemia-biege/30 rounded-lg">
                                            <span className="text-sm font-medium">
                                                Secret
                                            </span>
                                            <Switch
                                                isSelected={field.value}
                                                onValueChange={field.onChange}
                                                color="warning"
                                            />
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="is_active"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center justify-between p-3 bg-kidemia-biege/30 rounded-lg">
                                            <span className="text-sm font-medium">
                                                Active
                                            </span>
                                            <Switch
                                                isSelected={field.value}
                                                onValueChange={field.onChange}
                                                color="success"
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="flat"
                                    size="lg"
                                    radius="sm"
                                    className="flex-1 bg-kidemia-biege/50 text-kidemia-secondary"
                                    onPress={handleClose}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    size="lg"
                                    radius="sm"
                                    className="flex-1 bg-kidemia-secondary text-white"
                                    isLoading={createSetting.isPending}
                                >
                                    Create
                                </Button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>

    );
};