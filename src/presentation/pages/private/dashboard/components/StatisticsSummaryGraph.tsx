import { cn } from "@/core/adapters";
import { useGetReservationStadisticsQuery } from "@/infraestructure/store/services";
import {
  DefaultFallBackComponent,
  ErrorBoundary,
  OverlayPanel,
  Skeleton,
  Bar
} from "@/presentation/components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { useWindowSize } from "@/presentation/hooks";
import { useEffect, useRef, useState } from "react";

export const StatisticsSummaryGraph = () => {
  const op = useRef<any>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { currentData, isLoading, isError, refetch, isFetching } =
    useGetReservationStadisticsQuery({
      year: currentYear,
    });

  const pricesPerMonth = currentData?.data?.pricesPerMonth;
  const years = currentData?.data?.years;

  const [chartData, setChartData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  useEffect(() => {
    if (!currentData) return;
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const data = {
      labels: pricesPerMonth?.map((item) => item.month) || [],
      datasets: [
        {
          type: "bar" as const,
          label: "Ingresos",
          backgroundColor: documentStyle.getPropertyValue("--tertiary-color"),
          data: pricesPerMonth?.map((item) => item.income) || [],
          borderColor: "white",
          borderWidth: 2,
        },
        {
          type: "bar",
          label: "Margen",
          backgroundColor: documentStyle.getPropertyValue("--primary-color"),
          data: pricesPerMonth?.map((item) => item.margin) || [],
          options: {
            indexAxis: "y" as const,
          },
        },
        {
          type: "bar",
          label: "Viajes",
          backgroundColor: documentStyle.getPropertyValue("black"),
          data: pricesPerMonth?.map((item) => item.trips) || [],
          options: {
            indexAxis: "y",
          },
        },
      ],
    };

    const options = {
      responsive: true,
      

      plugins: {
        legend: {
          position: "bottom" as const,
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
      maintainAspectRatio: false,
    };

    setChartData(data as ChartData<"bar">);
    setChartOptions(options);
  }, [currentData]);

  return (
    <ErrorBoundary
      loadingComponent={<GradientSkeleton />}
      isLoader={isFetching || isLoading}
      fallBackComponent={
        <div className="flex items-center justify-center h-72">
          <DefaultFallBackComponent
            refetch={refetch}
            isFetching={isFetching}
            isLoading={isLoading}
            message="No se pudieron cargar las estadisticas"
          />
        </div>
      }
      error={isError}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm md:text-lg font-semibold text-tertiary max-w-28">
          Resumen de estadistica
        </h3>

        <div
          className="flex items-center gap-x-1 cursor-pointer"
          onClick={(e) => op?.current?.toggle(e)}
        >
          <span className="text-slate-500">{currentYear}</span>
          <i className="pi pi-chevron-down text-slate-500"></i>
        </div>
        <OverlayPanel className="!z-10" ref={op}>
          {years?.map((year) => (
            <div
              key={year}
              onClick={() => setCurrentYear(year)}
              className={cn(
                "cursor-pointer p-2 hover:bg-gray-100 rounded-sm",
                year === currentYear && "bg-gray-100"
              )}
            >
              {year}
            </div>
          ))}
        </OverlayPanel>
      </div>
      <div className="flex items-center mt-4 w-full max-w-screen-lg mx-auto h-48 md:h-72 lg:h-96 max-h-96">
        <Bar
          className="w-full h-full"
          style={{ maxHeight: "100%" }}
          data={chartData}
          options={chartOptions}
        />
      </div>
    </ErrorBoundary>
  );
};

function GradientSkeleton() {
  const { width, DESKTOP } = useWindowSize();
  return (
    <div className="w-full max-w-6xl  mx-auto p-6 shadow-sm">
      <div className="space-y-6">
        {/* Title Skeleton */}
        <Skeleton width="16rem" height="2rem" className="mb-4" />

        {/* Response Skeleton for Smaller Screens */}
        <div className="block md:hidden">
          <Skeleton width="100%" height="8rem" className="mb-4" />
        </div>

        {/* Chart container */}
        <div className="md:h-72 lg:h-[340px] w-full relative pt-4 hidden md:block">
          {/* Y-axis values */}
          <div className="absolute left-0 top-4 bottom-10 flex flex-col justify-between">
            {[12000, 10000, 8000, 6000, 4000, 2000, 0].map((value, i) => (
              <div key={`y-${i}`} className="flex items-center h-6">
                <span className="text-gray-300 text-sm w-12 text-right">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Grid lines */}
          <div className="absolute left-16 right-0 top-4 bottom-10 flex flex-col justify-between pointer-events-none">
            {[...Array(7)].map((_, i) => (
              <div
                key={`grid-${i}`}
                className="border-t border-gray-100 w-full"
              />
            ))}
          </div>

          {/* Bars Skeleton */}
          <div className="absolute left-16 right-0 top-4 bottom-10">
            <div className="h-full flex items-end justify-between px-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={`bar-${i}`}
                  className="flex flex-col items-center justify-end h-full"
                >
                  <Skeleton
                    width={width > DESKTOP ? "2rem" : "1.5rem"}
                    height={`${randomPercentage()}%`}
                    className="rounded-t"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const randomPercentage = () => Math.floor(Math.random() * 100);
