import { HotelEntity } from "@/domain/entities";
import { Button } from "@/presentation/components";
import { useState } from "react";
import { HotelEditAndRegisterModal } from "./HotelEditAndRegisterModal";
import { useTrashHotelMutation } from "@/infraestructure/store/services";
import { MoveToTrash } from "../../components";

type TyoeTableActions = {
  rowData: HotelEntity;
};

export const TableActions = ({ rowData }: TyoeTableActions) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState<string | undefined>();
  const [trashRoom, { isLoading: isLoadingTrashRoom }] = useTrashHotelMutation();
  const handleTrashRoom = async () => {
    await trashRoom({
      id: rowData.id,
      deleteReason: deleteReason,
    }).unwrap();
  };

  return (
    <div className="space-x-1">
      <Button
        icon="pi pi-pen-to-square"
        tooltip="Editar"
        rounded
        text
        onClick={() => setModalOpen(true)}
      />
      <MoveToTrash
        disabled={isLoadingTrashRoom}
        handleTrash={handleTrashRoom}
        handleVerifyBeforeTrash={() =>
          new Promise<void>((resolve) => resolve())
        }
        setCurrentDeleteReason={setDeleteReason}
      />

      <HotelEditAndRegisterModal
        showModal={isModalOpen}
        setShowModal={setModalOpen}
        rowData={rowData}
      />
    </div>
  );
};
