import {
  addToast,
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import {
  MdOutlineFormatColorFill,
  MdOutlineMessage,
  MdSubject,
} from "react-icons/md";
import { PiBarcode } from "react-icons/pi";
import { colors } from "../../staticData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddSubjectSchema } from "../../schema/subject.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SubjectCreate } from "../../sdk/generated";
import { ApiSDK } from "../../sdk";
import { apiErrorParser } from "../../utils/errorParser";
import { QueryKeys } from "../../utils/queryKeys";

interface AddSubjectModalI {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}

export default function AddSubjectModal({
  isOpen,
  onOpenChange,
  onClose,
}: AddSubjectModalI) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddSubjectSchema>({
    resolver: zodResolver(AddSubjectSchema),
  });

  const selectedColor = watch("color_code");

  const handleColorChange = (value: string) => {
    setValue("color_code", value, { shouldValidate: true });
  };


  const addSubjectMutation = useMutation({
    mutationFn: (formData: SubjectCreate) => ApiSDK.SubjectsService.createSubjectApiV1SubjectsPost(formData),
    onSuccess(data) {
      onClose()
      queryClient.invalidateQueries({ queryKey: [QueryKeys.subjects] })
      addToast({
        title: `Subject ${data.name} created successfully`,
        color: "success"
      })
    },
    onError(error) {
      const parsedError = apiErrorParser(error)
      addToast({
        title: "An Error Occured",
        description: parsedError.message,
        color: "danger"
      })
    }
  })


  const onSubmit = (data: AddSubjectSchema) => {
    addSubjectMutation.mutate(data)
  };

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
    >
      <ModalContent>
        <ModalBody className="py-8">
          <div className="flex flex-col justify-center px-4 space-y-4">
            <div className="space-y-1">
              <h3 className="text-kidemia-primary text-2xl font-semibold text-center">
                Add a Subject
              </h3>
              <p className="text-kidemia-grey text-md text-center ">
                Fill the form to add a subject
              </p>
            </div>

            <Form className="py-4 space-y-2" onSubmit={handleSubmit(onSubmit)}>
              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Name of subject"
                  startContent={
                    <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  {...register("name")}
                  isInvalid={!!errors?.name?.message}
                  errorMessage={errors?.name?.message}
                  isDisabled={addSubjectMutation.isPending}
                />
              </div>

              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Subject Code"
                  startContent={
                    <PiBarcode className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  {...register("code")}
                  isInvalid={!!errors?.code?.message}
                  errorMessage={errors?.code?.message}
                  isDisabled={addSubjectMutation.isPending}
                />
              </div>
              <div className="pb-2 w-full">
                <Select
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Subject Colour"
                  startContent={
                    <MdOutlineFormatColorFill className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  selectedKeys={selectedColor ? [selectedColor] : []}
                  onChange={(e) => handleColorChange(e.target.value)}
                  isInvalid={!!errors?.color_code?.message}
                  errorMessage={errors?.color_code?.message}
                  isDisabled={addSubjectMutation.isPending}
                >
                  {colors.map((color) => (
                    <SelectItem key={color.key}>{color.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="pb-2 w-full">
                <Textarea
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Subject Description"
                  startContent={
                    <MdOutlineMessage className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  {...register("description")}
                  isInvalid={!!errors?.description?.message}
                  errorMessage={errors?.description?.message}
                  isDisabled={addSubjectMutation.isPending}
                />
              </div>

              <div className="py-4 w-full">
                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                  radius="sm"
                  isDisabled={addSubjectMutation.isPending}
                  isLoading={addSubjectMutation.isPending}
                >
                  Add Subject
                </Button>
              </div>
            </Form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
