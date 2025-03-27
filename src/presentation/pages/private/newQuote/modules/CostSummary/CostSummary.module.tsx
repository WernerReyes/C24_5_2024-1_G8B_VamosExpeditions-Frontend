import type { AppState } from "@/app/store";
import { measureExecutionTime } from "@/core/utils";
import { Accordion, TabView } from "@/presentation/components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataTableCostSummary, HotelsDetailsSummary } from "./components";
import { cn } from "@/core/adapters";

export const CostSummaryModule = () => {
  const { selectedDay: currentDay } = useSelector(
    (state: AppState) => state.quotation
  );
  const { currentTripDetails } = useSelector((state: AppState) => state.tripDetails);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [[firstAccordion, secondAccordion], setAccordion] = useState<
    [boolean, boolean]
  >([false, false]);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setSelectedDay(currentTripDetails?.startDate);
  }, [currentTripDetails]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200 - executionTime);
  }, [executionTime]);

  return (
    <>
      <TabView
        scrollable
        className={cn(
          firstAccordion || secondAccordion ? "h-[34rem]" : ""
        )}
        onBeforeTabChange={(e) => {
          const { executionTime } = measureExecutionTime(() => {
            const nextDay = new Date(currentTripDetails?.startDate ?? new Date());
            nextDay.setDate(nextDay.getDate() + e.index);
            setSelectedDay(nextDay);
          });

          setExecutionTime(executionTime);

          setAccordion([false, true]);
        }}
        loading={loading}
        loadingTemplate={
          <div className="flex items-center justify-center h-[32rem]">
            <i className="pi pi-spin pi-spinner text-primary text-4xl"></i>
          </div>
        }
        tabPanelContent={Array.from({ length: currentDay?.total ?? 0 }).map(
          (_, index) => ({
            header: `Día ${index + 1}`,
            leftIcon: "pi pi-calendar mr-2",
            children: (
              <Accordion
                onTabClose={(e) => {
                  if (e.index === 0) {
                    setAccordion([false, secondAccordion]);
                  } else {
                    setAccordion([firstAccordion, false]);
                  }
                }}
                onTabOpen={(e) => {
                  if (e.index === 0) {
                    setAccordion([true, secondAccordion]);
                  } else {
                    setAccordion([firstAccordion, true]);
                  }
                }}
                multiple
                activeIndex={[1]}
                className="grid grid-cols-1 lg:grid-cols-2 justify-center items-start gap-x-4 w-full"
                tabContent={[
                  {
                    header: "Servicios",
                    className: "overflow-y-auto thin-scrollbar max-h-64 w-full",
                    children: (
                      <p className="text-center bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
                        Ningún alojamiento por ahora
                      </p>
                    ),
                  },
                  {
                    header: "Alojamientos",
                    className: cn(
                      "overflow-y-auto max-lg:mt-5 thin-scrollbar w-full",
                      firstAccordion ? "max-h-52" : "max-h-80"
                    ),
                    children: (
                      <HotelsDetailsSummary selectedDay={selectedDay} />
                    ),
                  },
                ]}
              />
            ),
          })
        )}
      />

      <DataTableCostSummary />
    </>
  );
};
