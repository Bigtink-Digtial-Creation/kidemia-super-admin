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
import { useCreatePromotion } from '../../../../hooks/usePlans';
import {
  createPromotionSchema,
  type CreatePromotionForm,
} from '../../../../schema/promo.schema';
import type { PromotionCreate } from '../../../../sdk/generated';

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePromotionModal = ({
  isOpen,
  onClose,
}: CreatePromotionModalProps) => {
  const createPromotion = useCreatePromotion();

  const {
    control,
    handleSubmit,
    reset,
    formState: { },
  } = useForm<CreatePromotionForm>({
    resolver: zodResolver(createPromotionSchema),
    defaultValues: {
      code: '',
      description: '',
      discount_percentage: '10',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 86400000)
        .toISOString()
        .split('T')[0],
      max_uses: '',
      is_active: true,
    },
  });

  const onSubmit = async (data: CreatePromotionForm) => {
    const payload: PromotionCreate = {
      promo_code: data.code,
      promo_name: data.code,
      discount_type: 'percentage',
      discount_value: Number(data.discount_percentage),

      start_date: data.start_date,
      end_date: data.end_date || null,

      max_uses: data.max_uses ? Number(data.max_uses) : null,
      is_active: data.is_active,
      description: data.description ?? null,
    };

    await createPromotion.mutateAsync(payload);

    addToast({
      title: 'Success',
      description: 'Promotion created successfully',
      color: 'success',
    });

    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalContent>
        <ModalBody className="p-6 space-y-6">
          <h2 className="text-2xl font-bold">Create Promotion</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* PROMO CODE */}
            <Controller
              name="code"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Promo Code"
                  placeholder="SUMMER2025"
                  isInvalid={fieldState.invalid}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />

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
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="number"
                  label="Max Uses (optional)"
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(e.target.value)
                  }
                  isInvalid={fieldState.invalid}
                  errorMessage={fieldState.error?.message}
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
              <Button
                variant="flat"
                onPress={onClose}
                isDisabled={createPromotion.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                className='bg-kidemia-secondary text-white'
                isLoading={createPromotion.isPending}
              >
                Create Promotion
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
