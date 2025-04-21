import { HotelEntity } from "@/domain/entities";
import { Button} from "@/presentation/components";
import { useState } from "react";
import { HotelEditAndRegisterModal } from "./HotelEditAndRegisterModal";

type TyoeTableActions = {
  rowData: HotelEntity;
};

export const TableActions = ({ rowData }: TyoeTableActions) => {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <div className="space-x-1">
      <Button
        icon="pi pi-pen-to-square text-xl"
        rounded
        text
        onClick={() => setModalOpen(true)}
      />

      <Button rounded text icon="pi pi-trash text-xl" severity="danger" />

      <HotelEditAndRegisterModal
        showModal={isModalOpen}
        setShowModal={setModalOpen}
        rowData={rowData}
      />
    </div>
  );
};
