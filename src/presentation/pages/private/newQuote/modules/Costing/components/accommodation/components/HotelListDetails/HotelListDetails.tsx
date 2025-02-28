import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import type { HotelRoomTripDetailsEntity } from "@/domain/entities";
import { HotelListDetailsHeader } from "../../../../../components";
import { HotelListDetailsSkeleton } from "./HotelListDetailsSkeleton";
import { measureExecutionTime } from "@/core/utils";
import { dateFnsAdapter } from "@/core/adapters";

export const HotelListDetails = () => {
  const { hotelRoomTripDetails, isFetchingHotelRoomTripDetails } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );
  const { selectedDay } = useSelector((state: AppState) => state.quotation);

  const [contentLoading, setContentLoading] = useState(true);

  const hotelRoomTripDetailsPerDay: HotelRoomTripDetailsEntity[] = useMemo(() => {
    if (selectedDay && hotelRoomTripDetails.length > 0) {
      const { result, executionTime } = measureExecutionTime(function () {
        return hotelRoomTripDetails.filter((quote) =>
          dateFnsAdapter.isSameDay(quote.date, selectedDay.date)
        );
      });

      setTimeout(() => {
        setContentLoading(false);
      }, executionTime);

      return result;
    }
    return [];
  }, [selectedDay, hotelRoomTripDetails]);

  const length =
    hotelRoomTripDetailsPerDay.length > 0 ? hotelRoomTripDetailsPerDay.length : 4;

  return (
    <>
      {hotelRoomTripDetailsPerDay.length === 0 ? (
        <p className="text-center max-sm:text-sm bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
          Ningún alojamiento por ahora
        </p>
      ) : (
        <div className="thin-scrollbar w-full grid lg:grid-cols-2 3xl:grid-cols-3 max-h-96 sm:max-h-[34rem] p-2 overflow-y-auto gap-x-4 gap-y-8 justify-items-center jus bg-white">
          {contentLoading || isFetchingHotelRoomTripDetails ? (
            Array.from({ length }).map((_, index) => (
              <HotelListDetailsSkeleton key={index} />
            ))
          ) : (
            <>
              {hotelRoomTripDetailsPerDay.map((quote) => (
                <div
                  key={quote.id}
                  className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  {/* Header */}
                  <HotelListDetailsHeader quote={quote} />
                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Grid */}
                    <div className="grid gap-6 min-[350px]:grid-cols-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <i className="pi pi-user text-primary me-1"></i>
                          Personas
                        </div>
                        <p className="font-semibold">{quote.numberOfPeople}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <i className="pi pi-tag text-primary me-1"></i>
                          Categoria
                        </div>
                        <p className="font-semibold">
                          {quote.hotelRoom?.hotel?.category}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <i className="pi text-2xl pi-money-bill text-primary me-1"></i>

                          <span className="font-medium hidden min-[350px]:block">
                            Costo
                          </span>
                        </div>
                        <span className="text-xl lg:text-2xl font-bold text-primary">
                          ${quote.hotelRoom?.rateUsd}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
};
