import type { ReservationEntity } from "@/domain/entities";
import { useDeleteMultipleReservationsMutation } from "@/infraestructure/store/services";
import { ConfirmDialog } from "@/presentation/components";

type Props = {
  selectedReservations: ReservationEntity[];
  setSelectedReservations: (selectedReservations: ReservationEntity[]) => void;
  visible: boolean;
  onHide: (visible: boolean) => void;
};

export const DeleteConfirmReservationDialog = ({
  selectedReservations,
  setSelectedReservations,
  visible,
  onHide,
}: Props) => {
  const [handleDeleteMultipleReservations] =
    useDeleteMultipleReservationsMutation();

  const handleDeleteReservations = async () => {
    if (selectedReservations.length === 0) return;
    await handleDeleteMultipleReservations(
      selectedReservations.map((reservation) => reservation.id)
    )
      .unwrap()
      .then(() => {
        setSelectedReservations([]);
        onHide(false);
      });
  };

  return (
    <ConfirmDialog
      group="declarative"
      className="max-w-md"
      visible={visible}
      onHide={() => onHide(false)}
      accept={handleDeleteReservations}
      reject={() => onHide(false)}
      icon="pi pi-exclamation-triangle"
      acceptLabel="Sí"
      message={`¿Está seguro que desea eliminar las siguientes reservas: ${selectedReservations
        .map((reservation) => reservation.id)
        .join(
          ", "
        )}? Porque las cotizaciones que están relacionadas se eliminaran también, junto con sus versiones.`}
    />
  );
};
