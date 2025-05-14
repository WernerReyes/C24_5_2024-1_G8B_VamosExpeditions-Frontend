import {
  type ReservationEntity,
  ReservationStatus,
} from "@/domain/entities/reservation.entity";
import { useGetAllReservationsQuery } from "@/infraestructure/store/services";
import {
  DefaultFallBackComponent,
  ErrorBoundary,
} from "@/presentation/components";
import { ItemSkeleton } from "../ItemSkeleton";
import { EmptyReservations } from "./components/EmptyReservations";
import { ItemReservation } from "./components/ItemReservation";

export const ActiveReserves = () => {
  const { currentData, isError, isLoading, refetch, isFetching } =
    useGetAllReservationsQuery({
      limit: 6,
      page: 1,
      status: [ReservationStatus.ACTIVE],
      select: {
        id: true,
        status: true,
        created_at: true,
        updated_at: true,
        quotation: {
          version_quotation: [
            {
              version_number: true,
              quotation_id: true,

              trip_details: {
                start_date: true,
                end_date: true,

                client: {
                  fullName: true,
                },
                number_of_people: true,
                trip_details_has_city: [
                  {
                    city: {
                      name: true,
                    },
                  },
                ],
              },
              final_price: true,
              user: {
                fullname: true,
              },
            },
          ],
        },
      },
    });

  const reservations = currentData?.data?.content;

  return (
    <>
      <h3 className="text-sm md:text-lg font-bold text-tertiary mb-4">
        Reservas activas
      </h3>
      <ErrorBoundary
        error={isError}
        isLoader={isLoading || isFetching}
        loadingComponent={
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <ItemSkeleton key={index} />
            ))}
          </div>
        }
        fallBackComponent={
          <DefaultFallBackComponent
            isFetching={isFetching}
            isLoading={isLoading}
            message="No se pudieron cargar las reservas activas"
            refetch={refetch}
          />
        }
      >
        <ul className="space-y-3">
          {reservations && reservations.length ? (
            reservations.map((reservation: ReservationEntity) => (
              <ItemReservation key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <EmptyReservations />
          )}
        </ul>
      </ErrorBoundary>
    </>
  );
};
