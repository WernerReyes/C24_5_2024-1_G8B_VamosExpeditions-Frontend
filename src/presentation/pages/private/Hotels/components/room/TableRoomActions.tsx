import { /* HotelEntity, */ HotelRoomEntity } from "@/domain/entities";
import { Button } from "@/presentation/components";
import { useState } from "react";
import { RoomEditAndRegisterModal } from "./RoomEditAndRegisterModal";
import { useTrashRoomMutation } from "@/infraestructure/store/services";
import { MoveToTrash } from "../../../components";

export type RoomWithHotelInfo = Partial<HotelRoomEntity> & {
  hotels?: {
    id: number;
    name: string;
  };
};

type Props = {
  rowData: RoomWithHotelInfo;
};

export const TableRoomActions = ({ rowData }: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState<string | undefined>();
  const [trashRoom, { isLoading: isLoadingTrashRoom }] = useTrashRoomMutation();

  const handleTrashRoom = async () => {
    

    await trashRoom({
      id: rowData.id ? rowData.id : 0,
      deleteReason: deleteReason,
    }).unwrap();
  };

  return (
    <div className="space-x-1">
      <Button
        icon="pi pi-pen-to-square text-sm"
        rounded
        text
        tooltip="Editar"
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

      <RoomEditAndRegisterModal
        showModal={isModalOpen}
        setShowModal={setModalOpen}
        rowData={rowData}
      />
    </div>
  );
};
