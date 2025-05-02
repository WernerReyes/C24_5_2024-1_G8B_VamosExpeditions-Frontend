import { useState } from "react";
import { MoveToTrash } from "../../components";
import { useTrashReservationMutation } from "@/infraestructure/store/services";
import type { ReservationEntity } from "@/domain/entities";

type Props = {
  reservation: ReservationEntity;
};

export const TrashReservation = ({ reservation }: Props) => {
  const [trashReservation, { isLoading }] = useTrashReservationMutation();

  const [deleteReason, setDeleteReason] = useState<string | undefined>(
    undefined
  );

  const handleTrashReservation= async () => {
    await trashReservation({
      id: reservation.id,
      deleteReason,
    }).unwrap();

    setDeleteReason(undefined);
  };

  return (
    <MoveToTrash
      disabled={isLoading}
      handleTrash={handleTrashReservation}
      handleVerifyBeforeTrash={() => new Promise<void>((resolve) => resolve())}
      setCurrentDeleteReason={setDeleteReason}
    />
  );
};
