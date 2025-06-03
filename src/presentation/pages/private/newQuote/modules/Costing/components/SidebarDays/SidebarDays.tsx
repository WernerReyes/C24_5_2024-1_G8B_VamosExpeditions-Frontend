import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import { type Day, onSetDays, onSetSelectedDay } from "@/infraestructure/store";
import { useUpsertTripDetailsMutation } from "@/infraestructure/store/services";
import { Button, SpeedDial, Tooltip } from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { measureExecutionTime } from "@/core/utils";
import { DaySkeleton } from "./components/DaySkeleton";
import { Day as DayComponent } from "./components/Day";
import { tripDetailsDto } from "@/domain/dtos/tripDetails";
import { cn } from "@/core/adapters";

type Props = {
  setIsDayDeleted: (isDayDeleted: boolean) => void;
  isDayDeleted: boolean;
};

export const SidebarDays = ({ isDayDeleted, setIsDayDeleted }: Props) => {
  const dispatch = useDispatch();
  const { MACBOOK, width } = useWindowSize();

  const { selectedDay } = useSelector((state: AppState) => state.quotation);

  const { currentTripDetails } = useSelector(
    (state: AppState) => state.tripDetails
  );

  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const { isFetchingHotelRoomTripDetails } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );

  const { isFetchingServiceTripDetails } = useSelector(
    (state: AppState) => state.serviceTripDetails
  );

  const [upsertTripDetails] = useUpsertTripDetailsMutation();

  const [contentLoading, setContentLoading] = useState<boolean>(true);
  const [[startDate, endDate], setDaysRange] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const [generatedDays, setGeneratedDays] = useState<Day[]>();
  const [lastItineraryDate, setLastItineraryDate] = useState<Date>();
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  const [isDeletingDay, setIsDeletingDay] = useState<boolean>(false);

  const handleUpdateTripDetails = async (startDate: Date, endDate: Date) => {
    try {
      if (!currentTripDetails) return;
      await upsertTripDetails({
        tripDetailsDto: {
          ...tripDetailsDto.parse({
            ...currentTripDetails,
            startDate,
            endDate,
          }),
          versionQuotationId: currentVersionQuotation!.id,
        },
        showMessage: false,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleAddDay = () => {
    if (generatedDays) {
      lastItineraryDate?.setDate(lastItineraryDate.getDate() + 1);

      // //* Update reservation travel dates
      handleUpdateTripDetails(startDate!, lastItineraryDate!);
      const newDay: Day = {
        id: generatedDays.length + 1,
        number: generatedDays.length + 1,
        name: `Día ${generatedDays.length + 1}`,
        date: lastItineraryDate!,
        formattedDate: lastItineraryDate!.toLocaleDateString("es-ES", {
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
    if (currentTripDetails) {
      setDaysRange([
        new Date(currentTripDetails.startDate),
        new Date(currentTripDetails.endDate),
      ]);
    }
  }, [currentTripDetails]);

  useEffect(() => {
    if (generatedDays) {
      dispatch(onSetDays(generatedDays));
    }
  }, [generatedDays]);

  useEffect(() => {
    if (startDate && endDate) {
      const { result: days, executionTime } = measureExecutionTime(function () {
        const daysNumber =
          Math.abs(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;
        const days: Day[] = Array.from({ length: daysNumber }, (_, index) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + index);

          setLastItineraryDate(date);
          return {
            id: index + 1,
            number: index + 1,
            name: `Día ${index + 1}`,
            date,
            formattedDate: date.toLocaleDateString("es-ES", {
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
    if (currentTripDetails && generatedDays && !isDeletingDay) {
      dispatch(
        onSetSelectedDay(
          generatedDays.find((day) => day.number === selectedDay?.number) ||
            generatedDays[0]
        )
      );
    }
  }, [currentTripDetails, generatedDays, isDeletingDay]);

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
      let previousDate = newDays[0].date;

      for (let i = 0; i < newDays.length; i++) {
        if (i === 0) {
          //* The first day is not adjusted
          previousDate.setDate(previousDate.getDate());

          //* Update the first day's date in the reservation
          handleUpdateTripDetails(previousDate, endDate!);
        }

        newDays[i] = {
          ...newDays[i],
          id: i + 1,
          name: `Día ${i + 1}`,
          number: i + 1,
          date: previousDate,
          formattedDate: previousDate.toLocaleDateString("es-ES", {
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
          let previousDate = newDays[i].date;
          previousDate.setDate(previousDate.getDate() - 1);

          newDays[i] = {
            ...newDays[i],
            id: i + 1,
            name: `Día ${i + 1}`,
            number: i + 1,
            date: previousDate,
            formattedDate: previousDate.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          };
        }
      }

      //* Update the rest of the days' dates in the reservation
      handleUpdateTripDetails(
        startDate!,
        newDays.length > 0 ? newDays[newDays.length - 1].date : startDate!
      );
    }

    //* Update reservation travel dates
    setLastItineraryDate(
      newDays.length > 0 ? newDays[newDays.length - 1].date : startDate!
    );

    //* Update the selected day
    let newDaySelected: Day | undefined;
    if (newDays.length === 0) {
      const date = {
        id: 1,
        name: "Día 1",
        number: 1,
        date: startDate!,
        formattedDate: startDate!.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        total: 1,
      };
      newDaySelected = date;
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
            {contentLoading ||
            isFetchingHotelRoomTripDetails ||
            isFetchingServiceTripDetails ? (
              <DaySkeleton length={generatedDays?.length || 5} />
            ) : (
              <DayComponent />
            )}
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
                label: day.formattedDate,
                className: cn(
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
