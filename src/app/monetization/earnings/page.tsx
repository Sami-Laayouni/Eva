"use client";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import Link from "next/link";

const Earnings = () => {
  const [timeRange, setTimeRange] = useState("lastMonth"); // Default to last month
  const getTimeRangeCategories = () => {
    // Define time ranges based on your requirements
    const lastMonth = [
      "01 February",
      "02 February",
      "03 February",
      "04 February",
      "05 February",
      "06 February",
      "07 February",
    ];
    const lastYear = [
      "Feb 2023",
      "Mar 2023",
      "Apr 2023",
      "May 2023",
      "Jun 2023",
      "Jul 2023",
      "Aug 2023",
      "Sep 2023",
      "Oct 2023",
      "Nov 2023",
      "Dec 2023",
      "Jan 2024",
    ];

    // Return categories based on the selected time range
    return timeRange === "lastMonth" ? lastMonth : lastYear;
  };
  const options = {
    chart: {
      height: "100%",
      maxWidth: "100%",
      background: "transparent",
      type: "area",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    theme: {
      mode: "dark",
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "purple",
        gradientToColors: ["purple"],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 6,
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0,
      },
    },

    series: [
      {
        name: "Earnings",
        data: [6500, 6418, 6456, 6526, 6356, 6456],
        color: "purple",
      },
    ],
    xaxis: {
      categories: getTimeRangeCategories(),
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  };

  useEffect(() => {
    if (
      document.getElementById("area-chart") &&
      typeof ApexCharts !== "undefined"
    ) {
      const chart = new ApexCharts(
        document.getElementById("area-chart") as any,
        options
      );
      chart.render();
    }
  }, [timeRange, options]);

  return (
    <>
      <h1 className="text-xl font-bold p-6 backdrop-blur z-10 bg-background/10 sticky top-0">
        Earnings
      </h1>
      <section className="p-6">
        <div className="w-full h-10 bg-primary rounded-xl grid grid-cols-2">
          <Link
            href={"/monetization"}
            className="flex justify-center align-middle text-center "
          >
            <button>Programs</button>
          </Link>
          <Link
            href={"/monetization/earnings"}
            className="flex justify-center align-middle bg-white text-primary rounded-tr-xl rounded-br-xl"
          >
            <button>Earnings</button>
          </Link>
        </div>
        <div className="max-w-sm w-full bg-gray-800 rounded-xl shadow p-4 md:p-6 mt-5">
          <div className="flex justify-between" />
          <div className="inline">
            <h5 className="leading-none text-3xl font-bold text-white pb-2 inline">
              Total Earnings: $900
            </h5>
          </div>
        </div>

        <div
          id="area-chart"
          className=" w-full bg-transparent  rounded-lg shadow p-4 md:p-6"
        >
          <ApexCharts
            options={options as any}
            series={options.series}
            type="area"
            height="100%"
          />
        </div>
        <section>
          <h1>Breakdown</h1>

          <div className="relative overflow-x-auto mt-5 rounded-xl">
            <table className="w-full text-sm text-left rounded-xl  rtl:text-right text-gray-400">
              <thead className="text-xs  uppercase  bg-gray-700 text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Income Source
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className=" bg-gray-800 border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium  whitespace-nowrap text-white"
                  >
                    Decentralized Ads Revenue
                  </th>
                  <td className="px-6 py-4">$0</td>
                  <td className="px-6 py-4">0%</td>
                </tr>
                <tr className="bg-gray-800 border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium  whitespace-nowrap text-white"
                  >
                    Investments
                  </th>
                  <td className="px-6 py-4">$500</td>
                  <td className="px-6 py-4">20%</td>
                </tr>
                <tr className="bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium  whitespace-nowrap text-white"
                  >
                    Diamonds
                  </th>
                  <td className="px-6 py-4">$500</td>
                  <td className="px-6 py-4">20%</td>
                </tr>
                <tr className="bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium  whitespace-nowrap text-white"
                  >
                    Memories Purchased
                  </th>
                  <td className="px-6 py-4">$500</td>
                  <td className="px-6 py-4">20%</td>
                </tr>
                <tr className="bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium  whitespace-nowrap text-white"
                  >
                    Unknown Sources
                  </th>
                  <td className="px-6 py-4">$500</td>
                  <td className="px-6 py-4">20%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </>
  );
};

export default Earnings;
