import { AppState } from "@/app/store";
import { HotelRoomQuotationEntity } from "@/domain/entities";
import { useDeleteHotelRoomQuotationMutation } from "@/infraestructure/store/services";

import { Button, Tag } from "@/presentation/components";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { HotelListDetailsSkeleton } from "./HotelListDetailsSkeleton";
import { measureExecutionTime } from "@/core/utils";

export const HotelListDetails = () => {
  const { hotelRoomQuotations } = useSelector(
    (state: AppState) => state.hotelRoomQuotation
  );
  const { selectedDay } = useSelector((state: AppState) => state.quotation);

  const [deleteHotelRoomQuotation] = useDeleteHotelRoomQuotationMutation();

  const [contentLoading, setContentLoading] = useState(true);

  const hotelRoomQuotationsPerDay: HotelRoomQuotationEntity[] = useMemo(() => {
    if (selectedDay) {
      const { result, executionTime } = measureExecutionTime(function () {
        return hotelRoomQuotations.filter(
          (quote) => quote.day === selectedDay.number
        );
      });

      setTimeout(() => {
        setContentLoading(false);
      }, executionTime);

      return result;
    }
    return [];
  }, [selectedDay, hotelRoomQuotations]);

  return (
    <>
      {hotelRoomQuotationsPerDay.length === 0 ? (
        <p className="text-center max-sm:text-sm bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
          Ningún alojamiento por ahora
        </p>
      ) : (
        <div className="thin-scrollbar w-full grid lg:grid-cols-2 [1920px]:grid-cols-3 max-h-96 sm:max-h-[34rem] p-2 overflow-y-auto gap-x-4 gap-y-8 justify-items-center jus bg-white">
          {contentLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <HotelListDetailsSkeleton key={index} />
            ))}

          {!contentLoading &&
            hotelRoomQuotationsPerDay.map((quote) => (
              <div
                key={quote.id}
                className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden"
              >
                {/* Header */}
                <div className="bg-primary text-white p-4 items-center justify-between">
                  <div className="flex items-center justify-between">
                    <Tag
                      value="hotel"
                      className="bg-white text-primary rounded-lg px-5 py-0"
                    />
                    <Button
                      icon="pi pi-trash"
                      onClick={() => deleteHotelRoomQuotation(quote.id)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 sm:w-10 sm:h-10 sm:px-1 bg-white/20 rounded flex items-center justify-center">
                        <i className="pi px-1 sm:text-xl pi-home"></i>
                      </div>
                      <div>
                        <h2 className="text-xs sm:text-sm lg:tex 2xl:text-lg font-semibold">
                          {quote.hotelRoom?.hotel?.name} -{" "}
                          {quote.hotelRoom?.roomType}
                        </h2>
                        <small className="text-xs font-semibold text-secondary">
                          <i className="pi text-xs pi-map-marker me-1"></i>
                          {quote.hotelRoom?.hotel?.distrit?.city?.name}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Grid */}
                  <div className="grid gap-6 grid-cols-2">
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

                        <span className="font-medium">Costo</span>
                      </div>
                      <span className="text-2xl font-bold text-primary">
                        ${quote.hotelRoom?.rateUsd}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};
