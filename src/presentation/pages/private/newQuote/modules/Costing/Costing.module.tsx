import { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import { classNamesAdapter } from "@/core/adapters";
import { Calendar, SplitButton } from "@/presentation/components";
import { Itinerary } from "./components";

import { useHotelStore, useReservationStore } from "@/infraestructure/hooks";
import type { CityEntity } from "@/domain/entities";
import {
  useGetHotelsQuery,
  useUpsertReservationMutation,
} from "@/infraestructure/store/services";
import { reservationDto } from "@/domain/dtos/reservation";
import { AppState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import { onSetHotels } from "@/infraestructure/store";

export const CostingModule = () => {
  const dispatch = useDispatch();
  const { currentReservation } = useSelector(
    (state: AppState) => state.reservation
  );
  const [upsertReservation] = useUpsertReservationMutation();

  // const { startGetAllHotels } = useHotelStore();

  const [[startDate, endDate], setDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [selectedCity, setSelectedCity] = useState<CityEntity | undefined>(
    undefined
  );

  const { data: hotels,  } = useGetHotelsQuery(
    {
      cityId: selectedCity?.id,
    },
    {
      skip: !selectedCity,
    }
  );

  const handleUpsertReservation = ([startDate, endDate]: [
    Date | null,
    Date | null
  ]) => {
    console.log(startDate, endDate);
    if (startDate && endDate && currentReservation) {
      upsertReservation({
        reservationDto: reservationDto.parse({
          ...currentReservation,
          startDate,
          endDate,
        }),
        showMessage: false,
      });
    }
  };

  useEffect(() => {
    if (currentReservation?.cities && !selectedCity) {
      setSelectedCity(currentReservation.cities[0]);
    }
  }, []);

  useEffect(() => {
    if (currentReservation) {
      setDateRange([currentReservation.startDate, currentReservation.endDate]);
    }
  }, [currentReservation]);

  useEffect(() => {
    if (hotels?.data) {
      dispatch(onSetHotels(hotels.data));
    }
  }, [hotels]);

  // useEffect(() => {
  //   if (selectedCity) {
  //     startGetAllHotels({ cityId: selectedCity.id });
  //   }
  // }, [selectedCity]);

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between max-h-[54px] gap-y-4 mb-20 sm:mb-0">
        <SplitButton
          label={selectedCity ? selectedCity.name : "Seleccionar Región"}
          icon="pi pi-plus"
          className="lg:max-w-52"
          model={
            currentReservation?.cities?.map((city: CityEntity) => ({
              label: city.name,
              command: () => setSelectedCity(city),
              className: classNamesAdapter(
                "border-[#D0D5DD]",
                selectedCity === city
                  ? "bg-secondary"
                  : "text-black bg-transparent"
              ),
            })) ?? []
          }
        />

        <Calendar
          dateFormat="dd/mm/yy"
          showIcon
          numberOfMonths={2}
          value={[startDate, endDate]}
          onChange={(e) => {
            setDateRange(e.value as [Date, Date]);
            if (e.value && e.value[0] && e.value[1]) {
              handleUpsertReservation(e.value as [Date, Date]);
            }
          }}
          showOnFocus={false}
          locale="es"
          className="text-sm"
          todayButtonClassName="p-button-text"
          clearButtonClassName="p-button-text"
          placeholder="Ingresa la fecha de inicio"
          selectionMode="range"
          readOnlyInput
        />
      </div>
      <Itinerary selectedCity={selectedCity} />
    </div>
  );
};
