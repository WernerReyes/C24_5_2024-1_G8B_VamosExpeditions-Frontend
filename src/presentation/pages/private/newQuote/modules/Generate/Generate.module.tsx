import { AppState } from "@/app/store";
import { constantRoutes, constantStorage } from "@/core/constants";
import { startShowSuccess } from "@/core/utils";
import { quotationService } from "@/data";
import { versionQuotationDto } from "@/domain/dtos/versionQuotation";
import { VersionQuotationStatus } from "@/domain/entities";
import {
  onSetCurrentQuotation,
  onSetCurrentReservation,
  onSetCurrentStep,
  onSetCurrentVersionQuotation,
  onSetHotelRoomQuotationsWithTotalCost,
  onSetProfitPercentage,
  onSetReservations,
  onSetSelectedClient,
  onSetSelectedDay,
} from "@/infraestructure/store";
import { useUpdateVersionQuotationMutation } from "@/infraestructure/store/services";
import {
  Button,
  Column,
  Confetti,
  DataTable,
  Dialog,
  InputText,
} from "@/presentation/components";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Slider } from "primereact/slider";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { calculateCosts } from "../CostSummary/utils/calculateCosts";
import { useWindowSize } from "@/presentation/hooks";
import { QuotationSuccessDialog } from "./components";

const {
  INDIRECT_COSTS_PERCENTAGE,
  CURRENT_ACTIVE_STEP,
  ITINERARY_CURRENT_SELECTED_DAY,
  PROFIT_MARGIN,
} = constantStorage;

const { QUOTES } = constantRoutes.private;

export const GenerateModule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { width, TABLET } = useWindowSize();
  const { indirectCostPercentage, profitPercentage } = useSelector(
    (state: AppState) => state.quotation
  );

  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );
  const { hotelRoomQuotations, hotelRoomQuotationsWithTotalCost } = useSelector(
    (state: AppState) => state.hotelRoomQuotation
  );

  const [updateVersionQuotation] = useUpdateVersionQuotationMutation();

  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [isExploding, setIsExploding] = useState(false);

  const handleSaveQuotation = () => {
    updateVersionQuotation(
      versionQuotationDto.parse({
        ...currentVersionQuotation!,
        finalPrice,
        indirectCostMargin: indirectCostPercentage,
        profitMargin: profitPercentage,
        status: VersionQuotationStatus.DRAFT,
      })
    ).then(async () => {
      //   navigate(QUOTES);
      await quotationService.deleteCurrentQuotation();
      dispatch(onSetCurrentQuotation(null));
      dispatch(onSetHotelRoomQuotationsWithTotalCost([]));
      dispatch(onSetReservations([]));
      dispatch(onSetSelectedClient(null));
      dispatch(onSetCurrentReservation(null));
      dispatch(onSetCurrentVersionQuotation(null));
      dispatch(onSetCurrentStep(0));
      dispatch(onSetSelectedDay(null));
      localStorage.removeItem(INDIRECT_COSTS_PERCENTAGE);
      localStorage.removeItem(CURRENT_ACTIVE_STEP);
      localStorage.removeItem(ITINERARY_CURRENT_SELECTED_DAY);
      localStorage.removeItem(PROFIT_MARGIN);
      dispatch(onSetCurrentQuotation(null));
      startShowSuccess("Cotización guardada correctamente");

      
    });
  };

  useEffect(() => {
    if (hotelRoomQuotationsWithTotalCost.length > 0) return;
    if (hotelRoomQuotations.length > 0) {
      const uniqueHotelRoomQuotations = hotelRoomQuotations.filter(
        (quote, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.hotelRoom?.hotel?.id === quote.hotelRoom?.hotel?.id &&
              t.hotelRoom?.roomType === quote.hotelRoom?.roomType
          )
      );

      const calculateCostsPerService = calculateCosts(
        hotelRoomQuotations,
        indirectCostPercentage
      );

      dispatch(
        onSetHotelRoomQuotationsWithTotalCost(
          uniqueHotelRoomQuotations.map((quote, index) => {
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
    }

    setFinalPrice(
      hotelRoomQuotationsWithTotalCost.reduce((acc, quote) => {
        return (
          acc +
          parseFloat((quote.totalCost / (profitPercentage / 100)).toFixed(2)) *
            quote.numberOfPeople
        );
      }, 0)
    );
  }, [
    hotelRoomQuotations,
    indirectCostPercentage,
    hotelRoomQuotationsWithTotalCost,
  ]);

  useEffect(() => {
    setFinalPrice(
      hotelRoomQuotationsWithTotalCost.reduce((acc, quote) => {
        return (
          acc +
          parseFloat((quote.totalCost / (profitPercentage / 100)).toFixed(2)) *
            quote.numberOfPeople
        );
      }, 0)
    );
  }, [finalPrice, indirectCostPercentage, hotelRoomQuotationsWithTotalCost]);

  return (
    <>
      {isExploding && <Confetti />}

      <QuotationSuccessDialog visible={isExploding} setVisible={setIsExploding} />

      {/* Control de margen */}
      <div className="w-full sm:max-w-64 2xl:max-w-96 mx-auto mb-4">
        <InputText
          label={{
            text: "Margen de Utilidad",
            className: "text-primary text-sm font-semibold",
          }}
          value={profitPercentage.toString() + "%"}
          disabled
          className="w-full"
        />
        <Slider
          value={profitPercentage}
          onChange={(e) => dispatch(onSetProfitPercentage(e.value as number))}
          className="w-full"
        />
      </div>

      {/* <DataTable
        header="Cotización final"
        value={hotelRoomQuotationsWithTotalCost}
        className="w-full border-collapse mb-5 font-bold"
        footerColumnGroup={
          <ColumnGroup>
            <Row>
              <Column
                footer={
                  <div className="text-white flex items-center md:text-lg">
                    <i className="pi pi-money-bill me-3"></i>
                    <span>
                      Total:
                      {width < TABLET && (
                        <strong className="ms-2">
                          ${finalPrice.toFixed(2)}
                        </strong>
                      )}
                    </span>
                  </div>
                }
                colSpan={width > TABLET ? 5 : 6}
                className="bg-primary text-white"
                footerStyle={{ textAlign: width > TABLET ? "right" : "left" }}
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
          body={<span>{profitPercentage}%</span>}
        />
        <Column
          alignHeader={"center"}
          align={"center"}
          headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
          className="max-sm:text-xs max-md:text-sm w-20"
          field="numberOfPeople"
          header="Número de personas"
        />
        <Column
          alignHeader={"center"}
          align={"center"}
          headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
          className="max-sm:text-xs max-md:text-sm"
          header="Utilidad"
          body={(rowData) => (
            <span>
              $
              {(
                parseFloat(
                  (rowData.totalCost / (profitPercentage / 100)).toFixed(2)
                ) - rowData.totalCost
              ).toFixed(2)}
            </span>
          )}
        />
        <Column
          alignHeader={"center"}
          align={"center"}
          headerClassName="bg-primary text-white max-sm:text-xs max-md:text-sm"
          className="max-sm:text-xs max-md:text-sm"
          header="Precio venta"
          body={(rowData) => {
            const calculatedSalesPrice = parseFloat(
              (rowData.totalCost / (profitPercentage / 100)).toFixed(2)
            );

            return <span>${calculatedSalesPrice}</span>;
          }}
        />
      </DataTable> */}

      <div className="flex justify-end">
        <Button
          icon="pi pi-file-check"
          label="Completar cotización"
          onClick={() => setIsExploding(true)}
        />
      </div>
    </>
  );
};
