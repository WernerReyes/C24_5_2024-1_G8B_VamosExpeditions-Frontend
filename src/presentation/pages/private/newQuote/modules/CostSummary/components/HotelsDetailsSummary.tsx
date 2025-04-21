import type { AppState } from "@/app/store";
import { dateFnsAdapter } from "@/core/adapters";
import type { HotelRoomTripDetailsEntity } from "@/domain/entities";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { HotelListDetailsHeader } from "../../components";

type Props = {
  selectedDay: Date | undefined;
};

export const HotelsDetailsSummary = ({ selectedDay }: Props) => {
  const { hotelRoomTripDetails } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );

  const hotelRoomTripDetailsPerDay: HotelRoomTripDetailsEntity[] = useMemo(() => {
    if (!selectedDay || hotelRoomTripDetails.length === 0) return [];
    return hotelRoomTripDetails.filter((quote) =>
      dateFnsAdapter.isSameDay(quote.date, selectedDay!)
    );
  }, [selectedDay, hotelRoomTripDetails]);


  return (
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

                    <span className="font-medium hidden min-[350px]:block">Costo</span>
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
  );
};
