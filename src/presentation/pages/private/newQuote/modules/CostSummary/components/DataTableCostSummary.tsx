import type { AppState } from "@/app/store";
import type { HotelRoomQuotationEntity } from "@/domain/entities";
import { onSetIndirectCostPercentage } from "@/infraestructure/store";
import {
  Column,
  DataTable,
  InputText,
  Slider,
} from "@/presentation/components";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CostTableEnum } from "../enums/costTable.enum";
import type { CostTableType } from "../types/costTable.type";
import { calculateCosts } from "../utils/calculateCosts";

export const DataTableCostSummary = () => {
  const dispatch = useDispatch();

  const { indirectCostPercentage } = useSelector(
    (state: AppState) => state.quotation
  );

  const { hotelRoomQuotations } = useSelector(
    (state: AppState) => state.hotelRoomQuotation
  );

  const uniqueHotelRoomQuotations: HotelRoomQuotationEntity[] = useMemo(() => {
    return hotelRoomQuotations.filter(
      (quote, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.hotelRoom?.hotel?.id === quote.hotelRoom?.hotel?.id &&
            t.hotelRoom?.roomType === quote.hotelRoom?.roomType
        )
    );
  }, [hotelRoomQuotations]);

  const calculateCostsPerService: CostTableType[] = useMemo(() => {
    return calculateCosts(hotelRoomQuotations, indirectCostPercentage);
  }, [hotelRoomQuotations, indirectCostPercentage]);

  const columsTable = useMemo(() => {
    return uniqueHotelRoomQuotations.map((quote) => ({
      field: "total",
      header: `${quote.hotelRoom?.hotel?.name}-${quote.hotelRoom?.roomType}`,
    }));
  }, [uniqueHotelRoomQuotations]);

  return (
    <DataTable
      value={calculateCostsPerService}
      showGridlines
      header="Resumen de Costos"
    >
      <Column
        field="name"
        header="Nombre"
        headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
        className="min-w-24 w-48 max-sm:text-xs max-md:text-sm"
        body={(rowData) => (
          <div>
            {rowData.name !== CostTableEnum.TOTAL_INDIRECT_COSTS ? (
              <div className="font-bold mb-2">{rowData.name}</div>
            ) : (
              <div className="max-md:flex-col flex items-center gap-x-5">
                <div className="font-bold mb-2">Costos Indirectos</div>
                <div className="">
                  <InputText
                    disabled
                    className="p-inputtext-sm w-full"
                    value={indirectCostPercentage.toString() + "%"}
                  />
                  <Slider
                    value={indirectCostPercentage}
                    min={0}
                    max={100}
                    onChange={(e) => {
                      dispatch(onSetIndirectCostPercentage(e.value as number));
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      ></Column>
      {columsTable.map((column, index) => (
        <Column
          key={index}
          headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
          className="max-sm:text-xs max-md:text-sm"
          field={column.field}
          body={(rowData, { rowIndex }) => {
            return (
              <div className="font-bold">
                {rowIndex === 0 && (
                  <>$ {rowData.total[column.header]?.serviceCost.toFixed(2) ?? 0}</>
                )}

                {rowIndex === 1 && (
                  <>$ {rowData.total[column.header]?.total.toFixed(2) ?? 0}</>
                )}

                {rowIndex === 2 && (
                  <>$ {rowData.total[column.header]?.directCost.toFixed(2) ?? 0}</>
                )}
                {rowIndex === 3 && (
                  <>
                    ${" "}
                    {rowData.total[column.header]?.indirectCost.toFixed(2) ?? 0}{" "}
                  </>
                )}

                {rowIndex === 4 && (
                  <strong className="text-primary">
                    $ {rowData.total[column.header]?.totalCost.toFixed(2) ?? 0}{" "}
                  </strong>
                )}
              </div>
            );
          }}
          header={column.header}
        />
      ))}
    </DataTable>
  );
};
