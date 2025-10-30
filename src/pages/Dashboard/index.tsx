import { Select, SelectItem } from "@heroui/react";
import StatCard from "../../components/Dashboard/StatCard";
import { FiUsers } from "react-icons/fi";
import { PiBooksBold } from "react-icons/pi";
import { MdTopic } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import AnalyticsChart from "../../components/Dashboard/AnalyticsChart";
import { categoriesData, dataSeries } from "../../staticData";

const categories = [
  { key: "ce", label: "Common Entrance" },
  { key: "jw", label: "Junior WAEC" },
  { key: "sw", label: "Senior WAEC" },
];

export default function DashboardPage() {
  return (
    <>
      <div className="space-y-12">
        <div className="flex justify-end items-center">
          <div className="flex  items-center space-x-4 w-xl">
            <div className="flex items-center space-x-4 w-full">
              <p className="text-kidemia-black text-sm font-semibold">
                Category:
              </p>
              <Select
                className="w-full"
                size="sm"
                radius="sm"
                variant="underlined"
                color="warning"
                defaultSelectedKeys={["ce"]}
              >
                {categories.map((cat) => (
                  <SelectItem key={cat.key}>{cat.label}</SelectItem>
                ))}
              </Select>
            </div>


          </div>
        </div>

        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-5 lg:gap-4">
            <StatCard icon={FiUsers} title="No. of Students" figure="1,500" />
            <StatCard
              icon={PiBooksBold}
              title="No. of Subjects"
              figure="1,500"
            />
            <StatCard icon={MdTopic} title="No. of Topics" figure="1,500" />
            <StatCard
              icon={FaQuestionCircle}
              title="No. of Questions"
              figure="1,500"
            />
          </div>

          <div className="py-6">
            <AnalyticsChart
              categories={categoriesData}
              dataSeries={dataSeries}
            />
          </div>
        </div>
      </div>

    </>
  );
}
