import {
  addToast,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Textarea,
} from "@heroui/react";
import { useParams } from "react-router";
import { SidebarRoutes } from "../../routes";
import { MdAssessment, MdOutlineDashboard } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import StatCard from "../../components/Dashboard/StatCard";
import { BsFillQuestionSquareFill, BsHandThumbsDownFill } from "react-icons/bs";
import { LiaFilePowerpointSolid } from "react-icons/lia";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { SiSpeedtest } from "react-icons/si";
import {
  HiMiniArrowTrendingDown,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import { apiErrorParser } from "../../utils/errorParser";

export default function SingleAssessment() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  console.log({ id });

  const { data: singleAssessment, isLoading } = useQuery({
    queryKey: [QueryKeys.singleAssement, id],
    queryFn: () =>
      ApiSDK.AssessmentsService.getAssessmentApiV1AssessmentsAssessmentIdGet(
        id!,
        false,
      ),
    enabled: !!id,
  });

  const publishMutation = useMutation({
    mutationFn: (assessment_id: string) =>
      ApiSDK.AssessmentsService.publishAssessmentApiV1AssessmentsAssessmentIdPublishPost(
        assessment_id,
      ),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.singleAssement] });
      addToast({
        title: "Assessment Published Successfully",
        color: "success",
      });
    },
    onError(error) {
      const parsedError = apiErrorParser(error);
      addToast({
        title: "An Error Occured",
        description: parsedError.message,
        color: "danger",
      });
    },
  });
  console.log({ singleAssessment });

  if (isLoading && !singleAssessment) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <>
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <Breadcrumbs variant="light" color="foreground">
            <BreadcrumbItem
              href={SidebarRoutes.dashboard}
              startContent={<MdOutlineDashboard />}
            >
              Dashboard
            </BreadcrumbItem>
            <BreadcrumbItem
              href={SidebarRoutes.assessment}
              startContent={<MdAssessment />}
            >
              Assessment
            </BreadcrumbItem>
            <BreadcrumbItem startContent={<MdAssessment />} color="warning">
              Assessment Detail
            </BreadcrumbItem>
          </Breadcrumbs>

          {singleAssessment?.status !== "published" ? (
            <div>
              <Button
                type="submit"
                variant="solid"
                size="md"
                className="bg-kidemia-secondary text-kidemia-white font-semibold w-full-"
                radius="sm"
                onPress={() =>
                  publishMutation.mutate(singleAssessment?.id as string)
                }
                isLoading={publishMutation.isPending}
                isDisabled={publishMutation.isPending}
              >
                Publish Assessment
              </Button>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-5 lg:gap-4">
            <StatCard
              icon={BsFillQuestionSquareFill}
              title="Total Questions"
              figure={singleAssessment?.total_questions || "00"}
            />
            <StatCard
              icon={LiaFilePowerpointSolid}
              title="Total Points"
              figure={singleAssessment?.total_points || "00"}
            />
            <StatCard
              icon={BsHandThumbsDownFill}
              title="Total Fails"
              figure={singleAssessment?.total_fails || "00"}
            />
            <StatCard
              icon={FaCheck}
              title="Total Passes"
              figure={singleAssessment?.total_passes || "00"}
            />
            <StatCard
              icon={FaCheckDouble}
              title="Total Completions"
              figure={singleAssessment?.total_completions || "00"}
            />
            <StatCard
              icon={SiSpeedtest}
              title="Total Attempts"
              figure={singleAssessment?.total_attempts || "00"}
            />

            <StatCard
              icon={HiOutlineArrowTrendingUp}
              title="Highest Score"
              figure={singleAssessment?.highest_score || "00"}
            />
            <StatCard
              icon={HiMiniArrowTrendingDown}
              title="Lowest Score"
              figure={singleAssessment?.lowest_score || "00"}
            />
          </div>

          <div className="py-2 px-3">
            {/* form wrapper here */}

            <div className="flex justify-between items-center gap-2 md:gap-4 flex-col md:flex-row pb-2">
              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Title"
                  labelPlacement="outside"
                  type="text"
                />
              </div>

              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Code"
                  labelPlacement="outside"
                  type="text"
                />
              </div>
            </div>

            <div className="pb-2 w-full">
              <Textarea
                variant="flat"
                size="lg"
                radius="sm"
                label="Description"
                labelPlacement="outside"
              />
            </div>

            <div className="pb-2 w-full">
              <Textarea
                variant="flat"
                size="lg"
                radius="sm"
                label="Intructions"
                labelPlacement="outside"
              />
            </div>

            <div className="flex justify-between items-center gap-2 md:gap-4 flex-col md:flex-row pb-2">
              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Exam Session"
                  labelPlacement="outside"
                  type="text"
                />
              </div>

              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Exam Year"
                  labelPlacement="outside"
                  type="text"
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 md:gap-4 flex-col md:flex-row pb-2">
              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Currency"
                  labelPlacement="outside"
                  type="text"
                />
              </div>

              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Price"
                  labelPlacement="outside"
                  type="text"
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 md:gap-4 flex-col md:flex-row pb-2">
              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Avialable From"
                  labelPlacement="outside"
                  type="text"
                />
              </div>

              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Available Until"
                  labelPlacement="outside"
                  type="text"
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 md:gap-4 flex-col md:flex-row pb-2">
              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Category"
                  labelPlacement="outside"
                  type="text"
                />
              </div>

              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Assessment Type"
                  labelPlacement="outside"
                  type="text"
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 md:gap-4 flex-col md:flex-row pb-2">
              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Discount Price"
                  labelPlacement="outside"
                  type="text"
                />
              </div>

              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Passing Percentage"
                  labelPlacement="outside"
                  type="text"
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 md:gap-4 flex-col md:flex-row pb-2">
              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Max Attempt"
                  labelPlacement="outside"
                  type="text"
                />
              </div>

              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Max Tab Switches"
                  labelPlacement="outside"
                  type="text"
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 md:gap-4 flex-col md:flex-row pb-2">
              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Result Display Mode"
                  labelPlacement="outside"
                  type="text"
                />
              </div>

              <div className="pb-1 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  label="Question Selection Mode"
                  labelPlacement="outside"
                  type="text"
                />
              </div>
            </div>

            <div className="pb-2 w-full">
              <Input
                variant="flat"
                size="lg"
                radius="sm"
                label="Time (mins)"
                labelPlacement="outside"
                type="text"
              />
            </div>
            <div className="space-y-2 py-3 grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="py-1">
                <RadioGroup
                  label="Allow Backward Navigation"
                  orientation="horizontal"
                  classNames={{
                    wrapper: "space-x-4",
                    label: "text-base font-medium text-kidemia-black",
                  }}
                >
                  <Radio
                    value="by-subject"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    True
                  </Radio>

                  <Radio
                    value="by-topic"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    False
                  </Radio>
                </RadioGroup>
              </div>

              <div className="py-1">
                <RadioGroup
                  label="Allow Question Navigation"
                  orientation="horizontal"
                  classNames={{
                    wrapper: "space-x-4",
                    label: "text-base font-medium text-kidemia-black",
                  }}
                >
                  <Radio
                    value="by-subject"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    True
                  </Radio>

                  <Radio
                    value="by-topic"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    False
                  </Radio>
                </RadioGroup>
              </div>

              <div className="py-1">
                <RadioGroup
                  label="Detect Tab Switching"
                  orientation="horizontal"
                  classNames={{
                    wrapper: "space-x-4",
                    label: "text-base font-medium text-kidemia-black",
                  }}
                >
                  <Radio
                    value="by-subject"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    True
                  </Radio>

                  <Radio
                    value="by-topic"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    False
                  </Radio>
                </RadioGroup>
              </div>

              <div className="py-1">
                <RadioGroup
                  label="Full Screen Required"
                  orientation="horizontal"
                  classNames={{
                    wrapper: "space-x-4",
                    label: "text-base font-medium text-kidemia-black",
                  }}
                >
                  <Radio
                    value="by-subject"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    True
                  </Radio>

                  <Radio
                    value="by-topic"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    False
                  </Radio>
                </RadioGroup>
              </div>

              <div className="py-1">
                <RadioGroup
                  label="Is Public"
                  orientation="horizontal"
                  classNames={{
                    wrapper: "space-x-4",
                    label: "text-base font-medium text-kidemia-black",
                  }}
                >
                  <Radio
                    value="by-subject"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    True
                  </Radio>

                  <Radio
                    value="by-topic"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    False
                  </Radio>
                </RadioGroup>
              </div>
              <div className="py-1">
                <RadioGroup
                  label="Protoring Enabled"
                  orientation="horizontal"
                  classNames={{
                    wrapper: "space-x-4",
                    label: "text-base font-medium text-kidemia-black",
                  }}
                >
                  <Radio
                    value="by-subject"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    True
                  </Radio>

                  <Radio
                    value="by-topic"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    False
                  </Radio>
                </RadioGroup>
              </div>

              <div className="py-1">
                <RadioGroup
                  label="Require Enrollment"
                  orientation="horizontal"
                  classNames={{
                    wrapper: "space-x-4",
                    label: "text-base font-medium text-kidemia-black",
                  }}
                >
                  <Radio
                    value="by-subject"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    True
                  </Radio>

                  <Radio
                    value="by-topic"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    False
                  </Radio>
                </RadioGroup>
              </div>

              <div className="py-1">
                <RadioGroup
                  label="Require Webcam"
                  orientation="horizontal"
                  classNames={{
                    wrapper: "space-x-4",
                    label: "text-base font-medium text-kidemia-black",
                  }}
                >
                  <Radio
                    value="by-subject"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    True
                  </Radio>

                  <Radio
                    value="by-topic"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    False
                  </Radio>
                </RadioGroup>
              </div>

              <div className="py-1">
                <RadioGroup
                  label="Show Correct Answers"
                  orientation="horizontal"
                  classNames={{
                    wrapper: "space-x-4",
                    label: "text-base font-medium text-kidemia-black",
                  }}
                >
                  <Radio
                    value="by-subject"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    True
                  </Radio>

                  <Radio
                    value="by-topic"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    False
                  </Radio>
                </RadioGroup>
              </div>

              <div className="py-1">
                <RadioGroup
                  label="Show Explanation"
                  orientation="horizontal"
                  classNames={{
                    wrapper: "space-x-4",
                    label: "text-base font-medium text-kidemia-black",
                  }}
                >
                  <Radio
                    value="by-subject"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    True
                  </Radio>

                  <Radio
                    value="by-topic"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    False
                  </Radio>
                </RadioGroup>
              </div>

              <div className="py-1">
                <RadioGroup
                  label="Shuffle Question"
                  orientation="horizontal"
                  classNames={{
                    wrapper: "space-x-4",
                    label: "text-base font-medium text-kidemia-black",
                  }}
                >
                  <Radio
                    value="by-subject"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    True
                  </Radio>

                  <Radio
                    value="by-topic"
                    className="text-kidemia-grey font-medium"
                    color="warning"
                  >
                    False
                  </Radio>
                </RadioGroup>
              </div>
            </div>

            <div className="flex justify-end items-center">
              <Button
                type="submit"
                variant="solid"
                size="lg"
                className="bg-kidemia-secondary text-kidemia-white font-semibold w-full-"
                radius="sm"
              >
                Update Assessment
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
