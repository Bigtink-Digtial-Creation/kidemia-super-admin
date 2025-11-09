import {
  BreadcrumbItem,
  Breadcrumbs,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdAssessment, MdOutlineDashboard } from "react-icons/md";
import { FiSearch } from "react-icons/fi";

const dum = [
  { key: "yoo", label: "yooo" },
  { key: "koo", label: "ykoo" },
  { key: "soo", label: "sooo" },
];

export default function CreateAssessment() {
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
              href={SidebarRoutes.assessment}
              startContent={<MdAssessment />}
            >
              Assessment
            </BreadcrumbItem>

            <BreadcrumbItem startContent={<MdAssessment />} color="warning">
              Create Assessment
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className="space-y-3">
          {/* wrap form component from here */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-3 p-4  border border-kidemia-grey/30 rounded-xl space-y-3">
              <h3 className="text-xl font-semibold text-kidemia-black">
                Assessment Details
              </h3>
              <div className="space-y-3 py-2">
                <div className="pb-2 w-full flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
                  <Input
                    variant="flat"
                    size="lg"
                    radius="sm"
                    label="Title"
                    labelPlacement="outside"
                    type="text"
                    placeholder="Assessment Title"
                  />
                  <Input
                    variant="flat"
                    size="lg"
                    radius="sm"
                    label="Code"
                    labelPlacement="outside"
                    type="text"
                    placeholder="Assessment Code"
                  />
                </div>

                <div className="pb-2 w-full">
                  <Textarea
                    variant="flat"
                    size="lg"
                    radius="sm"
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Assessment Description"
                  />
                </div>

                <div className="flex flex-col md:flex-row justify-between  gap-4 md:gap-6">
                  <div className="pb-2 w-full">
                    <Textarea
                      variant="flat"
                      size="lg"
                      radius="sm"
                      label="Intructions"
                      labelPlacement="outside"
                      placeholder="Assessment Intructions"
                    />
                  </div>

                  <div className="pb-2 w-full">
                    <div className="pb-2 w-full">
                      <Select
                        variant="flat"
                        size="lg"
                        radius="sm"
                        label="Category"
                        labelPlacement="outside"
                        placeholder="Category"
                      >
                        {dum.map((d) => (
                          <SelectItem key={d.key}>{d.label}</SelectItem>
                        ))}
                      </Select>
                    </div>

                    <div className="pb-2 w-full">
                      <Input
                        variant="flat"
                        size="lg"
                        radius="sm"
                        label="Exam Year"
                        labelPlacement="outside"
                        type="text"
                        placeholder="Exam Year"
                      />
                    </div>

                    <div className="pb-2 w-full">
                      <Select
                        variant="flat"
                        size="lg"
                        radius="sm"
                        label="Exam Session"
                        labelPlacement="outside"
                        placeholder="Exam Session"
                      >
                        {dum.map((d) => (
                          <SelectItem key={d.key}>{d.label}</SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
                <Divider className="my-3" />
                <div className="py-2">
                  <div className="flex justify-between items-center">
                    <RadioGroup
                      label="Select Questions"
                      orientation="horizontal"
                      classNames={{
                        wrapper: "space-x-4",
                        label: "text-base font-semibold text-kidemia-black",
                      }}
                    >
                      <Radio
                        value="by-subject"
                        className="text-kidemia-grey font-medium"
                        color="warning"
                      >
                        By Subject
                      </Radio>

                      <Radio
                        value="by-topic"
                        className="text-kidemia-grey font-medium"
                        color="warning"
                      >
                        By Topic
                      </Radio>
                      <Radio
                        value="manual"
                        className="text-kidemia-grey font-medium"
                        color="warning"
                      >
                        Manual Selection
                      </Radio>
                    </RadioGroup>

                    <div>
                      <Input
                        variant="flat"
                        size="lg"
                        radius="sm"
                        type="text"
                        placeholder="Search"
                        startContent={
                          <FiSearch className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="py-6">Table here </div>
              </div>
            </div>
            <div>jeje</div>
          </div>
        </div>
      </section>
    </>
  );
}
