import { AppState } from "@/app/store";
import { classNamesAdapter } from "@/core/adapters";
import { constantStorage } from "@/core/constants";
import { reservationDto } from "@/domain/dtos/reservation";
import type { CityEntity } from "@/domain/entities";
import { Day, onSetSelectedDay } from "@/infraestructure/store";
import { useUpsertReservationMutation } from "@/infraestructure/store/services";
import { Button } from "@/presentation/components";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { SelectButton, SelectButtonChangeEvent } from "primereact/selectbutton";
import { SelectItem } from "primereact/selectitem";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Accommodiations } from "./accommodation";

const { ITINERARY_CURRENT_ACTIVITY } = constantStorage;

const OPTIONS: SelectItem[] = [
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

const SERVICES: MenuItem[] = [
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

type Props = {
  selectedCity?: CityEntity;
};

export const Itinerary = ({ selectedCity }: Props) => {
  const dispatch = useDispatch();
  // const { startSetSelectedDay } = useQuotationStore();

  const { selectedDay } = useSelector((state: AppState) => state.quotation);

  const { currentReservation } = useSelector(
    (state: AppState) => state.reservation
  );

  const [upsertReservation] = useUpsertReservationMutation();

  const [[startDate, endDate], setDaysRange] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const [generatedDays, setGeneratedDays] = useState<Day[]>();
  const [lastItineraryDate, setLastItineraryDate] = useState<Date>();
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [value, setValue] = useState<string>(
    localStorage.getItem(ITINERARY_CURRENT_ACTIVITY) || OPTIONS[0].value
  );
  const [totalDays, setTotalDays] = useState<number>(0);
  const menuLeft = useRef<Menu>(null);

  const handleAddDay = () => {
    if (generatedDays) {
      lastItineraryDate?.setDate(lastItineraryDate.getDate() + 1);

      //* Update reservation travel dates
      if (currentReservation) {
        upsertReservation({
          reservationDto: reservationDto.parse({
            ...currentReservation,
            startDate: startDate!,
            endDate: lastItineraryDate!,
          }),
          showMessage: false,
        });
      }

      const newDay: Day = {
        id: generatedDays.length + 1,
        number: generatedDays.length + 1,
        name: `Día ${generatedDays.length + 1}`,
        date: lastItineraryDate!.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        total: totalDays + 1,
      };
      setGeneratedDays([...generatedDays, newDay]);

      dispatch(onSetSelectedDay(newDay));

      //* Scroll to bottom after adding a new day at the end of the list
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  useEffect(() => {
    if (currentReservation) {
      setDaysRange([
        new Date(currentReservation.startDate),
        new Date(currentReservation.endDate),
      ]);
    }
  }, [currentReservation]);

  useEffect(() => {
    if (startDate && endDate) {
      const daysNumber =
        Math.abs(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      new Promise<Day[]>((resolve) => {
        const days = Array.from({ length: daysNumber }, (_, index) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + index);

          setLastItineraryDate(date);
          return {
            id: index + 1,
            number: index + 1,
            name: `Día ${index + 1}`,
            date: date.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            total: daysNumber,
          };
        });

        resolve(days);
      }).then((days) => {
        // if (days.length > 1) {
          setGeneratedDays(days);
          setTotalDays(daysNumber);
        // }
      });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (currentReservation && generatedDays) {
      dispatch(
        onSetSelectedDay(
          generatedDays.find((day) => day.number === selectedDay?.number) ||
            generatedDays[0]
        )
      );
    }
  }, [currentReservation, generatedDays]);

  useEffect(() => {
    localStorage.setItem(ITINERARY_CURRENT_ACTIVITY, value);
  }, [value]);

  return (
    <div className="flex flex-col mt-5 lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 md:ps-6 order-1 lg:order-2">
        <h2 className="text-4xl font-bold text-tertiary">
          {selectedDay?.name} - {selectedCity?.name}
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

            options={OPTIONS}
          />

          {/* Content */}
          {value === "services" && (
            <>
              <div className="flex justify-end">
                <Menu
                  model={SERVICES}
                  popup
                  ref={menuLeft}
                  id="popup_menu_left"
                />
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
            </>
          )}

          {value === "accommodation" && (
            <>
              <Accommodiations />
            </>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-1/4 order-2 lg:order-1">
        <ul
          ref={scrollContainerRef}
          className="space-y-2 max-h-svh overflow-y-auto"
        >
          {generatedDays?.map((day, index) => (
            <li
              key={day.id}
              onClick={() =>
                dispatch(
                  onSetSelectedDay({
                    ...day,
                    total: totalDays,
                  })
                )
              }
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
        </ul>
        <div className="flex justify-center mt-4">
          <Button
            label="Agregar Día"
            icon="pi pi-plus-circle"
            text
            onClick={handleAddDay}
          />
        </div>
      </div>
    </div>
  );
};
