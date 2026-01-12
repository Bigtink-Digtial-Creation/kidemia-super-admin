import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface SeriesData {
  name: string;
  data: number[];
}

interface Props {
  examsCategories: string[];
  examsSeries: SeriesData[];
  testsCategories: string[];
  testsSeries: SeriesData[];
}

export default function AnalyticsChart({
  examsCategories,
  examsSeries,
  testsCategories,
  testsSeries
}: Props) {

  // Helper to generate chart options dynamically based on categories
  const getOptions = (categories: string[]): ApexOptions => ({
    colors: ["#F28729", "#16732D", "#BF4C20", "#2A3740"],
    chart: {
      type: "bar",
      foreColor: "#2A3740",
      toolbar: { show: true, tools: { download: true, zoom: true } },
    },
    plotOptions: {
      bar: { borderRadius: 2, columnWidth: '85%' }
    },
    dataLabels: { enabled: false },
    xaxis: { categories },
    tooltip: {
      y: { formatter: (val: number) => `${val}` },
    },
  });

  const examsOptions = useMemo(() => getOptions(examsCategories), [examsCategories]);
  const testsOptions = useMemo(() => getOptions(testsCategories), [testsCategories]);

  const hasData = examsSeries.length > 0 || testsSeries.length > 0;

  if (!hasData) {
    return (
      <div className="p-10 border border-dashed rounded-2xl text-center text-gray-500">
        No performance data available for this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Exams Chart */}
      <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Exams Taken</h3>
        <div className="overflow-hidden">
          <ReactApexChart
            options={examsOptions}
            series={examsSeries}
            type="bar"
            height={320}
          />
        </div>
      </div>

      {/* Tests Chart */}
      <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Tests Taken</h3>
        <div className="overflow-hidden">
          <ReactApexChart
            options={testsOptions}
            series={testsSeries}
            type="bar"
            height={320}
          />
        </div>
      </div>
    </div>
  );
}