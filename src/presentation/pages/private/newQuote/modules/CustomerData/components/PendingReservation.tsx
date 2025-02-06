import { dateFnsAdapter } from "@/core/adapters";
import type { ReservationEntity } from "@/domain/entities";

type Props = {
  reservation: ReservationEntity;
};

export const PendingReservation = ({ reservation }: Props) => {
  return (
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
};
