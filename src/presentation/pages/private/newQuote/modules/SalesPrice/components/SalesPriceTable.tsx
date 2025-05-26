import type { AppState } from "@/app/store";
import { Badge, Column, DataTable, ColumnGroup, Row } from "@/presentation/components";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useCalculateCostsPerService } from "../../../hooks/useCalculateCostsPerService";

type Props = {
  setFinalPrice: (finalPrice: number) => void;
  profitMargin: number;
  comission: number;
  parnerName?: string;
};

export const SalesPriceTable = ({
  profitMargin,
  comission,
  setFinalPrice,
  parnerName,
}: Props) => {
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
        utility: parseFloat((salesPrice - quote.totalCost).toFixed(2)),
        hotelName: `${quote.hotelRoom?.hotel?.name}-${quote.hotelRoom?.roomType}`,
        margin: profitMargin,
        costPerson: quote.costPerson,
        totalCost: +quote.totalCost.toFixed(2),
        salesPriceVE: salesPrice,
        salesPriceParner: salesPriceWithCommission,
        number: quote.number,
      };
    });
  }, [hotelRoomTripDetailsWithTotalCost, profitMargin, comission]);

  const finalPrice = useMemo(() => {
    return {
      VE: calculateSalesPrice.reduce(
        (acc, quote) => acc + quote.salesPriceVE,
        0
      ),
      parner: calculateSalesPrice.reduce(
        (acc, quote) => acc + quote.salesPriceParner,
        0
      ),
    };
  }, [calculateSalesPrice]);

  useEffect(() => {
    setFinalPrice(finalPrice.VE);
  }, [finalPrice]);

  return (
    <DataTable
      header="Cotización final"
      value={calculateSalesPrice}
      editMode="cell"
      className="w-full border-collapse mb-5 font-bold"
      footerColumnGroup={
        <ColumnGroup>
          <Row>
            <Column colSpan={4} className="bg-primary text-white" />
            <Column
              align={"center"}
              className="bg-primary  text-white text-lg"
              footer={<span>$ {finalPrice.VE.toFixed(2)}</span>}
            />
            {parnerName && (
              <Column
                align={"center"}
                className="bg-primary  text-white text-lg"
                footer={<span>$ {finalPrice.parner.toFixed(2)}</span>}
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
        className="max-sm:text-xs max-md:text-sm"
        header="Utilidad"
        body={(rowData) => {
          return <span>${rowData.utility}</span>;
        }}
      />
      <Column
        alignHeader={"center"}
        align={"center"}
        headerClassName="min-w-48 bg-primary text-white max-sm:text-xs max-md:text-sm"
        className="max-sm:text-xs max-md:text-sm"
        header={
          <>
            Precio de venta
            <Badge
              className="ms-2 bg-tertiary block"
              value="Vamos expeditions"
            />
          </>
        }
        body={(rowData) => {
          return <span>${rowData.salesPriceVE}</span>;
        }}
      />
      {parnerName && (
        <Column
          alignHeader={"center"}
          align={"center"}
          headerClassName="min-w-48 bg-primary text-white max-sm:text-xs max-md:text-sm"
          className="max-sm:text-xs max-md:text-sm"
          header={
            <>
              Precio de venta
              <Badge className="ms-2 bg-tertiary block" value={parnerName} />
            </>
          }
          body={(rowData) => {
            return <span>${rowData.salesPriceParner}</span>;
          }}
        />
      )}
    </DataTable>
  );
};


