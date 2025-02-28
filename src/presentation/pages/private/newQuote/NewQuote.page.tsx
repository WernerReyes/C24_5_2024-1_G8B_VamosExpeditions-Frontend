import {
  Button,
  Divider,
  Stepper,
  type StepperChangeEvent,
} from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  CostingModule,
  CostSummaryModule,
  CustomerDataModule,
  GenerateModule,
} from "./modules";

import type { AppState } from "@/app/store";
import { dateFnsAdapter } from "@/core/adapters";

import {
  useGetAllHotelRoomTripDetailsQuery,
  useGetTripDetailsByVersionQuotationIdQuery,
  useGetVersionQuotationByIdQuery,
} from "@/infraestructure/store/services";
import { useDispatch, useSelector } from "react-redux";
import { EditableQuotationName, ProgressBarQuotation } from "./components";
import { useParams } from "react-router-dom";
import { useCleanStore } from "@/infraestructure/hooks";
import { onSetCurrentStep, onSetOperationType } from "@/infraestructure/store";

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

const NewQuotePage = memo(() => {
  const dispatch = useDispatch();
  const { quoteId, version } = useParams<{
    quoteId: string;
    version: string;
  }>();
  const { cleanChangeEditQuotation, cleanChangeNewQuotation } = useCleanStore();
  const { width, DESKTOP, MOVILE } = useWindowSize();

  const { currentQuotation, currentStep, days, operationType } = useSelector(
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

  const { refetch: refetchGetVersionQuotationById } =
    useGetVersionQuotationByIdQuery(versionQuotationId!, {
      skip: !versionQuotationId,
    });

  const { refetch: refetchGetTripDetailsByVersionQuotationId } =
    useGetTripDetailsByVersionQuotationIdQuery(versionQuotationId!, {
      skip: !versionQuotationId,
    });

    // console.log(currentTripDetails === null)

  const { refetch: refetchGetAllHotelRoomTripDetails } =
    useGetAllHotelRoomTripDetailsQuery(
      {
        tripDetailsId: currentTripDetails?.id ?? 0,
      },
      {
        skip: !currentTripDetails,
      }
    );

  const [isLoadingStep, setIsLoadingStep] = useState(true);
  const [verifyStep, setVerifyStep] = useState(false)

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

  const handleRefetch = useCallback(() => {
    refetchGetVersionQuotationById()
      .unwrap()
      .then(() => {
        refetchGetTripDetailsByVersionQuotationId()
          .unwrap()
          .then(() => {
            refetchGetAllHotelRoomTripDetails();
          })
          .catch(() => {
            dispatch(onSetCurrentStep(0));
          });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        dispatch(onSetOperationType(null));
      });
}, [
  refetchGetVersionQuotationById, 
  refetchGetTripDetailsByVersionQuotationId, 
  refetchGetAllHotelRoomTripDetails, 
  dispatch
]);


  useEffect(() => {
    if (operationType === "edit" && quoteId && version) {
      //* Clean state when change edit quotation
      cleanChangeEditQuotation();

      setVerifyStep(false);
      

      handleRefetch();
    }

    if (operationType === "create" && !quoteId && !version) {
      //* Clean state when change new quotation
      cleanChangeNewQuotation();

      setVerifyStep(false);
    

      handleRefetch();
    }
  }, [operationType, quoteId, version]);

  useEffect(() => {
    if (!isLoadingStep) return;
    const timeout = setTimeout(() => {
      setIsLoadingStep(false);
    }, 500);
    
    return () => clearTimeout(timeout);
}, [currentStep]);


useEffect(() => {
  if (isLoadingStep) return;
  if (currentStep >= 0 && currentStep < STEPS.length) {
    if (!currentTripDetails) {
      dispatch(onSetCurrentStep(0));
    } else if (currentStep > 1 && hotelRoomTripDetails.length === 0) {
      dispatch(onSetCurrentStep(1));
    }
  } else dispatch(onSetCurrentStep(0));

 
    setVerifyStep(true);
 
}, [isLoadingStep, verifyStep, currentStep]);



  const existDaysWithQuotations = useMemo(() => {
    if (!days || !hotelRoomTripDetails) return false;
    return days.every((day) =>
      hotelRoomTripDetails.some((hotelRoom) =>
        dateFnsAdapter.isSameDay(day.date, hotelRoom.date)
      )
    );
  }, [days, hotelRoomTripDetails]);

  

  return (
    <section className="bg-white py-5 md:p-10 rounded-lg my-auto shadow-md min-h-screen">
      <EditableQuotationName />
      <ProgressBarQuotation />
      <Divider />
  
      {/* Only render Stepper when verifyStep is true */}
      {verifyStep ? (
        <Stepper
          linear
          orientation={width > DESKTOP ? "horizontal" : "vertical"}
          activeStep={currentStep}
          onChangeStep={handleChangeStep}
          panelContent={STEPS.map((step, index) => ({
            header: step.header,
            children: !isLoadingStep ? (
              <div className={"pe-4 sm:pe-0"}>
                {renderStepContent(index)}
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
  
                  {index < STEPS.length - 1 && (
                    <Button
                      label={width > MOVILE ? "Continuar" : undefined}
                      icon="pi pi-arrow-right"
                      iconPos="right"
                      tooltip={width <= MOVILE ? "Continuar" : undefined}
                      tooltipOptions={{ position: "top" }}
                      onClick={handleNext}
                      disabled={
                        (index === 0 && !currentTripDetails) ||
                        (index === 1 &&
                          (hotelRoomTripDetails.length === 0 ||
                            !existDaysWithQuotations))
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
      ) : (
        // Show a loading state while verifyStep is false
        <div className="flex justify-center items-center h-96 lg:h-[30rem]">
          <i className="pi pi-spin pi-spinner text-primary text-4xl"></i>
        </div>
      )}
    </section>
  );
  
});

export default NewQuotePage;
