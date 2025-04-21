import { /* HotelEntity, */ HotelRoomEntity } from "@/domain/entities";
import { Button } from "@/presentation/components";
import { useState } from "react";
import { RoomEditAndRegisterModal } from "./RoomEditAndRegisterModal";

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


  return (
    <div className="space-x-1">
      <Button
        icon="pi pi-pen-to-square text-sm"
        rounded
        text
        onClick={() => setModalOpen(true)}
      />

      <Button rounded text icon="pi pi-trash text-sm" severity="danger" />

      <RoomEditAndRegisterModal
        showModal={isModalOpen}
        setShowModal={setModalOpen}
        rowData={rowData}
      />
    </div>
  );
};
