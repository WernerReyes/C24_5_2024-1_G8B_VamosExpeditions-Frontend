import { useEffect, useState } from "react";
import { classNamesAdapter } from "@/core/adapters";
import { Calendar, SplitButton } from "@/presentation/components";
import { Itinerary } from "./components";

import "./Costing.module.css";

type Region = {
  label: string;
  id: number;
};

const REGIONS = [
  {
    label: "Región 1",
    id: 1,
  },
  {
    label: "Región 2",
    id: 2,
  },
  {
    label: "Región 3",
    id: 3,
  },
  {
    label: "Región 4",
    id: 4,
  },
];

const NUMERS_OF_DAYS = 5;

export const CostingModule = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [firstItineraryDate, setFirstItineraryDate] = useState<Date | null>();
  const handleRegionSelection = (region: Region) => {
    if (selectedRegion === region) {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(region);
    }
  };

  useEffect(() => {
    setSelectedRegion(REGIONS[0]);
  }, []);

  useEffect(() => {
    if (!firstItineraryDate) {
      setFirstItineraryDate(new Date());
    }
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between max-h-[54px] gap-y-4 mb-20 sm:mb-0">
        <SplitButton
          label={selectedRegion ? selectedRegion.label : "Seleccionar Región"}
          icon="pi pi-plus"
          className="lg:max-w-52"
          onClick={() => {
            console.log("clicked");
          }}
          model={REGIONS.map((region) => ({
            label: region.label,
            command: () => handleRegionSelection(region),
            className: classNamesAdapter(
              "border-[#D0D5DD]",
              selectedRegion === region
                ? "bg-secondary"
                : "text-black bg-transparent"
            ),
          }))}
        />

        <Calendar
          locale="es"
          dateFormat={"dd/mm/yy"}
          showIcon
          value={firstItineraryDate}
          onChange={(e) => setFirstItineraryDate(e.value)}
          showOnFocus={false}
          className="text-sm"
          todayButtonClassName="p-button-text"
          clearButtonClassName="p-button-text"
          placeholder="Ingresa la fecha de inicio"

          //   inputClassName="text-sm"
        />
      </div>
      <Itinerary
        numberOfDays={NUMERS_OF_DAYS}
        selectedRegion={selectedRegion ?? REGIONS[0]}
        firstItineraryDate={firstItineraryDate!}
      />
    </div>
  );
};