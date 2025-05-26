import {
  Button,
  Divider,
  NotFound,
  Stepper,
  type StepperChangeEvent,
} from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { useEffect } from "react";
import {
  CostingModule,
  CostSummaryModule,
  CustomerDataModule,
  SalesPriceModule,
} from "./modules";

import type { AppState } from "@/app/store";

import { versionQuotationDto } from "@/domain/dtos/versionQuotation";
import {
  onSetCurrentQuotation,
  onSetCurrentStep,
  onSetCurrentTripDetails,
  onSetCurrentVersionQuotation,
  onSetHotelRoomTripDetails,
  onSetIndirectCostMargin,
} from "@/infraestructure/store";
import {
  useGetVersionQuotationByIdQuery,
  useUpdateVersionQuotationMutation,
} from "@/infraestructure/store/services";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { EditableQuotationName, ProgressBarQuotation } from "./components";

import { constantStorage } from "@/core/constants/storage.const";
import {
  calculateCompletionPercentage,
  getVersionDataAndCalculateCompletionPercentage,
} from "./utils";
import { quotationService } from "@/data";

interface Title {
  header: string;
}

const STEPS: Title[] = [
  { header: "Datos del Cliente" },
  { header: "Itinerario" },
  { header: "Resumen de Costos" },
  { header: "Precio de venta" },
];

const renderStepContent = (step: number): React.ReactNode => {
  switch (step) {
    case 0:
      return <CustomerDataModule />;
    case 1:
      return <CostingModule />;
    case 2:
      return <CostSummaryModule />;
    case 3:
      return <SalesPriceModule />;
    default:
      return <h2>Finalizar</h2>;
  }
};

const NewQuotePage = () => {
  const dispatch = useDispatch();
  const { quoteId, version } = useParams<{
    quoteId: string;
    version: string;
  }>();
  const { width, DESKTOP, MOVILE } = useWindowSize();

  const { currentQuotation, currentStep, indirectCostMargin } = useSelector(
    (state: AppState) => state.quotation
  );

  const versionQuotationId =
    quoteId && version
      ? {
          quotationId: Number(quoteId),
          versionNumber: Number(version),
        }
      : currentQuotation?.currentVersion?.id;

  const [updateVersionQuotation] = useUpdateVersionQuotationMutation();

  const {
    currentData: currentVersionQuotationData,
    isError: isErrorGetVersionQuotationById,
    isLoading: isLoadingGetVersionQuotationById,
  } = useGetVersionQuotationByIdQuery(versionQuotationId!, {
    skip: !versionQuotationId,
    refetchOnMountOrArgChange: true,
  });

  const currentTripDetailsData = currentVersionQuotationData?.data?.tripDetails;

  const currentHotelRoomTripDetailsData =
    currentTripDetailsData?.hotelRoomTripDetails ?? [];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      dispatch(onSetCurrentStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      dispatch(onSetCurrentStep(currentStep - 1));
    }
  };

  const handleChangeStep = (event: StepperChangeEvent) => {
    dispatch(onSetCurrentStep(event.index));
  };

  useEffect(() => {
    if (isErrorGetVersionQuotationById) {
      dispatch(onSetCurrentVersionQuotation(null));

      if (currentQuotation) {
        quotationService.deleteCurrentQuotation();
        dispatch(onSetCurrentQuotation(null));
      }
    }
  }, [isErrorGetVersionQuotationById]);

  useEffect(() => {
    const storedStep = Number(
      localStorage.getItem(constantStorage.CURRENT_ACTIVE_STEP)
    );

    if (storedStep !== currentStep) {
      dispatch(onSetCurrentStep(storedStep)); // Solo si hay diferencia
    }
  }, []);

  useEffect(() => {
    if (currentVersionQuotationData) {
      dispatch(onSetCurrentVersionQuotation(currentVersionQuotationData!.data));
      if (currentVersionQuotationData.data.indirectCostMargin) {
        dispatch(
          onSetIndirectCostMargin(
            currentVersionQuotationData.data.indirectCostMargin
          )
        ) 
        // dispatch(onSetCurrentStep(currentVersionQuotationData.data.currentStep));
      } else {
        dispatch(onSetIndirectCostMargin(8));
      }
      if (currentTripDetailsData) {
        dispatch(onSetCurrentTripDetails(currentTripDetailsData));
        if (currentHotelRoomTripDetailsData.length > 0) {
          dispatch(onSetHotelRoomTripDetails(currentHotelRoomTripDetailsData));
        } else {
          dispatch(onSetHotelRoomTripDetails([]));
        }
      } else {
        dispatch(onSetCurrentTripDetails(null));
        dispatch(onSetHotelRoomTripDetails([]));
      }
    } else {
      dispatch(onSetCurrentVersionQuotation(null));
      dispatch(onSetCurrentTripDetails(null));
      dispatch(onSetHotelRoomTripDetails([]));
    }
  }, [currentVersionQuotationData]);

  useEffect(() => {
    if (isLoadingGetVersionQuotationById) return;

    if (
      !currentTripDetailsData &&
      currentHotelRoomTripDetailsData.length === 0 &&
      currentStep > 0
    ) {
      setTimeout(() => {
        dispatch(onSetCurrentStep(0));
      }, 0);
    } else if (
      currentHotelRoomTripDetailsData.length === 0 &&
      currentStep > 1
    ) {
      setTimeout(() => {
        dispatch(onSetCurrentStep(1));
      }, 0);
    }
  }, [
    currentHotelRoomTripDetailsData,
    isLoadingGetVersionQuotationById,
    currentStep,
  ]);

  useEffect(() => {
    if (!currentVersionQuotationData || isLoadingGetVersionQuotationById)
      return;

    const storedCompletionPercentage =
      currentVersionQuotationData.data.completionPercentage;

    const newCompletionPercentage = calculateCompletionPercentage(
      currentStep,
      !!currentTripDetailsData,
      currentHotelRoomTripDetailsData.length > 0,
      {
        ...currentVersionQuotationData.data,
        indirectCostMargin:
          currentVersionQuotationData.data.indirectCostMargin ||
          indirectCostMargin,
      },
      storedCompletionPercentage
    );

    //* Prevent unnecessary updates when reloading
    if (storedCompletionPercentage === newCompletionPercentage) return;

    updateVersionQuotation(
      versionQuotationDto.parse(
        getVersionDataAndCalculateCompletionPercentage(
          {
            ...currentVersionQuotationData.data,
            indirectCostMargin:
              currentVersionQuotationData.data.indirectCostMargin ||
              indirectCostMargin,
          },
          newCompletionPercentage
        )
      )
    );
  }, [currentStep, currentVersionQuotationData, indirectCostMargin]);

  if (isErrorGetVersionQuotationById) {
    return <NotFound screenSize="partial" />;
  }

  return (
    <section className="bg-white py-5 md:p-10 rounded-lg shadow-md">
      <EditableQuotationName />
      <ProgressBarQuotation />
      <Divider />

      <Stepper
        linear
        orientation={width > DESKTOP ? "horizontal" : "vertical"}
        activeStep={currentStep}
        onChangeStep={handleChangeStep}
        panelContent={STEPS.map((step, index) => ({
          header: step.header,
          children: !isLoadingGetVersionQuotationById ? (
            <div className={"pe-4 h-full sm:pe-0"}>
              {renderStepContent(index)}
              <div className="flex pt-4  justify-between">
                {index > 0 && (
                  <Button
                    label={width > MOVILE ? "Atrás" : undefined}
                    severity="secondary"
                    icon="pi pi-arrow-left"
                    iconPos="left"
                    tooltip={width <= MOVILE ? "Atrás" : undefined}
                    onClick={handleBack}
                  />
                )}

                {index < STEPS.length - 1 && (
                  <Button
                    label={width > MOVILE ? "Continuar" : undefined}
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    tooltip={width <= MOVILE ? "Continuar" : undefined}
                    onClick={handleNext}
                    disabled={
                      (index === 0 && !currentTripDetailsData) ||
                      (index === 1 &&
                        currentHotelRoomTripDetailsData.length === 0)
                    }
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-96 lg:h-[30rem]">
              <i className="pi pi-spin pi-spinner text-primary text-4xl"></i>
            </div>
          ),
        }))}
      />
    </section>
  );
};

export default NewQuotePage;
