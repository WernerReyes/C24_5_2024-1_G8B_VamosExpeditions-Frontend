import { classNamesAdapter, dateFnsAdapter } from "@/core/adapters";
import {
  Button,
  Calendar,
  ConfirmDialog,
  Menu,
  MenuItem,
  type MenuRef,
  SelectButton,
  Skeleton,
  SplitButton,
} from "@/presentation/components";
import { useEffect, useMemo, useRef, useState } from "react";
import { SidebarDays, Accommodiations } from "./components";

import type { AppState } from "@/app/store";
import { reservationDto } from "@/domain/dtos/reservation";
import type { CityEntity } from "@/domain/entities";
import {
  onFetchHotelRoomQuotations,
  onSetHotels,
} from "@/infraestructure/store";
import {
  useDeleteManyHotelRoomQuotationsMutation,
  useGetHotelsQuery,
  useUpdateManyHotelRoomQuotationsByDateMutation,
  useUpsertReservationMutation,
} from "@/infraestructure/store/services";
import { useDispatch, useSelector } from "react-redux";
import { constantStorage } from "@/core/constants";
import { SelectItem } from "primereact/selectitem";
import { SelectButtonChangeEvent } from "primereact/selectbutton";

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

export const CostingModule = () => {
  const dispatch = useDispatch();
  
  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const { currentReservation } = useSelector(
    (state: AppState) => state.reservation
  );


  const { hotelRoomQuotations } = useSelector(
    (state: AppState) => state.hotelRoomQuotation
  );

  const { selectedDay } = useSelector((state: AppState) => state.quotation);

  const [upsertReservation] = useUpsertReservationMutation();

  const [
    deleteManyHotelRoomQuotations,
    { isLoading: isDeletingManyHotelRoomQuotations },
  ] = useDeleteManyHotelRoomQuotationsMutation();

  const [
    updateManyHotelRoomQuotations,
    { isLoading: isUpdatingManyHotelRoomQuotations },
  ] = useUpdateManyHotelRoomQuotationsByDateMutation();

  const [[startDate, endDate], setDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const [selectedCity, setSelectedCity] = useState<CityEntity | undefined>(
    undefined
  );

  const { data: hotels } = useGetHotelsQuery(
    {
      cityId: selectedCity?.id,
    },
    {
      skip: !selectedCity,
    }
  );

  const [activity, setActivity] = useState<string>(
    localStorage.getItem(ITINERARY_CURRENT_ACTIVITY) || OPTIONS[0].value
  );
  const [visible, setVisible] = useState<boolean>(false);
  const [isDayDeleted, setIsDayDeleted] = useState<boolean>(false);

  const menuLeft = useRef<MenuRef>(null);

  const handleAccept = () => {
    const { startDate, endDate } = currentReservation!;
    if (hotelRoomQuotationIdsPerDay.length > 0) {
      deleteManyHotelRoomQuotations(hotelRoomQuotationIdsPerDay).then(() => {
        if (
          dateFnsAdapter.isSameDay(startDate, selectedDay!.date) ||
          dateFnsAdapter.isSameDay(endDate, selectedDay!.date)
        ) {
          setIsDayDeleted(true);
          setVisible(false);
        } else {
          updateManyHotelRoomQuotations({
            versionQuotationId: currentVersionQuotation!.id,
            startDate: selectedDay!.date,
          }).then(() => {
            setIsDayDeleted(true);
            setVisible(false);
          });
        }
      });
    }
  };

  const handleUpsertReservation = ([startDate, endDate]: [
    Date | null,
    Date | null
  ]) => {
    if (startDate && endDate && currentReservation) {
      console.log(hotelRoomQuotations.filter((quote) =>
        !dateFnsAdapter.isWithinInterval(quote.date, startDate, endDate)
      ));
      // upsertReservation({
      //   reservationDto: reservationDto.parse({
      //     ...currentReservation,
      //     startDate,
      //     endDate,
      //   }),
      //   showMessage: false,
      // });
    }
  };

  const hotelRoomQuotationIdsPerDay = useMemo(() => {
    if (selectedDay) {
      return hotelRoomQuotations
        .filter((quote) =>
          dateFnsAdapter.isSameDay(quote.date, selectedDay.date)
        )
        .map((quote) => quote.id);
    }
    return [];
  }, [selectedDay, hotelRoomQuotations]);


  useEffect(() => {
    if (currentReservation?.cities && !selectedCity) {
      setSelectedCity(currentReservation.cities[0]);
    }
  }, [currentReservation]);

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

  useEffect(() => {
    localStorage.setItem(ITINERARY_CURRENT_ACTIVITY, activity);
  }, [activity]);

  useEffect(() => {
    dispatch(
      onFetchHotelRoomQuotations(
        isUpdatingManyHotelRoomQuotations || isDeletingManyHotelRoomQuotations
      )
    );
  }, [isUpdatingManyHotelRoomQuotations, isDeletingManyHotelRoomQuotations]);

  return (
    <div className="w-full">
      <ConfirmDialog
        group="declarative"
        visible={visible}
        onHide={() => setVisible(false)}
        message="¿Estás seguro de eliminar el día seleccionado?"
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        acceptLabel="Sí"
        accept={handleAccept}
        rejectLabel="No"
      />
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-y-4 mb-10">
          <SplitButton
            label={selectedCity ? selectedCity.name : "Seleccionar Región"}
            loading={!selectedCity}
            skeleton={{
              width: "10rem",
            }}
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
            loading={!startDate && !endDate}
            dateFormat="dd/mm/yy"
            showIcon
            skeleton={{
              width: "16rem",
            }}
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

        {/* Itinerary section */}
        <div className="flex flex-col mt-5 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 md:ps-6 order-1 lg:order-2">
            <div className="flex items-center justify-between gap-x-4 mb-4">
              {!selectedDay || !selectedCity ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-x-4">
                    <Skeleton shape="rectangle" width="250px" height="40px" />
                  </div>
                  <div className="flex items-center justify-between gap-x-4">
                    <Skeleton shape="rectangle" width="200px" height="20px" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-0 mt-auto">
                    <h2 className="text-2xl sm:text-4xl font-bold text-tertiary">
                      {selectedDay?.name} - {selectedCity?.name}
                    </h2>
                    <p className="max-sm:text-sm text-primary">
                      {selectedDay?.formattedDate}
                    </p>
                  </div>

                  {selectedDay && selectedDay.total > 1 && (
                    <Button
                      disabled={isDeletingManyHotelRoomQuotations}
                      icon="pi pi-trash"
                      className="mb-auto"
                      loading={!selectedDay}
                      onClick={() => {
                        const existHotelRoomQuotations =
                          hotelRoomQuotations?.find((hotelRoomQuotation) =>
                            dateFnsAdapter.isSameDay(
                              hotelRoomQuotation.date,
                              selectedDay.date
                            )
                          );
                        if (existHotelRoomQuotations) {
                          setVisible(true);
                        } else {
                          setIsDayDeleted(true);
                        }
                      }}
                      aria-label="Delete"
                    />
                  )}
                </>
              )}
            </div>
            <div className="space-y-6">
              {/* Tabs */}

              <SelectButton
                value={activity}
                loading={!selectedDay || !selectedCity}
                onChange={(e: SelectButtonChangeEvent) =>
                  setActivity(e.value ?? activity)
                }
                // className="max-w-[50rem] mx-auto"

                itemTemplate={(option) => (
                  <span className="max-sm:text-xs flex flex-col sm:flex-row font-bold justify-center mx-auto gap-x-2 items-center">
                    <i className={`${option.icon}`}></i>
                    <span>{option.label}</span>
                  </span>
                )}
                // optionValue="value"

                options={OPTIONS}
              />

              {/* Content */}
              {activity === "services" && (
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

              {activity === "accommodation" && <Accommodiations />}
            </div>
          </div>

          {/* Sidebar */}
          <SidebarDays
            isDayDeleted={isDayDeleted}
            setIsDayDeleted={setIsDayDeleted}
          />
        </div>
      </div>
    </div>
  );
};
