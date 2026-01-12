import React, { useRef, useEffect } from 'react';
import Color from 'color';
import {
    Modal,
    ModalContent,
    ModalBody,
    Button,
    Input,
    Textarea,
    Switch,
    Select,
    SelectItem,
    Image,
    addToast,
} from '@heroui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Trash2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useUpdateBadge } from '../../../../hooks/useBadges';
import { createBadgeSchema, type CreateBadgeForm } from '../../../../schema/badge.schema';
import type { BadgeUpdate } from '../../../../sdk/generated';
import { ApiSDK } from '../../../../sdk';

interface EditBadgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    badge: any | null;
}

const CATEGORIES = ['achievement', 'milestone', 'special', 'skill'];
const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export const EditBadgeModal: React.FC<EditBadgeModalProps> = ({
    isOpen,
    onClose,
    badge,
}) => {
    const updateBadge = useUpdateBadge();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateBadgeForm>({
        resolver: zodResolver(createBadgeSchema),
        defaultValues: {
            name: '',
            description: '',
            category: 'achievement',
            rarity: 'common',
            points: 0,
            icon_url: '',
            is_active: true,
            color_code: undefined,
        },
    });

    const iconUrl = watch('icon_url');

    /* Populate form */
    useEffect(() => {
        if (!badge) return;

        reset({
            name: badge.display_name || badge.name,
            description: badge.description || '',
            category: badge.category || 'achievement',
            rarity: badge.rarity || 'common',
            points: badge.points_required || 0,
            icon_url: badge.icon_url || '',
            is_active: badge.is_active ?? true,
            color_code: badge.color_code || undefined,
            criteria: badge.criteria?.rule || '',
        });
    }, [badge, reset]);

    const uploadMutation = useMutation({
        mutationFn: async (file: File) =>
            ApiSDK.UploadService.uploadBadgeImageApiV1ApiUploadBadgesPost({ file }),
        onSuccess: (res) => {
            setValue('icon_url', res.url);
            addToast({
                title: 'Updated',
                description: 'Icon updated successfully',
                color: 'success',
            });
        },
    });

    const onSubmit = async (data: CreateBadgeForm) => {
        if (!badge) return;

        const payload: BadgeUpdate = {
            display_name: data.name,
            description: data.description,
            icon_url: data.icon_url || null,
            is_active: data.is_active,
            color_code: data.color_code || null,
            criteria: data.criteria ? { rule: data.criteria } : null,
        };

        await updateBadge.mutateAsync({
            badgeId: badge.id,
            data: payload,
        });

        addToast({
            title: 'Success',
            description: 'Badge updated successfully',
            color: 'success',
        });

        onClose();
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
                            <span className="text-gray-900">Edit </span>
                            <span className="text-kidemia-secondary">Badge</span>
                        </h2>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4 focus:outline-none"
                        >
                            {/* Icon */}
                            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-kidemia-biege/20">
                                {iconUrl ? (
                                    <div className="relative">
                                        <Image
                                            src={iconUrl}
                                            alt="Badge Icon"
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            color="danger"
                                            className="absolute -top-2 -right-2"
                                            onPress={() => setValue('icon_url', '')}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="flat"
                                        onPress={() => fileInputRef.current?.click()}
                                        isLoading={uploadMutation.isPending}
                                        startContent={<Upload size={18} />}
                                    >
                                        Change Icon
                                    </Button>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                        e.target.files?.[0] &&
                                        uploadMutation.mutate(e.target.files[0])
                                    }
                                />
                            </div>

                            {/* Name & Points */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Badge name"
                                            variant="flat"
                                            size="lg"
                                            radius="sm"
                                            isInvalid={!!errors.name}
                                            errorMessage={errors.name?.message}
                                            classNames={{
                                                inputWrapper:
                                                    'bg-kidemia-biege/30 border-none',
                                            }}
                                        />
                                    )}
                                />
                                <Controller
                                    name="color_code"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            placeholder="Color (optional e.g. #FF6600)"
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                try {
                                                    field.onChange(Color(e.target.value).hex());
                                                } catch {
                                                    field.onChange(e.target.value);
                                                }
                                            }}
                                            startContent={
                                                <div
                                                    className="w-4 h-4 rounded-full border"
                                                    style={{
                                                        backgroundColor: (() => {
                                                            try {
                                                                return field.value
                                                                    ? Color(field.value).hex()
                                                                    : '#ccc';
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
                            </div>

                            {/* Color Code (OPTIONAL) */}


                            {/* Category & Rarity */}
                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            selectedKeys={[field.value]}
                                            variant="flat"
                                        >
                                            {CATEGORIES.map((c) => (
                                                <SelectItem
                                                    key={c}
                                                    className="capitalize"
                                                >
                                                    {c}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                <Controller
                                    name="rarity"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            selectedKeys={[field.value]}
                                            variant="flat"
                                        >
                                            {RARITIES.map((r) => (
                                                <SelectItem
                                                    key={r}
                                                    className="capitalize"
                                                >
                                                    {r}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </div>

                            {/* Description */}
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="Badge description"
                                        variant="flat"
                                        minRows={3}
                                        classNames={{
                                            inputWrapper:
                                                'bg-kidemia-biege/30 border-none',
                                        }}
                                    />
                                )}
                            />

                            {/* Active */}
                            <div className="flex items-center justify-between p-3 bg-kidemia-biege/30 rounded-lg">
                                <span className="text-sm font-medium">
                                    Badge active
                                </span>
                                <Controller
                                    name="is_active"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            isSelected={field.value}
                                            onValueChange={field.onChange}
                                            color="warning"
                                        />
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
                                    isLoading={updateBadge.isPending}
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
