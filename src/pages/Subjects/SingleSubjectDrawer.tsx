import {
  Card,
  CardBody,
  Chip,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Spinner,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../utils/queryKeys";
import { ApiSDK } from "../../sdk";
import { getDifficultyColor, toTitleCase } from "../../utils";

interface DrawerI {
  isOpen: boolean;
  onOpenChange: () => void;
  id: string | null;
}

export default function SingleSubjectDrawer({
  isOpen,
  onOpenChange,
  id,
}: DrawerI) {
  const { data: questionDetail, isLoading } = useQuery({
    queryKey: [QueryKeys.questionDetails, id],
    queryFn: () =>
      ApiSDK.TopicQuestionsService.getQuestionApiV1QuestionsQuestionIdGet(
        id as string,
      ),
    enabled: !!id,
  });

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        backdrop="blur"
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1 text-xl font-bold">
            Question Details
          </DrawerHeader>
          <DrawerBody className="space-y-6">
            {isLoading ? (
              <div className="h-screen flex items-center justify-center">
                <Spinner size="lg" color="warning" />
              </div>
            ) : (
              questionDetail && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {questionDetail.question_text}
                    </h3>

                    <p className="text-sm text-kidemia-grey">
                      <span className="font-medium">Explanation:</span>{" "}
                      {questionDetail.explanation || "No explanation provided."}
                    </p>

                    <div className="flex justify-between items-center flex-wrap gap-2 pt-2">
                      <div className="space-y-2">
                        <p className="text-sm text-kidemia-black font-medium">
                          Difficulty Level
                        </p>

                        <Chip
                          color={getDifficultyColor(
                            questionDetail?.difficulty_level as string,
                          )}
                          variant="flat"
                          className="text-xs px-3 capitalize font-bold"
                          size="sm"
                        >
                          {questionDetail.difficulty_level}
                        </Chip>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-kidemia-black font-medium">
                          Question Type
                        </p>
                        <Chip
                          color="success"
                          size="sm"
                          variant="flat"
                          className="text-xs px-3 capitalize font-bold"
                        >
                          {toTitleCase(questionDetail.question_type)}
                        </Chip>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-kidemia-black font-medium">
                          Status
                        </p>
                        <Chip
                          color="primary"
                          size="sm"
                          variant="flat"
                          className="text-xs px-3 capitalize font-bold"
                        >
                          {questionDetail.status}
                        </Chip>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-kidemia-black font-medium">
                          Points
                        </p>
                        <Chip
                          color="secondary"
                          size="sm"
                          variant="flat"
                          className="text-xs px-3 capitalize font-bold"
                        >
                          {questionDetail.points}
                        </Chip>
                      </div>
                    </div>

                    {(questionDetail.image_url ||
                      questionDetail.video_url ||
                      questionDetail.audio_url) && (
                      <div className="space-y-3">
                        {questionDetail.image_url && (
                          <img
                            src={questionDetail.image_url}
                            alt="Question visual"
                            className="w-full h-64 object-cover rounded-lg border"
                          />
                        )}
                        {questionDetail.video_url && (
                          <video
                            controls
                            className="w-full rounded-lg border"
                            src={questionDetail.video_url}
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {questionDetail.audio_url && (
                          <audio
                            controls
                            className="w-full rounded-lg"
                            src={questionDetail.audio_url}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        )}
                      </div>
                    )}
                  </div>

                  <Divider />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 text-md">
                      Options
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {questionDetail.options?.map((opt) => (
                        <Card
                          key={opt.id}
                          className={`border ${
                            opt.is_correct
                              ? "border-green-500"
                              : "border-gray-200"
                          }`}
                        >
                          <CardBody>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-800">
                                {opt.option_text}
                              </span>
                              {opt.is_correct && (
                                <Chip color="success" size="sm" variant="flat">
                                  Correct
                                </Chip>
                              )}
                            </div>
                            {opt.explanation && (
                              <p className="text-xs text-gray-600 mt-1">
                                {opt.explanation}
                              </p>
                            )}
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Divider />

                  <div className="space-y-1 text-sm text-kidemia-grey">
                    <p>
                      <span className="font-medium">Time Limit:</span>{" "}
                      {questionDetail.time_limit_seconds}s
                    </p>
                    <p>
                      <span className="font-medium">Success Rate:</span>{" "}
                      {questionDetail.success_rate}%
                    </p>
                    <p>
                      <span className="font-medium">Times Used:</span>{" "}
                      {questionDetail.times_used}
                    </p>
                    <p>
                      <span className="font-medium">Created At:</span>{" "}
                      {new Date(questionDetail.created_at).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Updated At:</span>{" "}
                      {new Date(questionDetail.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
