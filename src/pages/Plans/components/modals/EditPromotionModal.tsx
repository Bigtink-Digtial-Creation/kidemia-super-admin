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
import { useEffect } from 'react';
import { useUpdatePromotion } from '../../../../hooks/usePlans';
import {
    createPromotionSchema,
    type CreatePromotionForm,
} from '../../../../schema/promo.schema';
import type { PromotionCreate } from '../../../../sdk/generated';

interface EditPromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    promotion: any | null;
}

export const EditPromotionModal = ({
    isOpen,
    onClose,
    promotion,
}: EditPromotionModalProps) => {
    const updatePromotion = useUpdatePromotion();

    const {
        control,
        handleSubmit,
        reset,
        formState: { },
    } = useForm<CreatePromotionForm>({
        resolver: zodResolver(createPromotionSchema),
        defaultValues: {
            is_active: true,
        },
    });

    useEffect(() => {
        if (promotion) {
            reset({
                code: promotion.promo_code,
                description: promotion.description ?? '',
                discount_percentage: String(promotion.discount_value),
                start_date: promotion.start_date?.split('T')[0],
                end_date: promotion.end_date?.split('T')[0] ?? '',
                max_uses:
                    promotion.max_uses != null
                        ? String(promotion.max_uses)
                        : '',
                is_active: Boolean(promotion.is_active),
            });
        }
    }, [promotion, reset]);

    const onSubmit = async (data: CreatePromotionForm) => {
        if (!promotion) return;

        const payload: PromotionCreate = {
            promo_code: promotion.promo_code,
            promo_name: promotion.promo_name ?? promotion.promo_code,
            discount_type: 'percentage',
            discount_value: Number(data.discount_percentage),

            start_date: data.start_date,
            end_date: data.end_date || null,

            max_uses: data.max_uses ? Number(data.max_uses) : null,
            is_active: data.is_active,
            description: data.description ?? null,
        };

        await updatePromotion.mutateAsync({
            promotionId: promotion.id,
            data: payload,
        });

        addToast({
            title: 'Success',
            description: 'Promotion updated successfully',
            color: 'success',
        });

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalContent>
                <ModalBody className="p-6 space-y-6">
                    <h2 className="text-2xl font-bold">Edit Promotion</h2>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* DISCOUNT */}
                        <Controller
                            name="discount_percentage"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    label="Discount Percentage"
                                    value={field.value ?? ''}
                                    onChange={(e) =>
                                        field.onChange(e.target.value)
                                    }
                                    isInvalid={fieldState.invalid}
                                    errorMessage={fieldState.error?.message}
                                    endContent={<span>%</span>}
                                />
                            )}
                        />

                        {/* DATES */}
                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                name="start_date"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Input
                                        {...field}
                                        type="date"
                                        label="Start Date"
                                        isInvalid={fieldState.invalid}
                                        errorMessage={fieldState.error?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="end_date"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Input
                                        {...field}
                                        type="date"
                                        label="End Date"
                                        isInvalid={fieldState.invalid}
                                        errorMessage={fieldState.error?.message}
                                    />
                                )}
                            />
                        </div>

                        {/* MAX USES */}
                        <Controller
                            name="max_uses"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    label="Max Uses"
                                    value={field.value ?? ''}
                                    onChange={(e) =>
                                        field.onChange(e.target.value)
                                    }
                                />
                            )}
                        />

                        {/* DESCRIPTION */}
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    label="Description"
                                    minRows={2}
                                />
                            )}
                        />

                        {/* ACTIVE */}
                        <Controller
                            name="is_active"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <span className="font-medium">
                                        Active Promotion
                                    </span>
                                    <Switch
                                        color='success'
                                        isSelected={!!field.value}
                                        onValueChange={field.onChange}
                                    />
                                </div>
                            )}
                        />

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                className='bg-kidemia-secondary text-white'
                                isLoading={updatePromotion.isPending}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
