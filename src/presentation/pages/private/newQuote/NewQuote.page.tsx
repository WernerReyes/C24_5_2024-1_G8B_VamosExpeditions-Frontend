import {
  Button,
  Stepper,
  type StepperChangeEvent,
} from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { memo, useEffect, useState } from "react";
import {
  CostingModule,
  CostSummaryModule,
  CustomerDataModule,
  GenerateModule,
} from "./modules";

import type { AppState } from "@/app/store";
import {
  onSetCurrentReservation,
  onSetCurrentStep,
} from "@/infraestructure/store";
import {
  useGetAllHotelRoomQuotationsQuery,
  useGetReservationByIdQuery,
  useGetVersionQuotationByIdQuery,
} from "@/infraestructure/store/services";
import { useDispatch, useSelector } from "react-redux";
import { classNamesAdapter } from "@/core/adapters";
import { EditableQuotationName } from "./components";

interface Title {
  header: string;
}

const steps: Title[] = [
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

const NewQuotePage = memo(() => {
  const dispatch = useDispatch();
  const { width, DESKTOP, MOVILE } = useWindowSize();

  const { currentQuotation, currentStep } = useSelector(
    (state: AppState) => state.quotation
  );
  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );
  const { currentReservation } = useSelector(
    (state: AppState) => state.reservation
  );
  const { hotelRoomQuotations } = useSelector(
    (state: AppState) => state.hotelRoomQuotation
  );

  const versionQuotationId = currentQuotation?.currentVersion?.id;
  const reservationId = currentVersionQuotation?.reservation?.id;

  useGetAllHotelRoomQuotationsQuery(
    {
      versionNumber: versionQuotationId?.versionNumber,
      quotationId: versionQuotationId?.quotationId,
    },
    {
      skip: !versionQuotationId,
    }
  );

  useGetVersionQuotationByIdQuery(versionQuotationId!, {
    skip: !versionQuotationId,
  });

  const { data: reservationData } = useGetReservationByIdQuery(reservationId!, {
    skip: !reservationId || currentReservation !== null,
  });
  const [isLoadingStep, setIsLoadingStep] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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
    if (reservationData) {
      dispatch(onSetCurrentReservation(reservationData.data));
    }
  }, [reservationData]);

  useEffect(() => {
    if (!isLoadingStep) {
      if (currentStep > 0) {
        if (!currentReservation) dispatch(onSetCurrentStep(0));
        if (currentStep === 2 && hotelRoomQuotations.length === 0) {
          dispatch(onSetCurrentStep(1));
        }
        if (currentStep === 3 && !currentVersionQuotation) {
          dispatch(onSetCurrentStep(2));
        }
      }
    }
    setTimeout(() => {
      setIsLoadingStep(false);
    }, 500);
  }, [currentStep]);

  return (
    <section className="bg-white pe-7 py-5 md:p-10 rounded-lg my-auto shadow-md min-h-screen">
      <EditableQuotationName />
      <Stepper
        linear
        orientation={width > DESKTOP ? "horizontal" : "vertical"}
        activeStep={currentStep}
        onChangeStep={handleChangeStep}
        panelContent={steps.map((step, index) => ({
          header: step.header,

          children: !isLoadingStep ? (
            <div
              className={classNamesAdapter(
                currentStep !== 3 && currentStep !== 1 && "pe-4 sm:pe-0"
              )}
            >
              {renderStepContent(index)}
              {/* {stepContentMemo(index)} */}
              <div className="flex pt-4 justify-between">
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

                {index < steps.length - 1 && (
                  <Button
                    label={width > MOVILE ? "Continuar" : undefined}
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    tooltip={width <= MOVILE ? "Continuar" : undefined}
                    tooltipOptions={{ position: "top" }}
                    onClick={handleNext}
                    disabled={
                      (index === 0 && !currentReservation) ||
                      (index === 1 && hotelRoomQuotations.length === 0)
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
});

export default NewQuotePage;
