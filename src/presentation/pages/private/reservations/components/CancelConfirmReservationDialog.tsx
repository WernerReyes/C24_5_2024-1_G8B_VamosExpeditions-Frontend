import type { ReservationEntity } from "@/domain/entities";
import { useCancelReservationMutation } from "@/infraestructure/store/services";
import { ConfirmDialog } from "@/presentation/components";

type Props = {
  cancelReservation: ReservationEntity | null;
  setCancelReservation: (cancelReservation: ReservationEntity | null) => void;
};

export const CancelConfirmReservationDialog = ({
  cancelReservation,
  setCancelReservation,
}: Props) => {
  const [handleCancelReservation] = useCancelReservationMutation();
  const handleConfirmCancelReservation = async () => {
    if (!cancelReservation) return;
    await handleCancelReservation(cancelReservation.id);
    setCancelReservation(null);
  };

  return (
    <ConfirmDialog
      group="declarative"
      className="max-w-md"
      visible={cancelReservation !== null}
      onHide={() => setCancelReservation(null)}
      accept={handleConfirmCancelReservation}
      reject={() => setCancelReservation(null)}
      icon="pi pi-exclamation-triangle"
      acceptLabel="Sí"
      message="¿Está seguro que desea cancelar la reserva?, porque la cotización que está relacionada se cancelará también."
    />
  );
};
