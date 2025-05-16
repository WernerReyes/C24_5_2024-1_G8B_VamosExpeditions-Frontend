import { Button } from "@/presentation/components";
import { CountryEntity } from "../../../../../domain/entities/country.entity";
import { DistritEditAndRegisterModal } from "../distrit/DistritEditAndRegisterModal";
import { useState } from "react";
import { CityEntity } from "@/domain/entities";
import { CityEditAndRegisterModal } from "./CityEditAndRegisterModal";

type Props = {
  rowData: CountryEntity;
};

export const TableCityActions = ({ rowData }: Props) => {
  // start edit city
  const [isCityEditModalOpen, setCityEditModalOpen] = useState(false);
  // end edit city

  // strat new distrit
  const [isDistrictNewModalOpen, setDistrictNewModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<CityEntity>(
    {} as CityEntity
  );
  // end new distrit

  return (
    <>
      <div className="flex gap-1 justify-end">
        <Button
          icon="pi pi-plus"
          rounded
          text
          severity="secondary"
          className="h-8 w-8 text-blue-500 hover:bg-blue-50  hover:text-blue-600   transition-colors    duration-200"
          tooltip="Agregar distrito"
          tooltipOptions={{ position: "top" }}
          onClick={() => {
            setSelectedDistrict({} as CityEntity);
            setDistrictNewModalOpen(true);
          }}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="secondary"
          className="h-8 w-8 text-amber-500 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}
          onClick={() => {
            setCityEditModalOpen(true);
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

        {/* start edit city */}
        <CityEditAndRegisterModal
          rowData={rowData}
          showModal={isCityEditModalOpen}
          setShowModal={setCityEditModalOpen}
        />
        {/* end edit city */}
      </div>

      {/* start new distrit */}
      <DistritEditAndRegisterModal
        showModal={isDistrictNewModalOpen}
        setShowModal={setDistrictNewModalOpen}
        rowData={{
          id: rowData?.cities?.[0]?.id ?? 0,
          name: rowData?.cities?.[0]?.name ?? "",
          distrits: selectedDistrict.distrits,
        }}
        country={{
          id: rowData.id,
          name: rowData.name,
        }}
      />
      {/* end new distrit */}
    </>
  );
};
