import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import { classNamesAdapter, dateFnsAdapter } from "@/core/adapters";
import { reservationDto } from "@/domain/dtos/reservation";
import { type Day, onSetSelectedDay } from "@/infraestructure/store";
import { useUpsertReservationMutation } from "@/infraestructure/store/services";
import {
  Button,
  Skeleton,
  SpeedDial,
  Tooltip,
} from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { measureExecutionTime } from "@/core/utils";

type Props = {
  setIsDayDeleted: (isDayDeleted: boolean) => void;
  isDayDeleted: boolean;
};

export const SidebarDays = ({ isDayDeleted, setIsDayDeleted }: Props) => {
  const dispatch = useDispatch();
  const { MACBOOK, width } = useWindowSize();

  const { selectedDay } = useSelector((state: AppState) => state.quotation);

  const { currentReservation } = useSelector(
    (state: AppState) => state.reservation
  );

  const [upsertReservation] = useUpsertReservationMutation();
  const [contentLoading, setContentLoading] = useState<boolean>(true);
  const [[startDate, endDate], setDaysRange] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const [generatedDays, setGeneratedDays] = useState<Day[]>();
  const [lastItineraryDate, setLastItineraryDate] = useState<Date>();
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  const [isDeletingDay, setIsDeletingDay] = useState<boolean>(false);

  const handleUpdateReservation = (startDate: Date, endDate: Date) => {
    if (currentReservation && generatedDays) {
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

  const handleAddDay = () => {
    if (generatedDays) {
      lastItineraryDate?.setDate(lastItineraryDate.getDate() + 1);

      // //* Update reservation travel dates
      handleUpdateReservation(startDate!, lastItineraryDate!);
      
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
        total: [...generatedDays].length + 1,
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
      const { result: days, executionTime } = measureExecutionTime(function () {
        const daysNumber =
          Math.abs(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;
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
        return days;
      });

      setGeneratedDays(days);

      setTimeout(() => {
        setContentLoading(false);
      }, executionTime);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (currentReservation && generatedDays && !isDeletingDay) {
      dispatch(
        onSetSelectedDay(
          generatedDays.find((day) => day.number === selectedDay?.number) ||
            generatedDays[0]
        )
      );
    }
  }, [currentReservation, generatedDays, isDeletingDay]);

  useEffect(() => {
    if (!isDayDeleted || !selectedDay || !generatedDays) return;
    setIsDeletingDay(true);

    const selectedDayIndex = generatedDays.findIndex(
      (day) => day.number === selectedDay.number
    );

    if (selectedDayIndex === -1) return;

    // Remove the selected day
    const newDays = generatedDays.filter(
      (_, index) => index !== selectedDayIndex
    );

    // If the first day was deleted, adjust the remaining dates
    if (selectedDayIndex === 0 && newDays.length > 0) {
      let previousDate = dateFnsAdapter.parse(
        newDays[0].date, // 📌 Usamos la fecha del nuevo primer día como referencia
        "EEEE, d 'de' MMMM 'de' yyyy"
      );

      for (let i = 0; i < newDays.length; i++) {
        if (i === 0) {
          //* The first day is not adjusted
          previousDate.setDate(previousDate.getDate());

          //* Update the first day's date in the reservation
          handleUpdateReservation(previousDate, endDate!);
        } 

        newDays[i] = {
          ...newDays[i],
          id: i + 1,
          name: `Día ${i + 1}`,
          number: i + 1,
          date: previousDate.toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        };
      }
    } else {
      //* Adjust the remaining dates
      if (selectedDayIndex !== newDays.length) {
        for (let i = selectedDayIndex; i < newDays.length; i++) {
          let previousDate = dateFnsAdapter.parse(
            newDays[i].date,
            "EEEE, d 'de' MMMM 'de' yyyy"
          );
          previousDate.setDate(previousDate.getDate() - 1);

          newDays[i] = {
            ...newDays[i],
            id: i + 1,
            name: `Día ${i + 1}`,
            number: i + 1,
            date: previousDate.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          };
        }
      }

  
      //* Update the rest of the days' dates in the reservation
      handleUpdateReservation(
        startDate!,
        dateFnsAdapter.parse(
          newDays[newDays.length - 1].date,
          "EEEE, d 'de' MMMM 'de' yyyy"
        )
      );
    }

    //* Update reservation travel dates
    if (newDays.length > 0) {
      setLastItineraryDate(
        dateFnsAdapter.parse(
          newDays[newDays.length - 1].date,
          "EEEE, d 'de' MMMM 'de' yyyy"
        )
      );
    }

    //* Update the selected day
    let newDaySelected: Day | undefined;
    if (newDays.length === 0) {
      newDaySelected = undefined;
    } else if (selectedDayIndex === 0) {
      newDaySelected = newDays[0]; //* Now the first day is the one that had the date of the second before
    } else if (selectedDayIndex >= newDays.length) {
      newDaySelected = newDays[newDays.length - 1]; //* Last day
    } else {
      newDaySelected = newDays[selectedDayIndex]; //* Middle day
    }

    //* Batch state updates
    setGeneratedDays(newDays);
    dispatch(
      onSetSelectedDay({
        ...newDaySelected!,
        total: newDays.length,
      })
    );

    setIsDayDeleted(false);
  }, [isDayDeleted]);

  return (
    <>
      {width > MACBOOK ? (
        <div className="lg:w-1/4 order-2 xl:order-1">
          <ul
            ref={scrollContainerRef}
            className="thin-scrollbar max-h-screen space-y-2 overflow-y-auto"
          >
            {contentLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <li
                  key={index}
                  className={classNamesAdapter(
                    "p-4 flex items-center rounded-lg h-24 animate-pulse",
                    selectedDay?.id === index + 1
                      ? "bg-primary text-white"
                      : "bg-secondary hover:bg-gray-300"
                  )}
                >
                  <div className="flex items-center space-x-5">
                    {/* Número del día (círculo) */}
                    <Skeleton
                      shape="circle"
                      size="36px"
                      className="bg-gray-300"
                    />

                    {/* Información del día */}
                    <div className="flex items-start flex-col space-y-1">
                      <Skeleton
                        width="80px"
                        height="16px"
                        className="bg-gray-300"
                      />
                      <Skeleton
                        width="100px"
                        height="12px"
                        className="bg-gray-300"
                      />
                    </div>
                  </div>
                </li>
              ))}

            {!contentLoading &&
              generatedDays?.map((day, index) => (
                <li
                  key={day.id}
                  onClick={() =>
                    dispatch(
                      onSetSelectedDay({
                        ...day,
                        // total: totalDays,
                      })
                    )
                  }
                  className={classNamesAdapter(
                    "p-4 rounded-lg cursor-pointer text-sm md:text-base",
                    selectedDay?.id === day.id
                      ? "bg-primary text-white"
                      : "bg-secondary hover:bg-gray-300"
                  )}
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
      ) : (
        <>
          <Tooltip
            target=".speeddial-bottom-right .p-speeddial-action"
            position="left"
          />
          <SpeedDial
            model={[
              ...(generatedDays?.map((day, index) => ({
                icon: index + 1,
                label: day.date,
                className: classNamesAdapter(
                  selectedDay?.id === day.id
                    ? "bg-primary text-white"
                    : "bg-secondary text-slate-400 hover:bg-gray-300 hover:text-slate-500"
                ),
                command: () =>
                  dispatch(
                    onSetSelectedDay({
                      ...day,
                    })
                  ),
              })) || []),
              {
                icon: "pi pi-plus-circle",
                label: "Agregar Día",
                className: "bg-primary text-white",
                command: handleAddDay,
              },
            ]}
            direction="up"
            // unstyled
            transitionDelay={20}
            showIcon="pi pi-calendar"
            hideIcon="pi pi-times"
            visible={true}
            className="fixed speeddial-bottom-right"
            style={{ right: "1rem", bottom: "1rem" }}
          />
        </>
      )}
    </>
  );
};
