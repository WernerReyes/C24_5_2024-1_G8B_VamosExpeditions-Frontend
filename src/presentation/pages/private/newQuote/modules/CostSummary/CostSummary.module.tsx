import { Toolbar } from "primereact/toolbar";
import {
  DataTableCostSummary,
  DetailsSummary,
  ListDetailsSummary,
} from "./components";
import { DataViewLayoutOptions } from "primereact/dataview";
import { useMemo, useState } from "react";
import { AppState } from "@/app/store";
import { useSelector } from "react-redux";
import { dateFnsAdapter } from "@/core/adapters";

export type TotalPerDay = {
  [date: string]: {
    accommodation: number;
    services: number;
    total: number;
    dayNumber: number;
  };
};

export const CostSummaryModule = () => {
  const { selectedDay: currentDay } = useSelector(
    (state: AppState) => state.quotation
  );

  const { currentTripDetails } = useSelector(
    (state: AppState) => state.tripDetails
  );

  const [layout, setLayout] = useState<
    "grid" | "list" | (string & Record<string, unknown>) | undefined
  >("list");

  const totalPerDay: TotalPerDay = useMemo(() => {
    return Array.from({ length: currentDay?.total ?? 0 }).reduce(
      (acc, _, index) => {
        const nextDay = new Date(currentTripDetails?.startDate ?? new Date());
        nextDay.setDate(nextDay.getDate() + index);

        const accommodiations =
          currentTripDetails?.hotelRoomTripDetails?.filter((quote) =>
            dateFnsAdapter.isSameDay(quote.date, nextDay)
          ) ?? [];

        const services =
          currentTripDetails?.serviceTripDetails?.filter((quote) =>
            dateFnsAdapter.isSameDay(quote.date, nextDay)
          ) ?? [];

        const totalAccommodations = accommodiations.reduce(
          (sum, quote) => sum + quote.costPerson,
          0
        );

        const totalServices = services.reduce(
          (sum, quote) => sum + quote.costPerson,
          0
        );

        const formattedDate = dateFnsAdapter.format(
          nextDay,
          "EEEE, d 'de' MMMM 'de' yyyy"
        );
        (acc as TotalPerDay)[formattedDate] = {
          accommodation: totalAccommodations,
          services: totalServices,
          total: totalAccommodations + totalServices,
          dayNumber: index + 1,
        };

        return acc;
      },
      {}
    ) as TotalPerDay;
  }, [currentTripDetails]);
  return (
    <>
      <Toolbar
        className="mb-4"
        end={
          <DataViewLayoutOptions
            layout={layout}
            onChange={(e) => setLayout(e.value)}
          />
        }
      />
      <div className="mb-10">
        {layout === "list" && <ListDetailsSummary totalPerDay={totalPerDay} />}
        {layout === "grid" && <DetailsSummary totalPerDay={totalPerDay} />}
      </div>

      <DataTableCostSummary />
    </>
  );
};
