import type { AppState } from "@/app/store";
import { reservationDto } from "@/domain/dtos/reservation";
import { versionQuotationDto } from "@/domain/dtos/versionQuotation";
import { ReservationEntity, ReservationStatus } from "@/domain/entities";
import {
  useGetAllReservationsQuery,
  useUpdateVersionQuotationMutation,
  useUpsertReservationMutation,
} from "@/infraestructure/store/services";
import {
  DefaultFallBackComponent,
  Divider,
  Dropdown,
  type DropdownChangeEvent,
  ErrorBoundary,
} from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { useSelector } from "react-redux";
import { ClientForm, PendingReservation, ReservationForm } from "./components";

export const CustomerDataModule = () => {
  const { width, DESKTOP } = useWindowSize();
  const { currentReservation } = useSelector(
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
    data: reservationsData,
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
        .then(async () => {
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
        });
    }
  };

  return (
    <div className="me-5">
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
              className: "text-lg",
              htmlFor: "reservation",
            }}
            options={reservationsData?.data || []}
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
                <PendingReservation
                  reservation={reservation || currentReservation}
                />
              );
            }}
            checkmark
            itemTemplate={(reservation: ReservationEntity) => (
              <PendingReservation reservation={reservation} />
            )}
          />
        </div>
      </ErrorBoundary>
      <div className="flex flex-col xl:flex-row gap-4 mt-8">
        <div className="flex-1">
          <div className="flex items-center mb-2 gap-x-2 text-lg">
            <i className="pi pi-user text-primary text-xl"></i>
            <h5 className="font-bold ">Datos del cliente</h5>
          </div>
          <ClientForm />
        </div>
        <Divider
          className="my-4"
          layout={width >= DESKTOP ? "vertical" : "horizontal"}
        />
        {/* <ClientForm /> */}
        <div className="flex-[2]">
          <div className="flex items-center mb-2 gap-x-2 text-lg">
            <i className="pi pi-calendar text-primary text-xl"></i>
            <h5 className="font-bold ">Datos de la reserva</h5>
          </div>
          <ReservationForm />
        </div>
      </div>
    </div>
  );
};
