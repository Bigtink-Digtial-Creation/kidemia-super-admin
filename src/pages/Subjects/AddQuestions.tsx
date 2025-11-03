import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useParams } from "react-router";
import { SidebarRoutes } from "../../routes";
import {
  MdOutlineDashboard,
  MdOutlineMessage,
  MdOutlineTopic,
} from "react-icons/md";
import { subjectQuestonTitleAtom } from "../../store/subject.atom";
import { useAtomValue } from "jotai";
import { FaClipboardQuestion } from "react-icons/fa6";
import { LuAudioWaveform, LuClipboardType } from "react-icons/lu";
import { FaRegFilePowerpoint, FaRegQuestionCircle } from "react-icons/fa";
import { SiLevelsdotfyi } from "react-icons/si";
import { TbTimeDuration90 } from "react-icons/tb";
import { CiImageOn, CiVideoOn } from "react-icons/ci";
import { IoLinkSharp } from "react-icons/io5";
import { useState } from "react";

const roleType = [
  { key: "custom", label: "Custom" },
  { key: "system", label: "System" },
];

const questionType = [
  { key: "multiple_choice", label: "Multiple Choice" },
  { key: "true_false", label: "True/False" },
  { key: "fill_in_blank", label: "Fill in Blank" },
  { key: "eassy", label: "Eassy" },
  { key: "matching", label: "Matching" },
  { key: "ordering", label: "Ordering" },
];

const difficultyLevel = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
  { key: "expert", label: "Expert" },
];

export default function AddQuestions() {
  const { id } = useParams<{ id: string }>();
  const title = useAtomValue(subjectQuestonTitleAtom);
  const [isMedia, setIsMedia] = useState<boolean>(false);

  return (
    <>
      <section className="space-y-8">
        <div>
          <Breadcrumbs variant="light" color="foreground">
            <BreadcrumbItem
              href={SidebarRoutes.dashboard}
              startContent={<MdOutlineDashboard />}
            >
              Dashboard
            </BreadcrumbItem>
            <BreadcrumbItem
              href={SidebarRoutes.subjects}
              startContent={<MdOutlineTopic />}
            >
              Subjects
            </BreadcrumbItem>

            <BreadcrumbItem
              startContent={<MdOutlineTopic />}
              href={`/dashboard/subjects/${id}`}
            >
              All {title} Questions
            </BreadcrumbItem>

            <BreadcrumbItem startContent={<MdOutlineTopic />} color="warning">
              Add {title} Questions
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <div className="space-y-3">
          <p className="text-base text-kidemia-grey">
            Fill the form to add questions
          </p>

          <div className="py-2 space-y-3">
            <div className="py-6 px-8 space-y-4 bg-kidemia-white rounded-2xl shadow-sm">
              {/* form wrapper here */}

              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Type your question here"
                  type="text"
                  startContent={
                    <FaClipboardQuestion className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                />
              </div>

              <div className="pb-2 w-full flex items-center gap-6">
                <Select
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Select Topic"
                  startContent={
                    <LuClipboardType className="text-kidemia-secondary text-xl" />
                  }
                >
                  {roleType.map((role) => (
                    <SelectItem key={role.key}>{role.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Select Question Type"
                  startContent={
                    <FaRegQuestionCircle className="text-kidemia-secondary text-xl" />
                  }
                >
                  {questionType.map((role) => (
                    <SelectItem key={role.key}>{role.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="pb-2 w-full flex items-center gap-6">
                <Select
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Difficulty Level"
                  startContent={
                    <SiLevelsdotfyi className="text-kidemia-secondary text-xl" />
                  }
                >
                  {difficultyLevel.map((role) => (
                    <SelectItem key={role.key}>{role.label}</SelectItem>
                  ))}
                </Select>

                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Question Points"
                  type="text"
                  startContent={
                    <FaRegFilePowerpoint className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                />
              </div>

              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Time Limit(secs)"
                  type="text"
                  startContent={
                    <TbTimeDuration90 className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                />
              </div>

              <div className="pb-2 w-full">
                <Textarea
                  variant="flat"
                  size="lg"
                  radius="sm"
                  placeholder="Question Explanation"
                  startContent={
                    <MdOutlineMessage className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                />
              </div>

              {/* options here  */}

              {isMedia && (
                <div className="flex justify-between items-center space-x-6">
                  <div className="pb-2 w-full">
                    <Input
                      variant="flat"
                      size="lg"
                      radius="sm"
                      placeholder="Audio Url"
                      type="text"
                      startContent={
                        <LuAudioWaveform className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                      }
                    />
                  </div>

                  <div className="pb-2 w-full">
                    <Input
                      variant="flat"
                      size="lg"
                      radius="sm"
                      placeholder="Image Url"
                      type="text"
                      startContent={
                        <CiImageOn className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                      }
                    />
                  </div>

                  <div className="pb-2 w-full">
                    <Input
                      variant="flat"
                      size="lg"
                      radius="sm"
                      placeholder="Video Url"
                      type="text"
                      startContent={
                        <CiVideoOn className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                      }
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <div>
                  <Button
                    onPress={() => setIsMedia(!isMedia)}
                    fullWidth
                    className="bg-kidemia-biege border border-kidemia-black3 font-semibold text-kidemia-primary w-full"
                    startContent={<IoLinkSharp />}
                  >
                    Add Media Links
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end py-4">
              <div className="w-full- flex justify-between items-center gap-4">
                <Button className="bg-kidemia-biege border border-kidemia-black3 font-semibold text-kidemia-primary w-full">
                  Add Another Question
                </Button>

                <Button className="bg-kidemia-secondary text-kidemia-white font-semibold w-full">
                  Upload Question
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
