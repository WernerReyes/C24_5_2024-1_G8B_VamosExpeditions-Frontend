import { AppState } from "@/app/store";
import { versionQuotationDto } from "@/domain/dtos/versionQuotation";
import { VersionQuotationStatus } from "@/domain/entities";
import { useUpdateVersionQuotationMutation } from "@/infraestructure/store/services";
import { Button, Confetti, InputText, Slider } from "@/presentation/components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GenerateTable, QuotationSuccessDialog } from "./components";
import { deepEqual } from "@/core/utils";

export const GenerateModule = () => {
  const { quoteId, version } = useParams<{
    quoteId: string;
    version: string;
  }>();
  const { currentStep } = useSelector((state: AppState) => state.quotation);

  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );
  const { hotelRoomTripDetailsWithTotalCost } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );

  const [updateVersionQuotation] = useUpdateVersionQuotationMutation();
  const [profitMargin, setProfitMargin] = useState<number>(80);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [isExploding, setIsExploding] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const handleSaveQuotation = () => {
    if (
      deepEqual(currentVersionQuotation, {
        ...currentVersionQuotation!,
        finalPrice,
        profitMargin,
        completionPercentage: 100,
        status: VersionQuotationStatus.COMPLETED,
      })
    ) {
      setIsExploding(true);
      return;
    }

    updateVersionQuotation(
      versionQuotationDto.parse({
        ...currentVersionQuotation!,
        finalPrice,
        profitMargin,
        completionPercentage: 100,
        status: VersionQuotationStatus.COMPLETED,
      })
    ).then(() => {
      setIsExploding(true);
      setDisableButton(true);
    });
  };

  useEffect(() => {
    if (currentStep !== 3) return;
    if (!currentVersionQuotation) return;
    if (currentVersionQuotation?.profitMargin) return;
    updateVersionQuotation(
      versionQuotationDto.parse({
        ...currentVersionQuotation!,
        profitMargin,
      })
    );
  }, [currentStep]);

  useEffect(() => {
    if (!currentVersionQuotation) return;
    if (!currentVersionQuotation.profitMargin) return;
    setProfitMargin(currentVersionQuotation.profitMargin);
  }, [currentVersionQuotation]);

  useEffect(() => {
    if (!hotelRoomTripDetailsWithTotalCost.length) return;
    setFinalPrice(
      hotelRoomTripDetailsWithTotalCost.reduce((acc, quote) => {
        return (
          acc +
          parseFloat((quote.totalCost / (profitMargin / 100)).toFixed(2)) *
            quote.numberOfPeople
        );
      }, 0)
    );
  }, [finalPrice, currentVersionQuotation, hotelRoomTripDetailsWithTotalCost]);

  useEffect(() => {
    if (
      deepEqual(currentVersionQuotation, {
        ...currentVersionQuotation!,
        finalPrice,
        profitMargin,
        completionPercentage: 100,
        status: VersionQuotationStatus.COMPLETED,
      })
    ) {
      setDisableButton(true);
      return;
    } else setDisableButton(false);
  }, [currentVersionQuotation, finalPrice, profitMargin]);


  return (
    <>
      {isExploding && <Confetti />}

      <QuotationSuccessDialog
        visible={isExploding}
        setVisible={setIsExploding}
      />

      {/* Control de margen */}
      <div className="w-full sm:max-w-64 2xl:max-w-96 mx-auto mb-4">
        <InputText
          label={{
            text: "Margen de Utilidad",
            className: "text-primary text-sm font-semibold",
          }}
          value={profitMargin.toString() + "%"}
          disabled
          className="w-full"
        />
        <Slider
          onSlideEnd={(e) => {
            updateVersionQuotation(
              versionQuotationDto.parse({
                ...currentVersionQuotation!,
                profitMargin: e.value as number,
              })
            );
          }}
          value={profitMargin}
          min={0}
          onChange={(e) => setProfitMargin(e.value as number)}
          className="w-full"
        />
      </div>

      {/* Tabla de costos */}
      <GenerateTable finalPrice={finalPrice} />

      <div className="flex justify-end">
        <Button
          icon="pi pi-file-check"
          label={
            (quoteId && version ? "Actualizar" : "Completar") + " cotización"
          }
          disabled={disableButton}
          onClick={handleSaveQuotation}
        />
      </div>
    </>
  );
};
