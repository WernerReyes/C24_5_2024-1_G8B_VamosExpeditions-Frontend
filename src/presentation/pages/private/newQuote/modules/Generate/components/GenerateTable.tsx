import type { AppState } from "@/app/store";
import { cn } from "@/core/adapters";
import {
  Badge,
  Column,
  DataTable,
  InputNumber
} from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useCalculateCostsPerService } from "../../../hooks/useCalculateCostsPerService";

type Props = {
  setFinalPrice: (finalPrice: number) => void;
  profitMargin: number;
  comission: number;
  parnerName : string;
};



export const GenerateTable = ({ profitMargin,comission, setFinalPrice, parnerName }: Props) => {
  const { width, TABLET } = useWindowSize();

  const { hotelRoomTripDetailsWithTotalCost } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );

  const {} = useCalculateCostsPerService();


  const calculateSalesPrice = useMemo(() => {
    return hotelRoomTripDetailsWithTotalCost.map((quote) => {
      const salesPrice = parseFloat(
        (quote.totalCost / (profitMargin / 100)).toFixed(2)
      );
      
      const salesPriceWithCommission = parseFloat(
        ((salesPrice * 100) / (100 - comission)).toFixed(2)
      );
      return {
        utility: parseFloat(
          (salesPrice - quote.totalCost).toFixed(2)
        ),
        hotelName: `${quote.hotelRoom?.hotel?.name}-${quote.hotelRoom?.roomType}`,
        margin: profitMargin,
        numberOfPeople: quote.numberOfPeople,
        totalCost: +quote.totalCost.toFixed(2),
        salesPrice: comission > 0 ? salesPriceWithCommission : salesPrice,
        number: quote.number,
      };
    });
  }, [hotelRoomTripDetailsWithTotalCost, profitMargin, comission]);

  const finalPrice = useMemo(() => {
    return calculateSalesPrice.reduce((acc, quote) => {
      return acc + parseFloat(quote.salesPrice.toFixed(2));
    }, 0);
  } , [calculateSalesPrice]);

  useEffect(() => {
    setFinalPrice(finalPrice);
  }
  , [finalPrice]);

  return (
    <DataTable
      header="Cotización final"
      value={calculateSalesPrice}
      editMode="cell"
      className="w-full border-collapse mb-5 font-bold"
      footerColumnGroup={
        <ColumnGroup>
          <Row>
            <Column
              footer={
                <div
                  className={cn(
                    "text-white md:text-lg",
                    width < TABLET && "flex items-center"
                  )}
                >
                  <i className="pi pi-money-bill me-3"></i>
                  <span>
                    Total:
                    {width < TABLET && (
                      <strong className="ms-2">${finalPrice.toFixed(2)}</strong>
                    )}
                  </span>
                </div>
              }
              colSpan={width > TABLET ? 5 : 6}
              className={cn(
                "bg-primary text-white",
                width > TABLET && "text-right"
              )}
            />
            {width > TABLET && (
              <Column
                align={"center"}
                className="bg-primary p-0 text-white text-lg"
                footer={<span>$ {finalPrice.toFixed(2)}</span>}
              />
            )}
          </Row>
        </ColumnGroup>
      }
    >
      <Column
        alignHeader={"center"}
        headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
        header="Hotel"
        className="max-sm:text-xs max-md:text-sm text-center min-w-48"
        field="hotelRoom.hotel.name"
        body={(rowData) => (
          <>
            {rowData.hotelName}
            <Badge className="ms-2 bg-tertiary" value={rowData?.number} />
          </>
        )}
      />
      <Column
        alignHeader={"center"}
        align={"center"}
        headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
        className="max-sm:text-xs max-md:text-sm"
        field="totalCost"
        header="Total de Costos"
        body={(rowData) => <>${rowData.totalCost}</>}
      />

      <Column
        alignHeader={"center"}
        align={"center"}
        headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
        className="max-sm:text-xs max-md:text-sm"
        header="Margen"
        body={<span>{profitMargin}%</span>}
      />

      <Column
        alignHeader={"center"}
        align={"center"}
        headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
        className="max-sm:text-xs max-md:text-sm w-20"
        field="numberOfPeople"
        header="Nro. personas"
        editor={(options) => {
          return (
            <InputNumber
              inputClassName="w-20"
              value={options.value}
              onValueChange={(e) => {
                options.editorCallback?.(e.value ?? 0);
              }}
              min={1}
              max={options.rowData.hotelRoom?.capacity}
            />
          );
        }}
      />
      <Column
        alignHeader={"center"}
        align={"center"}
        headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
        className="max-sm:text-xs max-md:text-sm"
        header="Utilidad"
        body={(rowData) => {
          return <span>${rowData.utility}</span>;
        }}
      />
      <Column
        alignHeader={"center"}
        align={"center"}
        headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
        className="max-sm:text-xs max-md:text-sm"
        header={
          <>
            Precio de venta
            <Badge className="ms-2 bg-tertiary" value={parnerName} />
          </>
        }
        body={(rowData) => {
          return <span>${rowData.salesPrice}</span>;
        }}
      />
    </DataTable>
  );
};

// const calculatePinal
