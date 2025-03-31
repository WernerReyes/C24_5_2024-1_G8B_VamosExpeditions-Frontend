import {
  Button,
  Divider,
  NotFound,
  Stepper,
  type StepperChangeEvent,
} from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { useEffect, useState } from "react";
import {
  CostingModule,
  CostSummaryModule,
  CustomerDataModule,
  GenerateModule,
} from "./modules";

import type { AppState } from "@/app/store";

import { constantRoutes } from "@/core/constants";
import { versionQuotationDto } from "@/domain/dtos/versionQuotation";
import {
  onSetCurrentStep,
  onSetCurrentTripDetails,
  onSetCurrentVersionQuotation,
  onSetHotelRoomTripDetails,
} from "@/infraestructure/store";
import {
  useGetVersionQuotationByIdQuery,
  useUpdateVersionQuotationMutation,
} from "@/infraestructure/store/services";
import { BlockUI } from "primereact/blockui";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useLocation } from "react-use";
import { EditableQuotationName, ProgressBarQuotation } from "./components";

import { constantStorage } from "@/core/constants/storage.const";
import {
  calculateCompletionPercentage,
  getVersionDataAndCalculateCompletionPercentage,
} from "./utils";

interface Title {
  header: string;
}

const STEPS: Title[] = [
  { header: "Datos del Cliente" },
  { header: "Itinerario" },
  { header: "Resumen de Costos" },
  { header: "Finalización" },
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
      return <GenerateModule />;
    default:
      return <h1>Finalizar</h1>;
  }
};

const { VIEW_QUOTE } = constantRoutes.private;

const NewQuotePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { quoteId, version } = useParams<{
    quoteId: string;
    version: string;
  }>();
  const { width, DESKTOP, MOVILE } = useWindowSize();

  const { currentQuotation, currentStep, indirectCostMargin } = useSelector(
    (state: AppState) => state.quotation
  );

  const { currentTripDetails } = useSelector(
    (state: AppState) => state.tripDetails
  );

  const { hotelRoomTripDetails } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
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
  } = useGetVersionQuotationByIdQuery(versionQuotationId!, {
    skip: !versionQuotationId,
  });

  const currentTripDetailsData = currentVersionQuotationData?.data?.tripDetails;

  const currentHotelRoomTripDetailsData =
    currentTripDetailsData?.hotelRoomTripDetails ?? [];

  const [errorVersionQuotation, setErrorVersionQuotation] = useState(false);
  const [isLoadingStep, setIsLoadingStep] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

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
    setIsLoadingStep(true);

    const timeout = setTimeout(() => {
      setIsLoadingStep(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentStep]);

  useEffect(() => {
    if (isErrorGetVersionQuotationById) {
      dispatch(onSetCurrentVersionQuotation(null));
      setErrorVersionQuotation(true);
    }
    const timeout = setTimeout(() => {
      setIsVerified(true);
    }, 500);

    return () => clearTimeout(timeout);
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
    if (!currentVersionQuotationData) return;
    const version = currentVersionQuotationData?.data;
    if (version) {
      dispatch(onSetCurrentVersionQuotation(version));
      if (version.tripDetails) {
        dispatch(onSetCurrentTripDetails(version.tripDetails));
        if (version.tripDetails?.hotelRoomTripDetails) {
          dispatch(
            onSetHotelRoomTripDetails(version.tripDetails?.hotelRoomTripDetails)
          );
        } else {
          dispatch(onSetHotelRoomTripDetails([]));
        }
      } else {
        dispatch(onSetCurrentTripDetails(null));
      }
    } else {
      dispatch(onSetCurrentVersionQuotation(null));
    }
  }, [currentVersionQuotationData]);

  useEffect(() => {
    if (isLoadingStep) return;

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
    currentTripDetailsData,
    currentHotelRoomTripDetailsData,
    isLoadingStep,
    currentStep,
  ]);

  useEffect(() => {
    if (!currentVersionQuotationData || !isVerified || isLoadingStep) return;

    const storedCompletionPercentage =
      currentVersionQuotationData.data.completionPercentage;

    const newCompletionPercentage = calculateCompletionPercentage(
      currentStep,
      !!currentTripDetails,
      hotelRoomTripDetails.length > 0,
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
  }, [
    currentStep,
    currentTripDetails,
    hotelRoomTripDetails,
    currentVersionQuotationData,
    indirectCostMargin,
  ]);

  if (!isVerified) {
    return (
      <div className="flex justify-center items-center h-96 lg:h-[30rem]">
        <i className="pi pi-spin pi-spinner text-primary text-4xl"></i>
      </div>
    );
  }

  if (errorVersionQuotation) {
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
          children: !isLoadingStep ? (
            <div className={"pe-4 h-full sm:pe-0"}>
              <BlockUI
                blocked={location.pathname === VIEW_QUOTE(versionQuotationId)}
                className="!z-10"
                template={
                  <i className="pi pi-lock" style={{ fontSize: "3rem" }}></i>
                }
              >
                {renderStepContent(index)}
              </BlockUI>
              <div className="flex pt-4  justify-between">
                {index > 0 && (
                  <Button
                    label={width > MOVILE ? "Atrás" : undefined}
                    severity="secondary"
                    icon="pi pi-arrow-left"
                    iconPos="left"
                    tooltip={width <= MOVILE ? "Atrás" : undefined}
                    tooltipOptions={{ position: "top" }}
                    onClick={handleBack}
                  />
                )}

                {index < STEPS.length - 1 && (
                  <Button
                    label={width > MOVILE ? "Continuar" : undefined}
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    tooltip={width <= MOVILE ? "Continuar" : undefined}
                    tooltipOptions={{ position: "top" }}
                    onClick={handleNext}
                    disabled={
                      (index === 0 && !currentTripDetailsData) ||
                      (index === 1 && hotelRoomTripDetails.length === 0)
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
