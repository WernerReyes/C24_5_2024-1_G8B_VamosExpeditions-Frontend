import { useEffect, useState } from "react";
import { classNamesAdapter } from "@/core/adapters";
import { Calendar, SplitButton } from "@/presentation/components";
import { Itinerary } from "./components";

import { useReservationStore } from "@/infraestructure/hooks";
import type { CityEntity } from "@/domain/entities";

export const CostingModule = () => {
  const { currentReservation, startUpdatingReservatioTravelDates } =
    useReservationStore();
  const [[startDate, endDate], setDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [selectedCity, setSelectedCity] = useState<CityEntity | null>(null);
  const [isDateRangeChanged, setIsDateRangeChanged] = useState(false);

  const handleCitySelection = (city: CityEntity) => {
    if (selectedCity === city) {
      setSelectedCity(selectedCity);
    } else {
      setSelectedCity(city);
    }
  };

  useEffect(() => {
    if (currentReservation?.cities && !selectedCity) {
      setSelectedCity(currentReservation.cities[0]);
    }
  }, []);

  useEffect(() => {
    if (currentReservation) {
      setDateRange([
        currentReservation.startDate,
        currentReservation.endDate,
      ]);
    }
  }, [currentReservation]);

  useEffect(() => {
    if (isDateRangeChanged) {
      console.log({ startDate, endDate });
      startUpdatingReservatioTravelDates([startDate!, endDate!]).then(() => {
        setIsDateRangeChanged(false);
      });
    }
  }, [isDateRangeChanged]);

  console.log({ startDate, endDate });

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between max-h-[54px] gap-y-4 mb-20 sm:mb-0">
        <SplitButton
          label={selectedCity ? selectedCity.name : "Seleccionar Región"}
          icon="pi pi-plus"
          className="lg:max-w-52"
          onClick={() => {
            console.log("clicked");
          }}
          model={
            currentReservation?.cities!.map((city: CityEntity) => ({
              label: city.name,
              command: () => handleCitySelection(city),
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
            if (e.value && e.value[0] && e.value[1])
              setIsDateRangeChanged(true);
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
      <Itinerary
        selectedCity={selectedCity ?? currentReservation!.cities![0]}
      />
    </div>
  );
};


{/* <Calendar
numberOfMonths={2}
label={{
  text: "Fecha",
  htmlFor: "calendar",
}}
onChange={(e) => {
  field.onChange(e.value);
}}
value={field.value as Date[]}
small={{
  text: error?.message,
}}
locale="es"
dateFormat="dd/mm/yy"
placeholder="Seleccione una fecha"
selectionMode="range"
readOnlyInput
hideOnRangeSelection
/> */}