import { dateFnsAdapter } from "@/core/adapters";
import type {
  HotelRoomTripDetailsEntity,
  ServiceTripDetailsEntity,
} from "@/domain/entities";
import type { Day } from "@/infraestructure/store";

export const hotelRoomQuotationIdsPerDay = (
  selectedDay: Day,
  hotelRoomTripDetails: HotelRoomTripDetailsEntity[]
) => {
  if (selectedDay && hotelRoomTripDetails.length > 0) {
    return hotelRoomTripDetails
      .filter((quote) => dateFnsAdapter.isSameDay(quote.date, selectedDay.date))
      .map((quote) => quote.id);
  }
  return [];
};

export const servicesQuotationIdsPerDay = (
  selectedDay: Day,
  serviceTripDetails: ServiceTripDetailsEntity[]
) => {
  if (selectedDay && serviceTripDetails.length > 0) {
    return serviceTripDetails
      .filter((quote) => dateFnsAdapter.isSameDay(quote.date, selectedDay.date))
      .map((quote) => quote.id);
  }

  return [];
};
