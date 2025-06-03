import { cn, dateFnsAdapter } from "@/core/adapters";
import {
  Button,
  Calendar,
  ConfirmDialog,
  SelectButton,
  Skeleton,
  SplitButton,
} from "@/presentation/components";
import { useEffect, useState } from "react";
import { Accommodiations, SidebarDays } from "./components";

import type { AppState } from "@/app/store";
import { constantStorage } from "@/core/constants";
import { tripDetailsDto } from "@/domain/dtos/tripDetails";
import {
  ServiceTripDetailsEntity,
  type CityEntity,
  type HotelRoomTripDetailsEntity,
} from "@/domain/entities";
import {
  onFetchHotelRoomTripDetails,
  onFetchServiceTripDetails,
  onSetSelectedCity,
} from "@/infraestructure/store";
import {
  useDeleteManyHotelRoomTripDetailsMutation,
  useDeleteManyServicesTripDetailsMutation,
  useUpdateManyHotelRoomTripDetailsByDateMutation,
  useUpdateManyServicesTripDetailsByDateMutation,
  useUpsertTripDetailsMutation,
} from "@/infraestructure/store/services";
import { SelectButtonChangeEvent } from "primereact/selectbutton";
import { SelectItem } from "primereact/selectitem";
import { useDispatch, useSelector } from "react-redux";
import { Services } from "./components/services/Services";
import {
  hotelRoomQuotationIdsPerDay,
  servicesQuotationIdsPerDay,
} from "./utils/detailsIds";

const { ITINERARY_CURRENT_ACTIVITY } = constantStorage;

const OPTIONS: SelectItem[] = [
  {
    label: "Servicios",
    icon: "pi pi-cog",
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

export const CostingModule = () => {
  const dispatch = useDispatch();

  const { currentTripDetails } = useSelector(
    (state: AppState) => state.tripDetails
  );

  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const { hotelRoomTripDetails } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );

  const { serviceTripDetails } = useSelector(
    (state: AppState) => state.serviceTripDetails
  );

  const { selectedDay, selectedCity } = useSelector(
    (state: AppState) => state.quotation
  );

  const [upsertTripDetails] = useUpsertTripDetailsMutation();

  const [
    deleteManyHotelRoomTripDetails,
    { isLoading: isDeletingManyHotelRoomTripDetails },
  ] = useDeleteManyHotelRoomTripDetailsMutation();

  const [
    updateManyHotelRoomTripDetails,
    { isLoading: isUpdatingManyHotelRoomTripDetails },
  ] = useUpdateManyHotelRoomTripDetailsByDateMutation();

  const [
    deleteManyServicesTripDetails,
    { isLoading: isDeletingManyServicesTripDetails },
  ] = useDeleteManyServicesTripDetailsMutation();

  const [
    updateManyServicesTripDetails,
    { isLoading: isUpdatingManyServicesTripDetails },
  ] = useUpdateManyServicesTripDetailsByDateMutation();

  const [[startDate, endDate], setDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const [activity, setActivity] = useState<string>(
    localStorage.getItem(ITINERARY_CURRENT_ACTIVITY) || OPTIONS[0].value
  );
  const [
    hotelsQuotationsOutSideDateRange,
    setHotelsQuotationsOutSideDateRange,
  ] = useState<HotelRoomTripDetailsEntity[]>([]);

  const [
    servicesQuotationsOutSideDateRange,
    setServicesQuotationsOutSideDateRange,
  ] = useState<ServiceTripDetailsEntity[]>([]);

  const [isDayDeleted, setIsDayDeleted] = useState<boolean>(false);

  const [{ visible, message, type }, setConfirmDialog] = useState<{
    visible: boolean;
    message?: string;
    type?: "delete" | "updateAndDeleteMany";
  }>({ visible: false, message: "" });

  const handleDelete = () => {
    const hotelRoomQuotationIds = hotelRoomQuotationIdsPerDay(
      selectedDay!,
      hotelRoomTripDetails
    );
    const servicesQuotationIds = servicesQuotationIdsPerDay(
      selectedDay!,
      serviceTripDetails
    );

    if (!startDate || !endDate) return;

    if (hotelRoomQuotationIds.length > 0 && servicesQuotationIds.length > 0) {
      Promise.all([
        deleteManyHotelRoomTripDetails(hotelRoomQuotationIds),
        deleteManyServicesTripDetails(servicesQuotationIds),
      ]).then(() => {
        if (
          dateFnsAdapter.isSameDay(startDate, selectedDay!.date) ||
          dateFnsAdapter.isSameDay(endDate, selectedDay!.date)
        ) {
          setIsDayDeleted(true);
          setConfirmDialog({ visible: false });
        } else {
          if (!currentTripDetails) return;
          Promise.all([
            updateManyHotelRoomTripDetails({
              tripDetailsId: currentTripDetails.id,
              startDate: selectedDay!.date,
            }),
            updateManyServicesTripDetails({
              tripDetailsId: currentTripDetails.id,
              startDate: selectedDay!.date,
            }),
          ]).then(() => {
            setIsDayDeleted(true);
            setConfirmDialog({ visible: false });
          });
        }
      });
    } else if (hotelRoomQuotationIds.length > 0) {
      deleteManyHotelRoomTripDetails(hotelRoomQuotationIds)
        .unwrap()
        .then(() => {
          if (
            dateFnsAdapter.isSameDay(startDate, selectedDay!.date) ||
            dateFnsAdapter.isSameDay(endDate, selectedDay!.date)
          ) {
            setIsDayDeleted(true);
            setConfirmDialog({ visible: false });
          } else {
            if (!currentTripDetails) return;
            updateManyHotelRoomTripDetails({
              tripDetailsId: currentTripDetails.id,
              startDate: selectedDay!.date,
            })
              .unwrap()
              .then(() => {
                setIsDayDeleted(true);
                setConfirmDialog({ visible: false });
              });
          }
        });
    } else if (servicesQuotationIds.length > 0) {
      deleteManyServicesTripDetails(servicesQuotationIds)
        .unwrap()
        .then(() => {
          if (
            dateFnsAdapter.isSameDay(startDate, selectedDay!.date) ||
            dateFnsAdapter.isSameDay(endDate, selectedDay!.date)
          ) {
            setIsDayDeleted(true);
            setConfirmDialog({ visible: false });
          } else {
            if (!currentTripDetails) return;
            updateManyServicesTripDetails({
              tripDetailsId: currentTripDetails.id,
              startDate: selectedDay!.date,
            })
              .unwrap()
              .then(() => {
                setIsDayDeleted(true);
                setConfirmDialog({ visible: false });
              });
          }
        });
    }
  };

  const handleUpdateAfterAnEmptyDay = () => {
    if (!startDate || !endDate) return;

    const emptyDay = selectedDay!.date;

    if (dateFnsAdapter.isSameDay(emptyDay, startDate)) {
      setIsDayDeleted(true);
      return;
    }

    const hotelRoomDetailsAfterCurrentDay = hotelRoomTripDetails.filter(
      (quote) =>
        dateFnsAdapter
          .eachDayOfInterval(emptyDay, endDate!)
          .some((day) => dateFnsAdapter.isSameDay(day, quote.date))
    );

    const serviceDetailsAfterCurrentDay = serviceTripDetails.filter((quote) =>
      dateFnsAdapter
        .eachDayOfInterval(emptyDay, endDate!)
        .some((day) => dateFnsAdapter.isSameDay(day, quote.date))
    );

    if (
      hotelRoomDetailsAfterCurrentDay.length > 0 &&
      serviceDetailsAfterCurrentDay.length > 0
    ) {
      Promise.all([
        updateManyHotelRoomTripDetails({
          tripDetailsId: currentTripDetails!.id,
          startDate: emptyDay,
        }),
        updateManyServicesTripDetails({
          tripDetailsId: currentTripDetails!.id,
          startDate: emptyDay,
        }),
      ]).then(() => {
        setIsDayDeleted(true);
      });
    } else if (hotelRoomDetailsAfterCurrentDay.length > 0) {
      updateManyHotelRoomTripDetails({
        tripDetailsId: currentTripDetails!.id,
        startDate: emptyDay,
      })
        .unwrap()
        .then(() => {
          setIsDayDeleted(true);
        });
    } else if (serviceDetailsAfterCurrentDay.length > 0) {
      updateManyServicesTripDetails({
        tripDetailsId: currentTripDetails!.id,
        startDate: emptyDay,
      })
        .unwrap()
        .then(() => {
          setIsDayDeleted(true);
        });
    } else {
      setIsDayDeleted(true);
    }
  };

  const handleUpsertTripDetails = async ([startDate, endDate]: [
    Date,
    Date
  ]) => {
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
  };

  const handleDeleteManyDays = () => {
    if (!startDate || !endDate) return;
    handleUpsertTripDetails([startDate, endDate]).then(() => {
      if (
        hotelsQuotationsOutSideDateRange.length > 0 &&
        servicesQuotationsOutSideDateRange.length > 0
      ) {
        Promise.all([
          deleteManyHotelRoomTripDetails(
            hotelsQuotationsOutSideDateRange.map((quote) => quote.id)
          ),
          deleteManyServicesTripDetails(
            servicesQuotationsOutSideDateRange.map((quote) => quote.id)
          ),
        ]).then(() => {
          setConfirmDialog({ visible: false });
        });
      } else if (servicesQuotationsOutSideDateRange.length > 0) {
        deleteManyServicesTripDetails(
          servicesQuotationsOutSideDateRange.map((quote) => quote.id)
        )
          .unwrap()
          .then(() => {
            setConfirmDialog({ visible: false });
          });
      } else if (hotelsQuotationsOutSideDateRange.length > 0) {
        deleteManyHotelRoomTripDetails(
          hotelsQuotationsOutSideDateRange.map((quote) => quote.id)
        )
          .unwrap()
          .then(() => {
            setConfirmDialog({ visible: false });
          });
      }
    });
  };

  useEffect(() => {
    if (currentTripDetails?.cities && !selectedCity) {
      dispatch(onSetSelectedCity(currentTripDetails.cities[0]));
    }
  }, [currentTripDetails]);

  useEffect(() => {
    if (currentTripDetails) {
      setDateRange([currentTripDetails.startDate, currentTripDetails.endDate]);
    }
  }, [currentTripDetails]);

  useEffect(() => {
    localStorage.setItem(ITINERARY_CURRENT_ACTIVITY, activity);
  }, [activity]);

  useEffect(() => {
    dispatch(
      onFetchHotelRoomTripDetails(
        isUpdatingManyHotelRoomTripDetails || isDeletingManyHotelRoomTripDetails
      )
    );
  }, [isUpdatingManyHotelRoomTripDetails, isDeletingManyHotelRoomTripDetails]);

  useEffect(() => {
    dispatch(
      onFetchServiceTripDetails(
        isUpdatingManyServicesTripDetails || isDeletingManyServicesTripDetails
      )
    );
  }, [isUpdatingManyServicesTripDetails, isDeletingManyServicesTripDetails]);

  return (
    <div className="w-full h-full">
      <ConfirmDialog
        group="declarative"
        visible={visible}
        onHide={() => setConfirmDialog({ visible: false, message })}
        message={message}
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        className="max-w-lg"
        acceptLabel="Sí"
        accept={type === "delete" ? handleDelete : handleDeleteManyDays}
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
              currentTripDetails?.cities?.map((city: CityEntity) => ({
                label: city.name,
                command: () => {
                  dispatch(onSetSelectedCity(city));
                },
                className: cn(
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
              if (e.value![0] && e.value![1]) {
                const daysToDelete = hotelRoomTripDetails.filter(
                  (quote) =>
                    !dateFnsAdapter.isWithinInterval(
                      quote.date,
                      e.value![0]!,
                      e.value![1]!
                    )
                );

                const daysToDeleteServices = serviceTripDetails.filter(
                  (quote) =>
                    !dateFnsAdapter.isWithinInterval(
                      quote.date,
                      e.value![0]!,
                      e.value![1]!
                    )
                );
                if (
                  daysToDelete.length > 0 ||
                  daysToDeleteServices.length > 0
                ) {
                  setConfirmDialog({
                    visible: true,
                    message:
                      "¿Estás seguro de cambiar la fecha de la reserva?, se eliminarán los días que no estén dentro del rango de fechas.",
                    type: "updateAndDeleteMany",
                  });
                  setHotelsQuotationsOutSideDateRange(daysToDelete);
                  setServicesQuotationsOutSideDateRange(daysToDeleteServices);
                } else {
                  handleUpsertTripDetails(e.value as [Date, Date]);
                }
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
                    <h2 className="text-2xl sm:text-4xl font-bold text-tertiary inline me-3">
                      {selectedDay?.name} - {selectedCity?.name}
                    </h2>

                    <p className="max-sm:text-sm text-primary">
                      {selectedDay?.formattedDate}
                    </p>
                  </div>

                  {selectedDay && selectedDay.total > 1 && (
                    <Button
                      disabled={isDeletingManyHotelRoomTripDetails}
                      icon="pi pi-trash"
                      className="mb-auto"
                      loading={!selectedDay}
                      onClick={() => {
                        const details = hotelRoomTripDetails
                          .concat(serviceTripDetails)
                          .find((detail) =>
                            dateFnsAdapter.isSameDay(
                              detail.date,
                              selectedDay.date
                            )
                          );

                        if (details) {
                          setConfirmDialog({
                            visible: true,
                            message:
                              "¿Estás seguro de eliminar el día seleccionado?",
                            type: "delete",
                          });
                        } else {
                          handleUpdateAfterAnEmptyDay();
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
                itemTemplate={(option) => (
                  <span className="max-sm:text-xs flex flex-col sm:flex-row font-bold justify-center mx-auto gap-x-2 items-center">
                    <i className={`${option.icon}`}></i>
                    <span>{option.label}</span>
                  </span>
                )}
                options={OPTIONS}
              />

              {/* Content */}
              {activity === "services" && <Services />}

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
