import type { AppState } from "@/app/store";
import { versionQuotationDto } from "@/domain/dtos/versionQuotation";
import type { HotelRoomTripDetailsEntity } from "@/domain/entities";
import { useUpdateVersionQuotationMutation } from "@/infraestructure/store/services";
import {
  Badge,
  Column,
  DataTable,
  InputText,
  Slider,
} from "@/presentation/components";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CostTableEnum } from "../enums/costTable.enum";
import type { CostTableType } from "../../types/costTable.type";
import { calculateCosts } from "../../utils/calculateCosts";
import { onSetHotelRoomTripDetailsWithTotalCost } from "@/infraestructure/store";

export const DataTableCostSummary = () => {
  const dispatch = useDispatch();

  const { currentStep } = useSelector((state: AppState) => state.quotation);

  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const { hotelRoomTripDetails } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );

  const [updateVersionQuotation] = useUpdateVersionQuotationMutation();
  const [indirectCostMargin, setIndirectCostMargin] = useState<number>(5);

  const handleUpdateIndirectCostPercentage = (value: number) => {
    if (!currentVersionQuotation) return;
    // if (currentVersionQuotation.indirectCostMargin !== value) {
      updateVersionQuotation(
        versionQuotationDto.parse({
          ...currentVersionQuotation,
          indirectCostMargin: value,
          finalPrice: undefined,
            profitMargin: undefined,
           
          completionPercentage: 75,
        })
      ).then(() => {
        setIndirectCostMargin(value);
      });
    // }
  };

  const uniqueHotelRoomTripDetails: (HotelRoomTripDetailsEntity & {
    number: number;
  })[] = useMemo(() => {
    return hotelRoomTripDetails
      .map((quote) => {
        return {
          ...quote,
          number: hotelRoomTripDetails.filter(
            (t) =>
              t.hotelRoom?.hotel?.id === quote.hotelRoom?.hotel?.id &&
              t.hotelRoom?.roomType === quote.hotelRoom?.roomType
          ).length,
        };
      })
      .filter(
        (quote, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.hotelRoom?.hotel?.id === quote.hotelRoom?.hotel?.id &&
              t.hotelRoom?.roomType === quote.hotelRoom?.roomType
          )
      );
  }, [hotelRoomTripDetails]);

  const calculateCostsPerService: CostTableType[] = useMemo(() => {
    return calculateCosts(hotelRoomTripDetails, indirectCostMargin);
  }, [hotelRoomTripDetails, indirectCostMargin]);

  const columsTable = useMemo(() => {
    return uniqueHotelRoomTripDetails.map((quote) => ({
      header: `${quote.hotelRoom?.hotel?.name}-${quote.hotelRoom?.roomType}`,
      number: quote.number,
    }));
  }, [uniqueHotelRoomTripDetails]);

  useEffect(() => {
    dispatch(
      onSetHotelRoomTripDetailsWithTotalCost(
        uniqueHotelRoomTripDetails.map((quote, index) => {
          const totalCost =
            (
              calculateCostsPerService[index].total as {
                [key: string]: {
                  total: number;
                  indirectCost: number;
                  directCost: number;
                  totalCost: number;
                };
              }
            )[`${quote.hotelRoom?.hotel?.name}-${quote.hotelRoom?.roomType}`]
              ?.totalCost ?? 0;

          return {
            ...quote,
            totalCost,
          };
        })
      )
    );
  }, [uniqueHotelRoomTripDetails, calculateCostsPerService]);

  useEffect(() => {
    if (!currentVersionQuotation) return;
    if (!currentVersionQuotation.indirectCostMargin) return;
    setIndirectCostMargin(currentVersionQuotation.indirectCostMargin);
  }, [currentVersionQuotation]);

  useEffect(() => {
    if (currentStep !== 2) return;
    if (
      currentVersionQuotation?.indirectCostMargin &&
      currentVersionQuotation?.completionPercentage >= 75
    )
      return;
    handleUpdateIndirectCostPercentage(indirectCostMargin);
  }, [currentStep]);

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
                    onSlideEnd={(e) =>
                      handleUpdateIndirectCostPercentage(e.value as number)
                    }
                    onChange={(e) => setIndirectCostMargin(e.value as number)}
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
