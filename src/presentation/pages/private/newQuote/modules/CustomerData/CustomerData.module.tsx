import { memo, useEffect, useState } from "react";
import { ClientForm, ReservationForm } from "./components";
import {
  DefaultFallBackComponent,
  Dropdown,
  type DropdownChangeEvent,
  ErrorBoundary,
} from "@/presentation/components";
import { ReservationEntity, ReservationStatus } from "@/domain/entities";
import { dateFnsAdapter } from "@/core/adapters";
import { useReservationStore } from "@/infraestructure/hooks";

export const CustomerDataModule = memo(() => {
  const {
    currentReservation,
    startChangingCurrentReservation,
    getAllReservationsByStatusResult: {
      data,
      isLoading: isLoadingGettingReservationsByStatus,
      isFetching,
      error,
    },
    startGettingAllReservationsByStatus,
  } = useReservationStore();
  const [isLoading, setIsLoading] = useState(true);

  const handleReservationChange = (e: DropdownChangeEvent) =>
    startChangingCurrentReservation(e.value);

  useEffect(() => {
    startGettingAllReservationsByStatus(ReservationStatus.PENDING).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <ErrorBoundary
        isLoader={isLoadingGettingReservationsByStatus || isLoading}
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
              loading={isLoading}
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
              refetch={() => {
                startGettingAllReservationsByStatus(ReservationStatus.PENDING);
              }}
              isFetching={isFetching}
              isLoading={isLoadingGettingReservationsByStatus}
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
            options={data?.data || []}
            value={currentReservation}
            onChange={handleReservationChange}
            optionLabel="code"
            placeholder="Seleccione una reserva"
            loading={isLoadingGettingReservationsByStatus}
            valueTemplate={(reservation: ReservationEntity, props) => {
              if (!reservation && !currentReservation)
                return <span>{props.placeholder}</span>;
              return (
                <ItemTemplate reservation={reservation || currentReservation} />
              );
            }}
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
      {reservation.client.fullName} - {reservation.code}
    </span>
    <span className="text-sm text-gray-500">
      {dateFnsAdapter.format(reservation.startDate, "yyyy-MM-dd")} hasta{" "}
      {dateFnsAdapter.format(reservation.endDate, "yyyy-MM-dd")} -{" "}
      {reservation.numberOfPeople}{" "}
      {reservation.numberOfPeople > 1 ? "personas" : "persona"}
    </span>
  </div>
);
