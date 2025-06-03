import type { AppState } from "@/app/store";
import { cn, dateFnsAdapter } from "@/core/adapters";
import { formatCurrency } from "@/core/utils";
import type {
  HotelRoomTripDetailsEntity,
  ServiceTripDetailsEntity,
} from "@/domain/entities";
import { Column, DataTable, Tag } from "@/presentation/components";
import { FieldNotAssigned } from "@/presentation/pages/private/components";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { TotalPerDay } from "../CostSummary.module";

type Props = {
  totalPerDay: TotalPerDay;
};

export const ListDetailsSummary = ({ totalPerDay }: Props) => {
  const { hotelRoomTripDetails } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );

  const { serviceTripDetails } = useSelector(
    (state: AppState) => state.serviceTripDetails
  );

  const detailsWithEmptyDates = useMemo(() => {
    const existingDates = new Set(
      hotelRoomTripDetails
        .concat(serviceTripDetails)
        .map((item) => dateFnsAdapter.format(item.date, "yyyy-MM-dd"))
    );
    const missingDetails = Object.keys(totalPerDay)
      .map((dateStr) => {
        const parsedDate = dateFnsAdapter.parse(
          dateStr,
          "EEEE, d 'de' MMMM 'de' yyyy"
        );
        const formatted = dateFnsAdapter.format(parsedDate, "yyyy-MM-dd");

        if (!existingDates.has(formatted)) {
          return {
            date: parsedDate,
            costPerson: 0,
            dateString: formatted,
          };
        }
        return null;
      })
      .filter(Boolean); // delete null values

    const hotelRoomTripDetailsWithDate = [
      ...hotelRoomTripDetails.map((item) => ({
        ...item,
        dateString: dateFnsAdapter.format(item.date, "yyyy-MM-dd"),
      })),
      ...serviceTripDetails.map((item) => ({
        ...item,
        dateString: dateFnsAdapter.format(item.date, "yyyy-MM-dd"),
      })),
      ...missingDetails,
    ] as Partial<HotelRoomTripDetailsEntity>[];
    // console.log(hotelRoomTripDetailsWithDate);

    return hotelRoomTripDetailsWithDate;
  }, [totalPerDay]);

  return (
    <div className="card">
      <DataTable
        value={detailsWithEmptyDates}
        rowGroupMode="subheader"
        groupRowsBy="dateString"
        sortMode="single"
        sortField="dateString"
        sortOrder={1}
        scrollable
        scrollHeight="400px"
        rowGroupHeaderTemplate={(data) => {
          const format = dateFnsAdapter.format(
            data.date,
            "EEEE, d 'de' MMMM 'de' yyyy"
          );
          const { dayNumber, total } = totalPerDay[format];
          return (
            <div className="flex bg-secondary p-4 rounded-4 gap-2 items-center">
              <i className="text-2xl pi pi-calendar text-primary"></i>
              <div className="flex flex-col">
                <h4 className="font-semibold">
                  Día {dayNumber}{" "}
                  <span className="text-primary font-bold">
                    ({formatCurrency(total)})
                  </span>
                </h4>
                <small>{format}</small>
              </div>
            </div>
          );
        }}
      >
        <Column
          headerClassName="hidden"
          body={(
            data: HotelRoomTripDetailsEntity | ServiceTripDetailsEntity
          ) => {
            if (!data.id)
              return (
                <FieldNotAssigned message="No hay ningún recurso agregado por ahora" />
              );
            let details: {
              name: string;
              cityName: string;
              type: string;
              costPerson: number;
              icon: string;
            } = {
              name: "",
              cityName: "",
              type: "",
              costPerson: 0,
              icon: "",
            };

            if ("hotelRoom" in data) {
              details = {
                name: `${data?.hotelRoom?.hotel?.name} - ${data?.hotelRoom?.roomType}`,
                cityName: data?.hotelRoom?.hotel?.distrit?.city?.name ?? "",
                type: "ALOJAMIENTO",
                costPerson: data.costPerson,
                icon: "pi-home",
              };
            }

            if ("service" in data) {
              details = {
                name: data?.service?.description ?? "",
                cityName: data?.service?.district?.city?.name ?? "",
                type: data?.service?.serviceType?.name ?? "",
                costPerson: data.costPerson,
                icon: "pi-cog",
              };
            }

            return (
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center">
                    <i className={cn("text-xl pi  text-primary", 
                      details.icon
                    )}></i>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-semibold">{details.name}</h4>
                    <small>
                      <i className="text-xs pi pi-map-marker me-1"></i>
                      {details.cityName}
                    </small>
                    <div className="flex gap-2 items-center justify-end">
                      <Tag value={details.type} className="text-xs" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <span className="text-xl text-primary font-semibold">
                    {formatCurrency(details.costPerson)}
                  </span>
                </div>
              </div>
            );
          }}
        ></Column>
      </DataTable>
    </div>
  );
};
