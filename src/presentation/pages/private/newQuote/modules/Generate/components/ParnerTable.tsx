import type { AppState } from "@/app/store";
import type { PartnerEntity } from "@/domain/entities";
import {
  Column,
  DataTable,
  Dropdown,
  InputNumber,
} from "@/presentation/components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  setParner: (parner: PartnerEntity | undefined) => void;
  setComission: (salesPrice: number) => void;
};

const PARNERS: PartnerEntity[] = [
  { name: "Vamos Expeditions", id: 1 },
  { name: "Travel Local", id: 2 },
];

export const ParnerTable = ({
  setParner,

  setComission,
}: Props) => {
  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const { hotelRoomTripDetailsWithTotalCost } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );
  const [selectedPartner, setSelectedPartner] = useState<PartnerEntity>(
    currentVersionQuotation?.partner || PARNERS[0]
  );
  const [commission, setCommission] = useState<number>(
    currentVersionQuotation?.commission ?? 3
  );

  useEffect(() => {
    setParner(selectedPartner);
  }, [selectedPartner]);

  useEffect(() => {
    setComission(selectedPartner.id === 1 ? 0 : commission);
  }, [commission, selectedPartner]);
  
  
  return (
    <DataTable
      value={hotelRoomTripDetailsWithTotalCost.slice(0, 1)}
      className="w-full border-collapse mb-5 font-bold"
      header="Selección de parner"
    >
      <Column
        headerClassName=" max-sm:text-xs max-md:text-sm"
        header="Parners"
        className="max-sm:text-xs max-md:text-sm text-center min-w-48"
        body={() => (
          <>
            <Dropdown
              options={PARNERS}
              value={selectedPartner}
              useOptionAsValue
              onChange={(e) => setSelectedPartner(e.value)}
              placeholder="Seleccione"
              className="w-full"
              optionLabel="name"
              optionValue="id"
              checkmark
            />
          </>
        )}
      />
      <Column
        headerClassName=" max-sm:text-xs max-md:text-sm"
        className="max-sm:text-xs max-md:text-sm"
        field="totalCost"
        header="Porcentaje de comisión (3% - 20%)"
        body={() => (
          <InputNumber
            disabled={selectedPartner.id === 1}
            prefix="%"
            inputClassName="w-full"
            className="w-full"
            placeholder="0%"
            onChange={(e) => setCommission(e.value ?? 0)}
            value={commission}
            showButtons
            min={3}
            max={20}
          />
        )}
      />
    </DataTable>
  );
};
