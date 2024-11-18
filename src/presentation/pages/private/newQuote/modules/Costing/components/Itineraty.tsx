import { classNamesAdapter } from "@/core/adapters";
import { Button } from "@/presentation/components";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { SelectButton, SelectButtonChangeEvent } from "primereact/selectbutton";
import { SelectItem } from "primereact/selectitem";
import { useEffect, useRef, useState } from "react";

interface Day {
  id: number;
  name: string;
  date: string;
}

//   const days: Day[] = [
//     { id: 1, name: "Día 1", date: "Monday, 16 de September, 2024" },
//     { id: 2, name: "Día 2", date: "Tuesday, 17 de September, 2024" },
//     { id: 3, name: "Día 3", date: "Wednesday, 18 de September, 2024" },
//     { id: 4, name: "Día 4", date: "Thursday, 19 de September, 2024" },
//     { id: 5, name: "Día 5", date: "Friday, 20 de September, 2024" },
//   ];

type Props = {
  firstItineraryDate: Date | null;
  selectedRegion: { label: string; id: number };
  numberOfDays: number;
};

export const Itinerary = ({
  selectedRegion,
  firstItineraryDate,
  numberOfDays,
}: Props) => {
  const [selectedDay, setSelectedDay] = useState<Day>();
  const [generatedDays, setGeneratedDays] = useState<Day[]>();

  useEffect(() => {
    if (firstItineraryDate) {
      const days: Day[] = Array.from({ length: numberOfDays }, (_, index) => {
        const date = new Date(firstItineraryDate);
        date.setDate(date.getDate() + index);
        return {
          id: index + 1,
          name: `Día ${index + 1}`,
          date: date.toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        };
      });
      setGeneratedDays(days);
      setSelectedDay(days[0]);
    }
  }, [firstItineraryDate]);

  const options: SelectItem[] = [
    {
      label: "Servicios",
      icon: "pi pi-users",
      className: "w-1/2",
      value: "services",
    },
    {
      label: "Alojamiento",
      icon: "pi pi-home",
      className: "w-1/2",
      value: "accommodation",
    },
  ];

  const [value, setValue] = useState<SelectItem>(options[0].value);
  const menuLeft = useRef<Menu>(null);

  const items: MenuItem[] = [
    {
      label: "Transporte",
      icon: "pi pi-refresh",
    },
    {
      separator: true,
    },
    {
      label: "Actividades",
      icon: "pi pi-upload",
    },
    {
      separator: true,
    },
    {
      label: "Alojamiento",
      icon: "pi pi-upload",
    },
    {
      separator: true,
    },
    {
      label: "Guías",
      icon: "pi pi-upload",
    },
  ];

  return (
    <div className="flex flex-col mt-5 lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 md:ps-6 order-1 lg:order-2">
        <h2 className="text-4xl font-bold text-tertiary">
          {selectedDay?.name} - {selectedRegion.label}
        </h2>
        <p className="text-primary mb-4">{selectedDay?.date}</p>

        <div className="space-y-6">
          {/* Tabs */}

          <SelectButton
            value={value}
            onChange={(e: SelectButtonChangeEvent) => setValue(e.value)}
            className="max-w-[50rem] mx-auto"
            itemTemplate={(option) => (
              <span className="flex font-bold justify-center mx-auto space-x-2 items-center">
                <i className={`${option.icon}`}></i>
                <span>{option.label}</span>
              </span>
            )}
            // optionValue="value"

            options={options}
          />

          {/* Content */}

          <div className="flex justify-end">
            <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
            <Button
              label="Agregar Servicio"
              icon="pi pi-plus-circle"
              onClick={(event) => menuLeft.current?.toggle(event)}
              aria-controls="popup_menu_left"
              aria-haspopup
            />
          </div>
          <p className="text-center bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
            Ningún servicio por ahora
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-1/4 order-2 lg:order-1">
        <ul className="space-y-2">
          {generatedDays?.map((day, index) => (
            <li
              key={day.id}
              onClick={() => setSelectedDay(day)}
              className={`p-4 rounded-lg cursor-pointer text-sm md:text-base ${
                selectedDay?.id === day.id
                  ? "bg-primary text-white"
                  : "bg-secondary hover:bg-gray-300"
              }`}
            >
              <div className="flex items-center space-x-5">
                <p
                  className={classNamesAdapter(
                    "font-semibold rounded-full flex items-center justify-center min-w-8 min-h-8",
                    selectedDay?.id === day.id
                      ? "bg-white text-primary"
                      : "bg-tertiary text-white"
                  )}
                >
                  <span>{index + 1}</span>
                </p>
                <div className="flex items-start flex-col">
                  <p className="font-semibold">{day.name}</p>
                  <p className="text-xs md:text-sm">{day.date}</p>
                </div>
              </div>
            </li>
          ))}
          <div className="flex justify-center">
            <Button label="Agregar Día" icon="pi pi-plus-circle" text />
          </div>
        </ul>
      </div>
    </div>
  );
};
