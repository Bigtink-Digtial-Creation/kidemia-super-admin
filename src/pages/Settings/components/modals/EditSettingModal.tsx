import React, { useEffect } from 'react';
import {
    Modal,
    ModalContent,
    ModalBody,
    Button,
    Textarea,
    Switch,
    addToast,
} from '@heroui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateSetting } from '../../../../hooks/usePlatformSettings';
import { updateSettingSchema, type UpdateSettingForm } from '../../../../schema/platform-setting.schema';

interface EditSettingModalProps {
    isOpen: boolean;
    onClose: () => void;
    setting: any | null;
}

export const EditSettingModal: React.FC<EditSettingModalProps> = ({
    isOpen,
    onClose,
    setting,
}) => {
    const updateSetting = useUpdateSetting();

    const {
        control,
        handleSubmit,
        reset,
        formState: { },
    } = useForm<UpdateSettingForm>({
        resolver: zodResolver(updateSettingSchema),
        defaultValues: {
            value: '',
            description: '',
            is_active: true,
        },
    });

    useEffect(() => {
        if (setting) {
            reset({
                value: setting.value || '',
                description: setting.description || '',
                is_active: setting.is_active,
            });
        }
    }, [setting, reset]);

    const onSubmit = async (data: any) => {
        if (!setting) return;

        try {
            await updateSetting.mutateAsync({
                settingId: setting.id,
                data,
            });
            addToast({
                title: 'Success',
                description: 'Setting updated successfully',
                color: 'success',
            });
            onClose();
        } catch (error: any) {
            addToast({
                title: 'Error',
                description: error.message || 'Failed to update setting',
                color: 'danger',
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalContent>
                <ModalBody className="py-8 px-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-kidemia-primary">
                                    Edit Setting
                                </h2>
                                <p className="text-sm text-gray-600 mt-1 font-mono">
                                    {setting?.key}
                                </p>
                            </div>

                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Controller
                                name="value"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        label="Value"
                                        placeholder="Enter setting value"
                                        variant="flat"
                                        size="lg"
                                        radius="sm"
                                        minRows={3}
                                        isDisabled={updateSetting.isPending}
                                        classNames={{
                                            input: 'font-mono',
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
                                        label="Description"
                                        placeholder="Describe what this setting does"
                                        variant="flat"
                                        size="lg"
                                        radius="sm"
                                        minRows={2}
                                        isDisabled={updateSetting.isPending}
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
                                            <p className="text-sm text-gray-600">Enable this setting</p>
                                        </div>
                                        <Switch
                                            isSelected={field.value}
                                            onValueChange={field.onChange}
                                            color="warning"
                                            isDisabled={updateSetting.isPending}
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
                                    isDisabled={updateSetting.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="lg"
                                    radius="sm"
                                    className="flex-1 bg-kidemia-secondary text-kidemia-white font-medium"
                                    isLoading={updateSetting.isPending}
                                >
                                    Update Setting
                                </Button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};