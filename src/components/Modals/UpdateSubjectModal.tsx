import { useEffect } from "react";
import {
  addToast,
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@heroui/react";
import {
  MdOutlineFormatColorFill,
  MdOutlineMessage,
  MdSubject,
} from "react-icons/md";
import { colors } from "../../staticData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { Controller, useForm } from "react-hook-form";
import {
  updateSubjectSchema,
  type UpdateSubjectFormData,
} from "../../schema/subject.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiErrorParser } from "../../utils/errorParser";

interface UpdateSubjectModalI {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  id: string;
}
export default function UpdateSubjectModal({
  isOpen,
  onOpenChange,
  onClose,
  id,
}: UpdateSubjectModalI) {
  const queryClient = useQueryClient();

  const { data: subject, isLoading } = useQuery({
    queryKey: [QueryKeys.singleSubject, id],
    queryFn: () =>
      ApiSDK.SubjectsService.getSubjectApiV1SubjectsSubjectIdGet(id),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateSubjectFormData>({
    resolver: zodResolver(updateSubjectSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      color_code: "",
      is_active: true,
      is_featured: false,
    },
  });

  useEffect(() => {
    if (subject) {
      reset({
        name: subject.name,
        code: subject.code,
        description: subject.description ?? "",
        color_code: subject.color_code ?? "",
        is_active: subject.is_active,
        is_featured: subject.is_featured,
      });
    }
  }, [subject, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateSubjectFormData) =>
      ApiSDK.SubjectsService.updateSubjectApiV1SubjectsSubjectIdPut(id, data),
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.subjects] });
      onClose();
      addToast({
        description: `${data.name} details is updated successfully`,
        color: "success",
      });
    },
    onError(error) {
      onClose();
      const parsedError = apiErrorParser(error);
      addToast({
        title: "An Error Occured",
        description: parsedError.message,
        color: "danger",
      });
    },
  });

  const onSubmit = (data: UpdateSubjectFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <Modal size="4xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="space-y-8">
        <ModalContent className="px-4">
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-2xl text-kidemia-primary">Subject Details</h3>
            <span className="text-sm text-kidemia-grey">
              You can update the subject details by clicking the edit button
            </span>
          </ModalHeader>
          <ModalBody>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Spinner size="lg" color="warning" />
              </div>
            ) : (
              <>
                <Form
                  className="py-4 space-y-2"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="pb-2 w-full">
                    <Input
                      variant="flat"
                      size="lg"
                      radius="sm"
                      startContent={
                        <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                      }
                      type="text"
                      label="Subject Name"
                      labelPlacement="inside"
                      {...register("name")}
                      errorMessage={errors?.name?.message}
                      isDisabled={updateMutation.isPending}
                    />
                  </div>

                  <div className="pb-2 w-full">
                    <Input
                      variant="flat"
                      size="lg"
                      radius="sm"
                      startContent={
                        <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                      }
                      type="text"
                      label="Subject Code"
                      labelPlacement="inside"
                      {...register("code")}
                      errorMessage={errors.code?.message}
                      isDisabled={updateMutation.isPending}
                    />
                  </div>

                  <div className="pb-2 w-full">
                    <Controller
                      control={control}
                      name="color_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          selectedKeys={field.value ? [field.value] : []}
                          onSelectionChange={(keys) => {
                            const value = Array.from(keys)[0] as string;
                            field.onChange(value);
                          }}
                          variant="flat"
                          size="lg"
                          radius="sm"
                          label="Subject Colour"
                          labelPlacement="inside"
                          startContent={
                            <MdOutlineFormatColorFill className="text-kidemia-secondary text-xl" />
                          }
                          isDisabled={updateMutation.isPending}
                        >
                          {colors.map((color) => (
                            <SelectItem key={color.key}>
                              {color.label}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                  </div>

                  <div className="pb-2 w-full">
                    <RadioGroup
                      label="Subject Active Status"
                      orientation="horizontal"
                      color="warning"
                      value={String(watch("is_active"))}
                      onValueChange={(val) =>
                        setValue("is_active", val === "true")
                      }
                      isDisabled={updateMutation.isPending}
                    >
                      <Radio value="true">Active</Radio>
                      <Radio value="false">Inactive</Radio>
                    </RadioGroup>
                  </div>

                  <div className="pb-2 w-full">
                    <RadioGroup
                      label="Subject Featured Status"
                      orientation="horizontal"
                      color="warning"
                      value={String(watch("is_featured"))}
                      onValueChange={(val) =>
                        setValue("is_featured", val === "true")
                      }
                      isDisabled={updateMutation.isPending}
                    >
                      <Radio value="true">Featured</Radio>
                      <Radio value="false">Not Featured</Radio>
                    </RadioGroup>
                  </div>

                  <div className="pb-2 w-full">
                    <Textarea
                      {...register("description")}
                      variant="flat"
                      size="lg"
                      radius="sm"
                      placeholder="Subject Description"
                      startContent={
                        <MdOutlineMessage className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                      }
                      label="Subject Description"
                      labelPlacement="inside"
                      isDisabled={updateMutation.isPending}
                    />
                  </div>

                  <div className="py-4 w-full flex justify-between items-center space-x-12 gap-4">
                    <Button
                      className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary"
                      variant="faded"
                      size="md"
                      radius="sm"
                      type="button"
                      fullWidth
                      onPress={() => onClose()}
                    >
                      No, Cancel
                    </Button>
                    <Button
                      className="bg-kidemia-secondary text-kidemia-white font-medium"
                      size="md"
                      radius="sm"
                      type="submit"
                      fullWidth
                      isLoading={updateMutation.isPending}
                      isDisabled={updateMutation.isPending}
                    >
                      Edit Subject
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </div>
    </Modal>
  );
}
