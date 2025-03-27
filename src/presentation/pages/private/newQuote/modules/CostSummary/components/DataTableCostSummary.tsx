import type { AppState } from "@/app/store";
import {
  onSetIndirectCostMargin
} from "@/infraestructure/store";
import {
  Badge,
  Column,
  DataTable,
  InputText,
  Slider,
} from "@/presentation/components";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCalculateCostsPerService } from "../../../hooks/useCalculateCostsPerService";
import { CostTableEnum } from "../enums/costTable.enum";

export const DataTableCostSummary = () => {
  const dispatch = useDispatch();

  const { indirectCostMargin } = useSelector(
    (state: AppState) => state.quotation
  );

  const { calculateCostsPerService, uniqueHotelRoomTripDetails } =
    useCalculateCostsPerService();

  const columsTable = useMemo(() => {
    return uniqueHotelRoomTripDetails.map((quote) => ({
      header: `${quote.hotelRoom?.hotel?.name}-${quote.hotelRoom?.roomType}`,
      number: quote.number,
    }));
  }, [uniqueHotelRoomTripDetails]);


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
                    value={indirectCostMargin.toString() + "%"}
                  />
                  <Slider
                    value={indirectCostMargin}
                    min={0}
                    max={100}
                    onChange={(e) =>
                      dispatch(onSetIndirectCostMargin(e.value as number))
                    }
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
          body={(rowData, { rowIndex }) => {
            return (
              <div className="font-bold">
                {rowIndex === 0 && (
                  <>
                    ${" "}
                    {rowData.total[column.header]?.serviceCost.toFixed(2) ?? 0}
                  </>
                )}

                {rowIndex === 1 && (
                  <>$ {rowData.total[column.header]?.total.toFixed(2) ?? 0}</>
                )}

                {rowIndex === 2 && (
                  <>
                    $ {rowData.total[column.header]?.directCost.toFixed(2) ?? 0}
                  </>
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
          header={
            <>
              {column.header}
              <Badge className="ms-2 bg-tertiary" value={column.number} />
            </>
          }
        />
      ))}
    </DataTable>
  );
};
