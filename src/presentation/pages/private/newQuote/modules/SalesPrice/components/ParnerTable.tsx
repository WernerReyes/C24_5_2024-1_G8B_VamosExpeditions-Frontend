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
  setParner: (parner: PartnerEntity | null) => void;
  setComission: (salesPrice: number | null) => void;
};

const PARNERS: PartnerEntity[] = [{ name: "Travel Local", id: 1 }];

export const ParnerTable = ({
  setParner,

  setComission,
}: Props) => {
  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const [selectedPartner, setSelectedPartner] = useState<PartnerEntity | null>(
    null
  );
  const [commission, setCommission] = useState<number>(3);

  useEffect(() => {
    setSelectedPartner(currentVersionQuotation?.partner ?? null);
    setCommission(currentVersionQuotation?.commission ?? 3);
  }, [currentVersionQuotation]);

  useEffect(() => {
    if (!selectedPartner) {
      setParner(null);
      setComission(null);
      return;
    }
    setParner(selectedPartner);
    setComission(commission);
  }, [selectedPartner, commission]);

  return (
    <DataTable
      value={Array.from({ length: 1 })}
      className="w-full border-collapse mb-5 font-bold"
      header="Selección de parner"
    >
      <Column
        headerClassName=" max-sm:text-xs max-md:text-sm"
        header="Parners"
        className="max-sm:text-xs max-md:text-sm text-center min-w-48"
        body={() => (
          <Dropdown
            options={PARNERS}
            value={selectedPartner}
            useOptionAsValue
            onChange={(e) => setSelectedPartner(e.value)}
            placeholder="Seleccione"
            className="w-full"
            optionLabel="name"
            showClear
            checkmark
          />
        )}
      />
      <Column
        headerClassName=" max-sm:text-xs max-md:text-sm"
        className="max-sm:text-xs max-md:text-sm"
        field="totalCost"
        header="Porcentaje de comisión (3% - 20%)"
        body={() => (
          <InputNumber
            disabled={!selectedPartner}
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
