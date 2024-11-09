import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
export const StatisticsSummaryGraph = () => {
  return (
    <>
      <h3 className="text-sm md:text-md font-semibold text-tertiary max-w-28">
        Resumen de estadistica
      </h3>
      <div className="flex items-center mt-4 w-full">
        <Graph />
      </div>
    </>
  );
};

export default function Graph() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          type: "bar",
          label: "Costos",
          backgroundColor: documentStyle.getPropertyValue("--tertiary-color"),
          data: [21, 84, 24, 75, 37, 65, 34],
          borderColor: "white",
          borderWidth: 2,
        },
        {
          type: "bar",
          label: "Margen",
          backgroundColor: documentStyle.getPropertyValue("--primary-color"),
          data: [41, 52, 24, 74, 23, 21, 32],
          options: {
            indexAxis: "y",
          },
        },
        {
          type: "bar",
          label: "Viajes",
          backgroundColor: documentStyle.getPropertyValue("black"),
          data: [41, 52, 24, 74, 23, 21, 32],
          options: {
            indexAxis: "y",
          },
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <>
      <Chart
        className="w-full max-w-screen-lg mx-auto h-48 md:h-72 lg:h-96 max-h-96"
        type="line"
        data={chartData}
        options={chartOptions}
      />
    </>
  );
}
