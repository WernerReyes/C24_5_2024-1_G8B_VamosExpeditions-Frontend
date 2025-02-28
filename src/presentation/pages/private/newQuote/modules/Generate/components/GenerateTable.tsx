import type { AppState } from "@/app/store";
import { classNamesAdapter } from "@/core/adapters";
import { HotelRoomTripDetailsEntity } from "@/domain/entities";
import { Badge, Column, DataTable } from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onSetHotelRoomTripDetailsWithTotalCost } from "@/infraestructure/store";
import type { CostTableType } from "../../types/costTable.type";
import { calculateCosts } from "../../utils/calculateCosts";

type Props = {
  finalPrice: number;
};

export const GenerateTable = ({ finalPrice }: Props) => {
  const dispatch = useDispatch();
  const { width, TABLET } = useWindowSize();

  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const { hotelRoomTripDetailsWithTotalCost, hotelRoomTripDetails } =
    useSelector((state: AppState) => state.hotelRoomTripDetails);

  const uniqueHotelRoomTripDetails: (HotelRoomTripDetailsEntity & {
    number: number;
  })[] = useMemo(() => {
    if (hotelRoomTripDetails.length === 0) return [];
    return hotelRoomTripDetailsWithTotalCost.length === 0
      ? hotelRoomTripDetails
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
          )
      : [];
  }, [hotelRoomTripDetails, hotelRoomTripDetailsWithTotalCost]);

  const calculateCostsPerService: CostTableType[] = useMemo(() => {
    if (hotelRoomTripDetails.length === 0) return [];
    return hotelRoomTripDetailsWithTotalCost.length === 0
      ? calculateCosts(
          hotelRoomTripDetails,
          currentVersionQuotation?.indirectCostMargin
        )
      : [];
  }, [
    hotelRoomTripDetails,
    hotelRoomTripDetailsWithTotalCost,
    currentVersionQuotation?.indirectCostMargin,
  ]);

  useEffect(() => {
    if (
      uniqueHotelRoomTripDetails.length === 0 &&
      calculateCostsPerService.length === 0
    )
      return;
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

  return (
    <DataTable
      header="Cotización final"
      value={hotelRoomTripDetailsWithTotalCost}
      className="w-full border-collapse mb-5 font-bold"
      footerColumnGroup={
        <ColumnGroup>
          <Row>
            <Column
              footer={
                <div
                  className={classNamesAdapter(
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
              className={classNamesAdapter(
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
            {rowData.hotelRoom?.hotel?.name}-{rowData.hotelRoom?.roomType}
            <Badge className="ms-2 bg-tertiary" value={rowData.number} />
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
        body={(rowData) => <>${rowData.totalCost.toFixed(2)}</>}
      />
      <Column
        alignHeader={"center"}
        align={"center"}
        headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
        className="max-sm:text-xs max-md:text-sm"
        header="Margen"
        body={<span>{currentVersionQuotation?.profitMargin}%</span>}
      />

      <Column
        alignHeader={"center"}
        align={"center"}
        headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
        className="max-sm:text-xs max-md:text-sm w-20"
        field="numberOfPeople"
        header="Nro. personas"
      />
      <Column
        alignHeader={"center"}
        align={"center"}
        headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
        className="max-sm:text-xs max-md:text-sm"
        header="Utilidad"
        body={(rowData) => {
          const calculatedSalesPrice = parseFloat(
            (
              rowData.totalCost /
              ((currentVersionQuotation?.profitMargin ?? 80) / 100)
            ).toFixed(2)
          );
          return (
            <span>
              ${parseFloat(
                (calculatedSalesPrice - rowData.totalCost).toFixed(2)
              ).toFixed(2)}
            </span>
          );
        }}
      />
      <Column
        alignHeader={"center"}
        align={"center"}
        headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
        className="max-sm:text-xs max-md:text-sm"
        header="Precio venta"
        body={(rowData) => {
          const calculatedSalesPrice = parseFloat(
            (
              rowData.totalCost /
              ((currentVersionQuotation?.profitMargin ?? 80) / 100)
            ).toFixed(2)
          );

          return <span>${calculatedSalesPrice}</span>;
        }}
      />
    </DataTable>
  );
};
