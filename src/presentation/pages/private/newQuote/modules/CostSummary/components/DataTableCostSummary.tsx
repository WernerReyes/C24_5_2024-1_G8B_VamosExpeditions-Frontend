import type { AppState } from "@/app/store";
import { onSetIndirectCostMargin } from "@/infraestructure/store";
import {
  Badge,
  Column,
  DataTable,
  InputNumber,
} from "@/presentation/components";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCalculateCostsPerService } from "../../../hooks/useCalculateCostsPerService";
import { CostTableEnum } from "../enums/costTable.enum";
import { useUpdateVersionQuotationMutation } from "@/infraestructure/store/services";
import { versionQuotationDto } from "@/domain/dtos/versionQuotation";

export const DataTableCostSummary = () => {
  const dispatch = useDispatch();

  const { indirectCostMargin } = useSelector(
    (state: AppState) => state.quotation
  );

  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const [
    updateVersionQuotation,
    { isLoading: isLoadingUpdateVersionQuotation },
  ] = useUpdateVersionQuotationMutation();

  const { calculateCostsPerService, uniqueHotelRoomTripDetails, emptyHotelRoomName } =
    useCalculateCostsPerService();

  const columsTable = useMemo(() => {
    return uniqueHotelRoomTripDetails.length > 0
      ? uniqueHotelRoomTripDetails.map((quote) => ({
          header: `${quote.hotelRoom?.hotel?.name}-${quote.hotelRoom?.roomType}`,
          number: quote.number,
        }))
      : [
          {
            header: emptyHotelRoomName,
            number: 0,
          },
        ];
  }, [uniqueHotelRoomTripDetails]);

  const saveIndirectCostMargin = (value: number) => {
    if (!currentVersionQuotation) return;
    updateVersionQuotation(
      versionQuotationDto.parse({
        ...currentVersionQuotation,
        indirectCostMargin: value,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(onSetIndirectCostMargin(value));
      });
  };

  console.log(calculateCostsPerService);

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
                <InputNumber
                  prefix="%"
                  value={indirectCostMargin}
                  min={0}
                  disabled={isLoadingUpdateVersionQuotation}
                  max={100}
                  onChange={(e) => saveIndirectCostMargin(e.value as number)}
                  showButtons
                  buttonLayout="vertical"
                  className="w-20"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                />
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
