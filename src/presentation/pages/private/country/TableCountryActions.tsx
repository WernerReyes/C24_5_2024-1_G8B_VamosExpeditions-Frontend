import { CountryEntity } from "@/domain/entities";
import { Button } from "@/presentation/components";
import { useState } from "react";
import { CityEditAndRegisterModal } from "./city/CityEditAndRegisterModal";
import { CountryEditAndRegisterModal } from "./CountryEditAndRegisterModal";

type Props = {
  rowData: CountryEntity;
};

export const TableCountryActions = ({ rowData }: Props) => {
  const [isCityNewModalOpen, setCityNewModalOpen] = useState(false);
  const [isCountryEditModalOpen, setCountryEditModalOpen] = useState(false);
  const [rowDataCity, setRowDataCity] = useState<CountryEntity>(
    {} as CountryEntity
  );

  return (
    <>
      <div className="flex gap-2 justify-end">
        <Button
          icon="pi pi-plus"
          rounded
          className="h-9 w-9 bg-gradient-to-r from-emerald-500 to-teal-500  hover:from-emerald-600  hover:to-green-600text-white border-none shadow-md shadow-blue-200 transition-all duration-300"
          tooltip="Agregar ciudad"
          tooltipOptions={{ position: "top" }}
          onClick={() => {
            setRowDataCity({} as CountryEntity);
            setCityNewModalOpen(true);
          }}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          className="h-9 w-9 bg-gradient-to-r from-amber-400 to-orange-400  hover:from-amber-500  hover:to-orange-500 text-white border-none shadow-md shadow-amber-200 transition-all duration-300"
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}
          onClick={() => {
            setCountryEditModalOpen(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          className="h-9 w-9 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600  hover:to-red-600 text-white   border-none shadow-md   shadow-rose-200   transition-all duration-300"
          tooltip="Eliminar"
          tooltipOptions={{ position: "top" }}
          onClick={() => {}}
        />

        <CountryEditAndRegisterModal
          showModal={isCountryEditModalOpen}
          setShowModal={setCountryEditModalOpen}
          rowData={{
            id: rowData.id,
            name: rowData.name,
            code: rowData.code,
          }}
        />
      </div>

      <CityEditAndRegisterModal
        rowData={
          {
            id: rowData.id,
            name: rowData.name,
            code: rowData.code,
            cities: rowDataCity.cities,
          }
        }
        showModal={isCityNewModalOpen}
        setShowModal={setCityNewModalOpen}
      />
      {/* end new city */}
    </>
  );
};
