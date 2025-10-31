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
  Spinner,
  Textarea,
} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { MdOutlineMessage, MdSubject } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateTopicSchema } from "../../schema/subject.schema";
import { useEffect } from "react";
import type { TopicUpdate } from "../../sdk/generated";
import { apiErrorParser } from "../../utils/errorParser";

interface UpdateTopicModalI {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  topic_id: string;
  name: string;
}
export default function UpdateTopicModal({
  isOpen,
  onClose,
  onOpenChange,
  topic_id,
  name,
}: UpdateTopicModalI) {
  const queryClient = useQueryClient();
  const { data: singleTopic, isLoading } = useQuery({
    queryKey: [QueryKeys.topicById, topic_id],
    queryFn: () =>
      ApiSDK.SubjectTopicsService.getTopicApiV1TopicsTopicIdGet(topic_id),
    enabled: !!topic_id,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UpdateTopicSchema),
    defaultValues: {
      name: "",
      code: "",
      estimated_time_minutes: 0,
      video_url: "",
      document_url: "",
      is_active: true,
      difficulty_level: "easy",
      description: "",
      content: "",
    },
  });

  useEffect(() => {
    if (singleTopic) {
      reset({
        name: singleTopic.name,
        code: singleTopic.code,
        estimated_time_minutes: singleTopic.estimated_time_minutes ?? 0,
        video_url: singleTopic.video_url ?? "",
        document_url: singleTopic.document_url ?? "",
        is_active: singleTopic.is_active ?? false,
        difficulty_level:
          (singleTopic.difficulty_level as
            | "easy"
            | "medium"
            | "hard"
            | "expert") || "easy",
        description: singleTopic.description ?? "",
        content: singleTopic.content ?? "",
      });
    }
  }, [singleTopic, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: TopicUpdate) =>
      ApiSDK.SubjectTopicsService.updateTopicApiV1TopicsTopicIdPut(
        topic_id,
        data,
      ),
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.subjectTopics] });
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

  const onSubmit = (data: TopicUpdate) => {
    updateMutation.mutate(data);
  };

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalBody className="py-8">
          <div className="flex flex-col justify-center px-4 space-y-4">
            <div className="space-y-1">
              <h3 className="text-kidemia-primary text-2xl font-semibold text-center capitalize">
                Update {name} Details
              </h3>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Spinner size="lg" color="warning" />
              </div>
            ) : (
              <Form
                onSubmit={handleSubmit(onSubmit)}
                className="py-4 space-y-2"
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
                    label="Topic Name"
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
                    label="Code"
                    labelPlacement="inside"
                    {...register("code")}
                    errorMessage={errors?.code?.message}
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
                    type="number"
                    label="Estimated Time(mins)"
                    labelPlacement="inside"
                    {...register("estimated_time_minutes")}
                    errorMessage={errors?.estimated_time_minutes?.message}
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
                    label="Video Url"
                    labelPlacement="inside"
                    {...register("video_url")}
                    errorMessage={errors?.video_url?.message}
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
                    label="Document Url"
                    labelPlacement="inside"
                    {...register("document_url")}
                    errorMessage={errors?.document_url?.message}
                    isDisabled={updateMutation.isPending}
                  />
                </div>

                <div className="pb-2 w-full">
                  <RadioGroup
                    label="Active Status"
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
                    isDisabled={updateMutation.isPending}
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
                    isDisabled={updateMutation.isPending}
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
                    isDisabled={updateMutation.isPending}
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
                    Update Topic
                  </Button>
                </div>
              </Form>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
