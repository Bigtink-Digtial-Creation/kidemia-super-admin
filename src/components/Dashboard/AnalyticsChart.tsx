import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface SeriesData {
  name: string;
  data: number[];
}

interface Props {
  categories: string[];
  dataSeries: SeriesData[];
}

export default function AnalyticsChart({ categories, dataSeries }: Props) {
  // Memoize data to avoid recalculations on every render

  const rawData = useMemo(
    () => dataSeries.flatMap((item) => item.data),
    [dataSeries],
  );

  const computedYMin = useMemo(
    () => (rawData.length ? Math.floor(Math.min(...rawData)) : 0),
    [rawData],
  );

  const computedYMax = useMemo(
    () => (rawData.length ? Math.ceil(Math.max(...rawData)) + 1 : 1),
    [rawData],
  );

  const options: ApexOptions = useMemo(
    () => ({
      colors: ["#16732D", "#F28729", "#BF4C20", "#2A3740"],
      chart: {
        height: 350,
        type: "bar",
        foreColor: "#2A3740",
        background: "transparent",
        toolbar: {
          show: true,
          tools: {
            download: true,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: "#2A3740",
          },
        },
      },
      yaxis: {
        tickAmount: Math.max(2, Math.min(10, computedYMax - computedYMin)),
        min: computedYMin,
        max: computedYMax,
        labels: {
          formatter: (value: number) => Math.round(value).toString(),
          style: {
            colors: "#2A3740",
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}%`,
        },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        offsetY: 20,
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    }),
    [categories, computedYMax, computedYMin],
  );

  // fallback for when data is not available
  if (!dataSeries.length || rawData.length === 0) {
    return (
      <div className="p-5 border border-kidemia-grey/15 rounded-2xl bg-kidemia-white ">
        <div className="pb-3 flex justify-between">
          <h1 className="text-lg font-semibold text-foreground">
            Performance Analytics
          </h1>
        </div>
        <div className="p-5 text-center text-gray-500">No data available.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center-">
      {/* exams chart */}
      <div className="p-5 border border-kidemia-grey/15 rounded-2xl bg-kidemia-white">
        <div className="pb-3 flex justify-between">
          <h1 className="text-lg  font-semibold text-foreground">
            Number of Exams taken
          </h1>
        </div>
        <div className="overflow-hidden">
          <ReactApexChart
            options={options}
            series={dataSeries}
            type="bar"
            height={300}
          />
        </div>
      </div>

      {/* test chart */}
      <div className="p-5 border border-kidemia-grey/15 rounded-2xl bg-kidemia-white">
        <div className="pb-3 flex justify-between">
          <h1 className="text-lg  font-semibold text-foreground">
            Number of Tests taken
          </h1>
        </div>
        <div className="overflow-hidden">
          <ReactApexChart
            options={options}
            series={dataSeries}
            type="bar"
            height={300}
          />
        </div>
      </div>
    </div>
  );
}
