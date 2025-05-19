import type { AppState } from "@/app/store";
import { cn, dateFnsAdapter } from "@/core/adapters";
import { formatCurrency, measureExecutionTime } from "@/core/utils";
import { Accordion, TabView } from "@/presentation/components";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { HotelListDetailsHeader } from "../../components";

type TotalPerDay = {
  [date: string]: {
    accommodation: number;
    services: number;
    total: number;
  };
};

export const HotelsDetailsSummary = () => {
  const { hotelRoomTripDetails } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );

  const { selectedDay: currentDay } = useSelector(
    (state: AppState) => state.quotation
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

  const [totalPerDay, setTotalPerDay] = useState<TotalPerDay>({});

  const hotelRoomTripDetailsPerDay = useMemo(() => {
    if (!selectedDay || hotelRoomTripDetails.length === 0) return [];
    return hotelRoomTripDetails.filter((quote) =>
      dateFnsAdapter.isSameDay(quote.date, selectedDay!)
    );
  }, [selectedDay, hotelRoomTripDetails]);

  useEffect(() => {
    const totals = Array.from({ length: currentDay?.total ?? 0 }).reduce(
      (acc, _, index) => {
        const nextDay = new Date(currentTripDetails?.startDate ?? new Date());
        nextDay.setDate(nextDay.getDate() + index);

        const accommodiations =
          currentTripDetails?.hotelRoomTripDetails?.filter((quote) =>
            dateFnsAdapter.isSameDay(quote.date, nextDay)
          ) ?? [];

        const total = accommodiations.reduce(
          (sum, quote) => sum + quote.costPerson,
          0
        );

        const formattedDate = dateFnsAdapter.format(nextDay, "yyyy-MM-dd");
        (acc as TotalPerDay)[formattedDate] = {
          accommodation: total,
          services: 0,
          total: total,
        };

        return acc;
      },
      {}
    );

    setTotalPerDay(totals as TotalPerDay);
  }, [hotelRoomTripDetails]);

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
      className={cn(firstAccordion || secondAccordion ? "h-[34rem]" : "")}
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
      tabPanelContent={Object.entries(totalPerDay).map(([_, value], index) => ({
        header: `Día ${index + 1} ${formatCurrency(value.total)}`,
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
                header: `Servicios ${formatCurrency(value.services)}`,
                className: "overflow-y-auto thin-scrollbar max-h-64 w-full",
                children: (
                  <p className="text-center bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
                    Ningún alojamiento por ahora
                  </p>
                ),
              },
              {
                header: `Alojamiento 
                 ${hotelRoomTripDetailsPerDay.length}
                ${formatCurrency(value.accommodation)}`,
                className: cn(
                  "overflow-y-auto max-lg:mt-5 thin-scrollbar w-full",
                  firstAccordion ? "max-h-52" : "max-h-80"
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
      }))}
    />
  );
};

// export const HotelsDetailsSummary = ({ selectedDay }: Props) => {
//   const { hotelRoomTripDetails } = useSelector(
//     (state: AppState) => state.hotelRoomTripDetails
//   );

//   const hotelRoomTripDetailsPerDay: HotelRoomTripDetailsEntity[] = useMemo(() => {
//     if (!selectedDay || hotelRoomTripDetails.length === 0) return [];
//     return hotelRoomTripDetails.filter((quote) =>
//       dateFnsAdapter.isSameDay(quote.date, selectedDay!)
//     );
//   }, [selectedDay, hotelRoomTripDetails]);

//   return (
//     <>
//       {hotelRoomTripDetailsPerDay.length === 0 ? (
//         <p className="text-center bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
//           Ningún alojamiento por ahora
//         </p>
//       ) : (
//         <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 3xl:grid-cols-2 gap-x-4 gap-y-8 justify-items-center jus bg-white">
//           {hotelRoomTripDetailsPerDay.map((quote) => (
//             <div
//               key={quote.id}
//               className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden"
//             >
//               {/* Header */}
//               <HotelListDetailsHeader quote={quote} />

//               {/* Body */}
//               <div className="p-4 border-t">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <i className="pi text-2xl pi-money-bill text-primary me-1"></i>

//                     <span className="font-medium hidden min-[350px]:block">Costo</span>
//                   </div>
//                   <span className="text-lg md:text-2xl font-bold text-primary">
//                     ${quote.costPerson}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </>
//   );
// };
