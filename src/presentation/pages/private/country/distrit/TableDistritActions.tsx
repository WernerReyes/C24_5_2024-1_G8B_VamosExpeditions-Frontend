import { CityEntity } from "@/domain/entities";
import { Button } from "@/presentation/components";
import { useState } from "react";
import { DistritEditAndRegisterModal } from "./DistritEditAndRegisterModal";

type TyoeTableActions = {
  rowData: CityEntity;
  county: {
    id: number;
    name: string;
  };
};

export const TableDistritActions = ({ rowData,county }: TyoeTableActions) => {
  const [isDistritEditModalOpen, setDistritEditModalOpen] = useState(false);
  return (
    <div className="flex gap-1 justify-end">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="secondary"
        className="h-8 w-8 text-amber-500 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
        tooltip="Editar"
        tooltipOptions={{ position: "top" }}
        onClick={() => {
          setDistritEditModalOpen(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="secondary"
        className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors duration-200"
        tooltip="Eliminar"
        tooltipOptions={{ position: "top" }}
      />

      <DistritEditAndRegisterModal
        showModal={isDistritEditModalOpen}
        setShowModal={setDistritEditModalOpen}
        rowData={rowData}
        country={{
            id: county.id,
            name: county.name,
        }}
      />
    </div>
  );
};
