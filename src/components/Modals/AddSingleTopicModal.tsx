import {
  addToast,
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Radio,
  RadioGroup,
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddTopicSchema } from "../../schema/subject.schema";
import { MdOutlineMessage, MdSubject } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiSDK } from "../../sdk";
import type { TopicCreate } from "../../sdk/generated";
import { QueryKeys } from "../../utils/queryKeys";
import { apiErrorParser } from "../../utils/errorParser";

interface AddSingleTopicModalI {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  topic_id: string;
}

export default function AddSingleTopicModal({
  isOpen,
  onOpenChange,
  onClose,
  topic_id,
}: AddSingleTopicModalI) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddTopicSchema>({
    resolver: zodResolver(AddTopicSchema),
    defaultValues: {
      name: "",
      code: "",
      estimated_time_minutes: "",
      video_url: "",
      document_url: "",
      is_active: true,
      difficulty_level: "easy",
      description: "",
      content: "",
    },
  });

  const addTopicMutation = useMutation({
    mutationFn: (data: TopicCreate) =>
      ApiSDK.SubjectTopicsService.createTopicApiV1TopicsPost(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.subjectTopics] });
      onClose();
      reset();
      addToast({
        description: "Topic addded successfully",
        color: "success",
      });
    },
    onError(error) {
      onClose();
      reset();
      const parsedError = apiErrorParser(error);
      addToast({
        title: "An Error Occured",
        description: parsedError.message,
        color: "danger",
      });
    },
  });

  const onSubmit = (data: AddTopicSchema) => {
    const payload = {
      ...data,
      subject_id: topic_id,
      estimated_time_minutes: Number(data.estimated_time_minutes),
    };
    addTopicMutation.mutate(payload);
  };

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalBody className="py-8">
          <div className="flex flex-col justify-center px-4 space-y-4">
            <div className="space-y-1">
              <h3 className="text-kidemia-primary text-2xl font-semibold text-center">
                Add a Topic
              </h3>
              <p className="text-kidemia-grey text-md text-center ">
                Fill the form to add a topic
              </p>
            </div>

            <Form className="py-4 space-y-2" onSubmit={handleSubmit(onSubmit)}>
              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  placeholder="Topic Name"
                  {...register("name")}
                  errorMessage={errors?.name?.message}
                  isInvalid={!!errors?.name?.message}
                  isDisabled={addTopicMutation.isPending}
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
                  placeholder="Code"
                  {...register("code")}
                  errorMessage={errors?.code?.message}
                  isInvalid={!!errors?.code?.message}
                  isDisabled={addTopicMutation.isPending}
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
                  placeholder="Estimated Time(mins)"
                  {...register("estimated_time_minutes")}
                  errorMessage={errors?.estimated_time_minutes?.message}
                  isInvalid={!!errors?.estimated_time_minutes?.message}
                  isDisabled={addTopicMutation.isPending}
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
                  placeholder="Video Url"
                  {...register("video_url")}
                  errorMessage={errors?.video_url?.message}
                  isInvalid={!!errors?.video_url?.message}
                  isDisabled={addTopicMutation.isPending}
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
                  placeholder="Document Url"
                  {...register("document_url")}
                  errorMessage={errors?.document_url?.message}
                  isInvalid={!!errors?.document_url?.message}
                  isDisabled={addTopicMutation.isPending}
                />
              </div>

              <div className="pb-2 w-full">
                <RadioGroup
                  label="Active Status"
                  orientation="horizontal"
                  color="warning"
                  // value={String(watch("is_active"))}
                  value={watch("is_active") ? "true" : "false"}
                  onValueChange={(val) => setValue("is_active", val === "true")}
                  isDisabled={addTopicMutation.isPending}
                  isInvalid={!!errors?.is_active?.message}
                  errorMessage={errors?.is_active?.message}
                >
                  <Radio value="true">Active</Radio>
                  <Radio value="false">Inactive</Radio>
                </RadioGroup>
              </div>

              <div className="pb-2 w-full">
                <RadioGroup
                  label="Dificulty Level"
                  orientation="horizontal"
                  color="warning"
                  value={watch("difficulty_level") || "easy"}
                  onValueChange={(val) =>
                    setValue(
                      "difficulty_level",
                      val as "easy" | "medium" | "hard" | "expert",
                    )
                  }
                  isDisabled={addTopicMutation.isPending}
                  isInvalid={!!errors?.difficulty_level?.message}
                  errorMessage={errors?.difficulty_level?.message}
                >
                  <Radio value="easy">Easy</Radio>
                  <Radio value="medium">Medium</Radio>
                  <Radio value="hard">Hard</Radio>
                  <Radio value="expert">Expert</Radio>
                </RadioGroup>
              </div>

              <div className="pb-2 w-full">
                <Textarea
                  {...register("description")}
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <MdOutlineMessage className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  label="Description"
                  labelPlacement="inside"
                  isDisabled={addTopicMutation.isPending}
                  isInvalid={!!errors?.description?.message}
                  errorMessage={errors?.description?.message}
                />
              </div>

              <div className="pb-2 w-full">
                <Textarea
                  {...register("content")}
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <MdOutlineMessage className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  label="Content"
                  labelPlacement="inside"
                  isDisabled={addTopicMutation.isPending}
                  isInvalid={!!errors?.content?.message}
                  errorMessage={errors?.content?.message}
                />
              </div>

              <div className="py-4 w-full">
                <Button
                  className="bg-kidemia-secondary text-kidemia-white font-medium"
                  size="md"
                  radius="sm"
                  type="submit"
                  fullWidth
                  isLoading={addTopicMutation.isPending}
                  isDisabled={addTopicMutation.isPending}
                >
                  Add Topic
                </Button>
              </div>
            </Form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
