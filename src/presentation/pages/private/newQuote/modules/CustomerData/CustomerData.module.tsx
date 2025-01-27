import { memo, useEffect } from "react";
import { ClientForm, ReservationForm } from "./components";
import {
  DefaultFallBackComponent,
  Dropdown,
  type DropdownChangeEvent,
  ErrorBoundary,
} from "@/presentation/components";
import { ReservationStatus, ReservationEntity } from "@/domain/entities";
import { dateFnsAdapter } from "@/core/adapters";

import {
  useGetAllReservationsQuery,
  useUpdateVersionQuotationMutation,
  useUpsertReservationMutation,
} from "@/infraestructure/store/services";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/app/store";
import { versionQuotationDto } from "@/domain/dtos/versionQuotation";
import { onSetCurrentReservation } from "@/infraestructure/store";
import { reservationDto } from "@/domain/dtos/reservation";

export const CustomerDataModule = memo(() => {
  const dispatch = useDispatch();

  const { currentReservation, reservations } = useSelector(
    (state: AppState) => state.reservation
  );
  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const [updateVersionQuotation] = useUpdateVersionQuotationMutation();
  const [upsertReservation] = useUpsertReservationMutation();
  const {
    isLoading: isGettingAllReservations,
    isFetching,
    error,
    refetch,
  } = useGetAllReservationsQuery(
    {
      status: ReservationStatus.PENDING,
      quotationId: currentVersionQuotation?.id.quotationId!,
      versionNumber: currentVersionQuotation?.id.versionNumber!,
    },
    {
      skip: !currentVersionQuotation,
    }
  );

  const handleReservationChange = async (e: DropdownChangeEvent) => {
    if (!e.value) return;
    const reservation = e.value as ReservationEntity;
    if (currentVersionQuotation && reservation) {
      await updateVersionQuotation(
        versionQuotationDto.parse({
          ...currentVersionQuotation,
          reservation,
        })
      )
        .unwrap()
        .then(async() => {
          await upsertReservation({
            reservationDto: reservationDto.parse({
              ...reservation,
              status: ReservationStatus.ACTIVE,
            }),
            setCurrentReservation: true,
            showMessage: false,
          });
          await upsertReservation({
            reservationDto: reservationDto.parse({
              ...currentReservation!,
              status: ReservationStatus.PENDING,
              
            }),
            setCurrentReservation: false,
            showMessage: false,
          });
          // dispatch(onSetCurrentReservation(reservation));
        });
    }
  };

  // useEffect(() => {
  //   if (currentVersionQuotation) {
  //     updateVersionQuotation(
  //       versionQuotationDto().parse({
  //         ...currentVersionQuotation,
  //         reservation: currentReservation ?? undefined,
  //       })
  //     );
  //   }
  // }, [currentReservation]);

  // useEffect(() => {
  //   if (selectedClient && currentReservation) {
  //     dispatch(
  //       onSetCurrentReservation({
  //         ...currentReservation,
  //         client: selectedClient,
  //       })
  //     );
  //   }
  // }, [selectedClient]);

  return (
    <>
      <ErrorBoundary
        isLoader={isGettingAllReservations}
        loadingComponent={
          <div className="font-bold flex flex-col gap-2 mb-5">
            <Dropdown
              label={{
                text: "Reservas pendientes",
                htmlFor: "reservation",
              }}
              skeleton={{
                height: "4rem",
              }}
              loading={isFetching}
              options={[]}
              className="container"
            />
          </div>
        }
        fallBackComponent={
          <div className="mb-5">
            <label className="font-bold text-gray-700" htmlFor="reservation">
              Reservas pendientes
            </label>
            <DefaultFallBackComponent
              refetch={refetch}
              isFetching={isFetching}
              isLoading={isGettingAllReservations}
              message="No se pudo cargar la lista de reservas pendientes"
            />
          </div>
        }
        error={!!error}
      >
        <div className="font-bold flex flex-col gap-2 mb-5">
          <Dropdown
            label={{
              text: "Reservas pendientes",
              htmlFor: "reservation",
            }}
            options={reservations}
            value={currentReservation}
            onChange={handleReservationChange}
            placeholder="Seleccione una reserva"
            loading={isGettingAllReservations}
            highlightOnSelect
            emptyMessage="No hay reservas pendientes"
            valueTemplate={(reservation: ReservationEntity, props) => {
              if (!reservation && !currentReservation)
                return <span>{props.placeholder}</span>;
              return (
                <ItemTemplate reservation={reservation || currentReservation} />
              );
            }}
            checkmark
            itemTemplate={(reservation: ReservationEntity) => (
              <ItemTemplate reservation={reservation} />
            )}
          />
        </div>
      </ErrorBoundary>
      <div className="flex flex-col xl:flex-row gap-4">
        <ClientForm />
        <ReservationForm />
      </div>
    </>
  );
});

const ItemTemplate = ({ reservation }: { reservation: ReservationEntity }) => (
  <div className="flex flex-col">
    <span className="font-medium">
      {reservation.client?.fullName} - {reservation.code}
    </span>
    <span className="text-sm text-gray-500">
      {dateFnsAdapter.format(reservation.startDate, "yyyy-MM-dd")} hasta{" "}
      {dateFnsAdapter.format(reservation.endDate, "yyyy-MM-dd")} -{" "}
      {reservation.numberOfPeople}{" "}
      {reservation.numberOfPeople > 1 ? "personas" : "persona"}
    </span>
  </div>
);
