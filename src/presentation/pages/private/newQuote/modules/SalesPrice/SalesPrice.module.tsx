import type { AppState } from "@/app/store";
import { versionQuotationDto } from "@/domain/dtos/versionQuotation";
import { type PartnerEntity, VersionQuotationStatus } from "@/domain/entities";
import { useUpdateVersionQuotationMutation } from "@/infraestructure/store/services";
import { Button, Confetti, InputText, Slider } from "@/presentation/components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  SalesPriceTable,
  ParnerTable,
  QuotationSuccessDialog,
} from "./components";
import { deepEqual } from "@/core/utils";
import { quotationService } from "@/data";
import { onSetCurrentQuotation } from "@/infraestructure/store";
import { cn } from "@/core/adapters";

export const SalesPriceModule = () => {
  const dispatch = useDispatch();
  const { quoteId, version } = useParams<{
    quoteId: string;
    version: string;
  }>();

  const { currentQuotation } = useSelector(
    (state: AppState) => state.quotation
  );

  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const [
    updateVersionQuotation,
    { isLoading: isLoadingUpdateVersionQuotation },
  ] = useUpdateVersionQuotationMutation();
  const [profitMargin, setProfitMargin] = useState<number>(
    currentVersionQuotation?.profitMargin ?? 80
  );
  const [isExploding, setIsExploding] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [parner, setParner] = useState<PartnerEntity |null>(null);

  const [comission, setComission] = useState<number | null>(null);

  const objectToCompare = {
    ...currentVersionQuotation!,
    finalPrice,
    profitMargin,
    completionPercentage: 100,
    commission: comission,
    partner: parner,
    status: VersionQuotationStatus.COMPLETED,
  };

  const handleSaveQuotation = () => {
    if (
      deepEqual(
        {
          ...currentVersionQuotation,
          commission: currentVersionQuotation?.commission || null,
        },
        objectToCompare
      )
    )
      return;

    updateVersionQuotation(
      versionQuotationDto.parse({
        ...currentVersionQuotation!,
        finalPrice,
        profitMargin,
        completionPercentage: 100,
        commission: comission ?? 0,
        partner: parner,
        status: VersionQuotationStatus.COMPLETED,
      })
    )
      .unwrap()
      .then(() => {
        setIsExploding(true);
        setDisableButton(true);

        if (quoteId && version) {
          const currentVersionId = currentQuotation?.currentVersion.id;
          if (!currentVersionId) return;

          if (
            currentVersionId.versionNumber === Number(version) &&
            currentVersionId.quotationId === Number(quoteId)
          ) {
            quotationService.deleteCurrentQuotation();
            dispatch(onSetCurrentQuotation(null));
          }
        }
      });
  };

  useEffect(() => {
    if (!currentVersionQuotation) return;
    if (!currentVersionQuotation.profitMargin) return;
    setProfitMargin(currentVersionQuotation.profitMargin);
  }, [currentVersionQuotation]);
 
  useEffect(() => {
    if (
      deepEqual(
        {
          ...currentVersionQuotation,
          partner: parner,
          commission: currentVersionQuotation?.commission || null,
        },
        objectToCompare
      ) &&
      !isExploding
    ) {
      setDisableButton(true);
      return;
    } else setDisableButton(false);
  }, [
    currentVersionQuotation,
    finalPrice,
    profitMargin,
    comission,
    parner,
    isExploding,
  ]);

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
          value={profitMargin}
          min={0}
          onChange={(e) => setProfitMargin(e.value as number)}
          className="w-full"
        />
      </div>

      <ParnerTable setParner={setParner} setComission={setComission} />

      {/* Tabla de costos */}
      <SalesPriceTable
        setFinalPrice={setFinalPrice}
        profitMargin={profitMargin}
        parnerName={parner?.name}
        comission={comission ?? 0}
      />

      <div className="flex justify-end">
        <Button
          icon="pi pi-file-check"
          label={
            (quoteId && version ? "Actualizar" : "Completar") + " cotización"
          }
          className={cn(!disableButton && "animate-bounce")}
          disabled={disableButton}
          loading={isLoadingUpdateVersionQuotation}
          onClick={handleSaveQuotation}
        />
      </div>
    </>
  );
};
