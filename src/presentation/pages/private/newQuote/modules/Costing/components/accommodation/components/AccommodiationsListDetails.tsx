import { SetAccomodationQuoteDto } from "@/domain/dtos/accommodationQuote";
import { useAccommodationQuoteStore } from "@/infraestructure/hooks";
import { Button, Tag } from "@/presentation/components";
import { useEffect, useState } from "react";
import type { Day } from "../../Itineraty";

type Props = {
  selectedDay: Day;
};

export const AccommodiationsListDetails = ({ selectedDay }: Props) => {
  const { localAccommodationQuotes } = useAccommodationQuoteStore();
  const [localAccommodationQuotesPerDay, setLocalAccommodationQuotesPerDay] =
    useState<SetAccomodationQuoteDto[]>([]);

  useEffect(() => {
    setLocalAccommodationQuotesPerDay(
      localAccommodationQuotes.filter(
        (quote) => quote.day === selectedDay.number
      )
    );
  }, [localAccommodationQuotes, selectedDay]);

  console.log(localAccommodationQuotesPerDay);

  return (
    <>
    {localAccommodationQuotesPerDay.length === 0 ? (
      <p className="text-center bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
        Ningún alojamiento por ahora
        </p>
      
    ) : (
      <div className="w-full grid lg:grid-cols-2 gap-x-4 gap-y-8 justify-items-center jus bg-white">
        {localAccommodationQuotesPerDay.map((quote) => (
          <div
            key={quote.accommodationRoom.id}
            className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 items-center justify-between">
              <div className="flex items-center justify-between">
                <Tag
                  value="hotel"
                  className="bg-white text-primary rounded-lg px-5 py-0"
                />
                <Button icon="pi pi-trash" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20  rounded flex items-center justify-center">
                    <i className="pi text-xl pi-home"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {quote.accommodationRoom.accommodation.name}
                    </h2>
                    <small className="text-xs font-semibold text-secondary">
                      <i className="pi text-xs pi-map-marker me-1"></i>
                      {quote.accommodationRoom.accommodation.distrit.city.name}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="pi pi-user text-primary me-1"></i>
                    Personas
                  </div>
                  <p className="font-semibold">{quote.customerNumber}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="pi pi-star text-primary me-1"></i>
                    Estrellas
                  </div>
                  <p className="font-semibold">
                    {quote.accommodationRoom.accommodation.rating}
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
                    ${quote.accommodationRoom.priceUsd}
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
