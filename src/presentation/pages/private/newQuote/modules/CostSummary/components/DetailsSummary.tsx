import type { AppState } from "@/app/store";
import { cn, dateFnsAdapter } from "@/core/adapters";
import { formatCurrency, measureExecutionTime } from "@/core/utils";
import { Accordion, Badge, Button, TabView } from "@/presentation/components";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { HotelListDetailsHeader, ServiceListDetailsHeader } from "../../components";
import { useSidebar } from "@/presentation/pages/private/hooks";
import { useWindowSize } from "@/presentation/hooks";
import type { TotalPerDay } from "../CostSummary.module";

type Props = {
  totalPerDay: TotalPerDay;
};

export const DetailsSummary = ({ totalPerDay }: Props) => {
  const { visible } = useSidebar();
  const { MACBOOK, width } = useWindowSize();
  const { hotelRoomTripDetails } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );

  const { serviceTripDetails } = useSelector(
    (state: AppState) => state.serviceTripDetails
  );

  const { currentTripDetails } = useSelector(
    (state: AppState) => state.tripDetails
  );

  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [[firstAccordion, secondAccordion], setAccordion] = useState<
    [boolean, boolean]
  >([false, false]);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const hotelRoomTripDetailsPerDay = useMemo(() => {
    if (!selectedDay || hotelRoomTripDetails.length === 0) return [];
    return hotelRoomTripDetails.filter((quote) =>
      dateFnsAdapter.isSameDay(quote.date, selectedDay!)
    );
  }, [selectedDay, hotelRoomTripDetails]);

  const serviceTripDetailsPerDay = useMemo(() => {
    if (!selectedDay || serviceTripDetails.length === 0) return [];
    return serviceTripDetails.filter((quote) =>
      dateFnsAdapter.isSameDay(quote.date, selectedDay!)
    );
  }, [selectedDay, serviceTripDetails]);

  useEffect(() => {
    setSelectedDay(currentTripDetails?.startDate);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200 - executionTime);
  }, [executionTime]);

  return (
    <TabView
      scrollable
      className={cn(firstAccordion || secondAccordion ? "" : "")}
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
      tabPanelContent={Object.entries(totalPerDay).map(
        ([date, value], index) => ({
          header: (
            <Button
              text
              unstyled
              tooltip={date}
              label={`Día ${index + 1} (${formatCurrency(value.total)})`}
              icon="pi pi-calendar"
              className="flex items-center justify-center gap-2"
            />
          ),
          children: (
            <Accordion
              onTabClose={(e) => {
                if (e.index === 0) {
                  setAccordion([firstAccordion, false]);
                 
                } else {
                  setAccordion([false, secondAccordion]);
                }
              }}
              onTabOpen={(e) => {
                if (e.index === 0) {
                  setAccordion([firstAccordion, false]);
                 
                } else {
                  setAccordion([false, secondAccordion]);
                }
              }}
              multiple
              activeIndex={[0, 1]}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 justify-center items-start gap-x-4 w-full",
                visible && width < MACBOOK && "!grid-cols-1"
              )}
              tabContent={[
                {
                  header: (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="pi text-2xl pi pi-cog text-primary me-1"></i>
                        <span className="p-accordion-header-text max-sm:text-sm">
                          Servicios ({formatCurrency(value.services)})
                        </span>
                      </div>
                      <Badge value={serviceTripDetailsPerDay.length} />
                    </div>
                  ),
                  className: cn(
                    "overflow-y-auto max-lg:mt-5 thin-scrollbar w-full",
                    firstAccordion ? "max-h-52" : "max-h-80"
                  ),
                  children: (
                    <>
                      {serviceTripDetailsPerDay.length === 0 ? (
                        <p className="text-center bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
                          Ningún servicio por ahora
                        </p>
                      ) : (
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 3xl:grid-cols-2 gap-x-4 gap-y-8 justify-items-center jus bg-white">
                          {serviceTripDetailsPerDay.map((quote) => (
                            <div
                              key={quote.id}
                              className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden"
                            >
                              {/* Header */}
                              <ServiceListDetailsHeader detail={quote} />

                              {/* Body */}
                              <div className="p-4 border-t">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <i className="pi text-2xl pi-money-bill text-primary me-1"></i>

                                    <span className="font-medium hidden min-[350px]:block">
                                      Costo
                                    </span>
                                  </div>
                                  <span className="text-lg md:text-2xl font-bold text-primary">
                                    ${quote.costPerson}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ),
                },
                {
                  header: (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="pi text-2xl pi pi-building text-primary me-1"></i>
                        <span className="p-accordion-header-text max-sm:text-sm">
                          Alojamiento ({formatCurrency(value.accommodation)})
                        </span>
                      </div>
                      <Badge value={hotelRoomTripDetailsPerDay.length} />
                    </div>
                  ),
                  className: cn(
                    "overflow-y-auto max-lg:mt-5 thin-scrollbar w-full",
                    secondAccordion ? "max-h-52" : "max-h-80"
                  ),
                  children: (
                    <>
                      {hotelRoomTripDetailsPerDay.length === 0 ? (
                        <p className="text-center bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
                          Ningún alojamiento por ahora
                        </p>
                      ) : (
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 3xl:grid-cols-2 gap-x-4 gap-y-8 justify-items-center jus bg-white">
                          {hotelRoomTripDetailsPerDay.map((quote) => (
                            <div
                              key={quote.id}
                              className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden"
                            >
                              {/* Header */}
                              <HotelListDetailsHeader quote={quote} />

                              {/* Body */}
                              <div className="p-4 border-t">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <i className="pi text-2xl pi-money-bill text-primary me-1"></i>

                                    <span className="font-medium hidden min-[350px]:block">
                                      Costo
                                    </span>
                                  </div>
                                  <span className="text-lg md:text-2xl font-bold text-primary">
                                    ${quote.costPerson}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ),
                },
              ]}
            />
          ),
        })
      )}
    />
  );
};
