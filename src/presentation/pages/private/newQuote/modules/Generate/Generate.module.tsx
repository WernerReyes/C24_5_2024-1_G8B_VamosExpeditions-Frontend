import { AppState } from "@/app/store";
import { constantRoutes, constantStorage } from "@/core/constants";
import {
  Button,
  Column,
  DataTable,
  InputText,
} from "@/presentation/components";
import { Slider } from "primereact/slider";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculateCosts } from "../CostSummary/utils/calculateCosts";
import {
  onSetCurrentQuotation,
  onSetCurrentReservation,
  onSetCurrentStep,
  onSetCurrentVersionQuotation,
  onSetHotelRoomQuotationsWithTotalCost,
  onSetReservations,
  onSetSelectedDay,
} from "@/infraestructure/store";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { useUpdateVersionQuotationMutation } from "@/infraestructure/store/services";
import { versionQuotationDto } from "@/domain/dtos/versionQuotation";
import { VersionQuotationStatus } from "@/domain/entities";
import { startShowSuccess } from "@/core/utils";
import { useNavigate } from "react-router-dom";
import { quotationService } from "@/data";

const {
  INDIRECT_COSTS_PERCENTAGE,
  CURRENT_ACTIVE_STEP,
  ITINERARY_CURRENT_SELECTED_DAY,
} = constantStorage;

const { QUOTES } = constantRoutes.private;

export const GenerateModule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );
  const { hotelRoomQuotations, hotelRoomQuotationsWithTotalCost } = useSelector(
    (state: AppState) => state.hotelRoomQuotation
  );

  const [updateVersionQuotation] = useUpdateVersionQuotationMutation();
  const [margin, setMargin] = useState<number>(80);
  const [value] = useState<number>(
    localStorage.getItem(INDIRECT_COSTS_PERCENTAGE)
      ? Number(localStorage.getItem(INDIRECT_COSTS_PERCENTAGE))
      : 5
  );
  const [finalPrice, setFinalPrice] = useState<number>(0);

  const handleSaveQuotation = () => {
    console.log({
        ...currentVersionQuotation,
        finalPrice,
        indirectCostMargin: value,
        profitMargin: margin,
        status: VersionQuotationStatus.DRAFT,
    })
    updateVersionQuotation(
      versionQuotationDto.parse({
        ...currentVersionQuotation!,
        finalPrice,
        indirectCostMargin: value,
        profitMargin: margin,
        status: VersionQuotationStatus.DRAFT,
      })
    ).then(async () => {
    //   navigate(QUOTES);
      await quotationService.deleteCurrentQuotation();
      dispatch(onSetCurrentQuotation(null));
      dispatch(onSetHotelRoomQuotationsWithTotalCost([]));
      dispatch(onSetReservations([]));
      dispatch(onSetCurrentReservation(null));
      dispatch(onSetCurrentVersionQuotation(null));
      dispatch(onSetCurrentStep(0));
      dispatch(onSetSelectedDay(null));
      localStorage.removeItem(INDIRECT_COSTS_PERCENTAGE);
      dispatch(onSetCurrentQuotation(null));
      startShowSuccess("Cotización guardada correctamente");

    //   //   navigate(QUOTES);

    //   // dispatch(onSetCurrentReservation(reservation));
    });

    // dispatch(onSaveQuotation());
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
        value
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
          parseFloat((quote.totalCost / (margin / 100)).toFixed(2)) *
            quote.numberOfPeople
        );
      }, 0)
    );
  }, [hotelRoomQuotations, value, hotelRoomQuotationsWithTotalCost]);

  useEffect(() => {
    setFinalPrice(
      hotelRoomQuotationsWithTotalCost.reduce((acc, quote) => {
        return (
          acc +
          parseFloat((quote.totalCost / (margin / 100)).toFixed(2)) *
            quote.numberOfPeople
        );
      }, 0)
    );
  }, [finalPrice, value, hotelRoomQuotationsWithTotalCost]);

  return (
    <>
      {/* Control de margen */}
      <h3 className="text-lg font-bold mb-4">Cálculo de margen</h3>
      <div className="max-w-64 mx-auto mb-4">
        <InputText
          value={margin.toString() + "%"}
          // onChange={(e) => setMargin(+e.target.value)}
          disabled
          className="w-full"
        />
        <Slider
          value={margin}
          onChange={(e) => setMargin(+e.value)}
          className="w-full"
        />
      </div>

      <DataTable
        value={hotelRoomQuotationsWithTotalCost}
        className="w-full text-left border-collapse mb-5"
        footerColumnGroup={
          <ColumnGroup>
            <Row>
              <Column
                footer={
                  <div className="text-white text-lg">
                    <i className="pi pi-money-bill mx-3"></i>
                    <span>Total:</span>
                  </div>
                }
                colSpan={5}
                className="bg-primary text-white"
                footerStyle={{ textAlign: "right" }}
              />
              <Column
                className="bg-primary p-0 text-white text-lg"
                footer={<span>$ {finalPrice}</span>}
              />
            </Row>
          </ColumnGroup>
        }
      >
        <Column field="hotelRoom.hotel.name" header="Hotel" />
        <Column
          field="totalCost"
          header="Total de Costos"
          body={(rowData) => <>${rowData.totalCost}</>}
        />
        <Column header="Margen" body={<span>{margin}%</span>} />
        <Column field="numberOfPeople" header="Number de personas" />
        <Column
          header="Utilidad"
          body={(rowData) => (
            <span>
              $
              {(
                parseFloat((rowData.totalCost / (margin / 100)).toFixed(2)) -
                rowData.totalCost
              ).toFixed(2)}
            </span>
          )}
        />
        <Column
          header="Precio venta"
          body={(rowData) => {
            const calculatedSalesPrice = parseFloat(
              (rowData.totalCost / (margin / 100)).toFixed(2)
            );

            return <span>${calculatedSalesPrice}</span>;
          }}
        />
      </DataTable>

      <div className="flex justify-end">
        <Button
          icon="pi pi-file-check"
          label="Generar Cotización"
          onClick={() => handleSaveQuotation()}
        />
        {/* <Button icon="pi pi-file-pdf" label="Exportar en PDF " /> */}
      </div>
    </>
  );
};
