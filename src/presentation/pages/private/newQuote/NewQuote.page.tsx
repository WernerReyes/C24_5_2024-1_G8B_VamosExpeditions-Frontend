// import { Button, Stepper } from "@/presentation/components";
// import { useWindowSize } from "@/presentation/hooks";
// import { StepperRefAttributes } from "primereact/stepper";
// import { useEffect, useRef, useState } from "react";
// import { MainLayout } from "../layouts";
// import { CostingModule, CustomerDataModule, CostSummaryModule } from "./modules";
// import { constantStorage } from "@/core/constants";

// const { CURRENT_ACTIVE_STEP } = constantStorage;

// const NewQuotePage = () => {
//   const { width, DESKTOP } = useWindowSize();
//   const stepperRef = useRef<StepperRefAttributes>(null);
//   const [activeStep, setActiveStep] = useState(0);

//   useEffect(() => {
//     const currentStep = localStorage.getItem(CURRENT_ACTIVE_STEP);
//     if (currentStep) {
//       setActiveStep(+currentStep);
//     }
//   }, [activeStep]);

//   return (
//     <MainLayout>
//       <section className="bg-white pe-7 py-5 md:p-10 rounded-lg my-auto shadow-md">
//         <Stepper

//           linear
//           orientation={width > DESKTOP ? "horizontal" : "vertical"}
//           includePanel
//           activeStep={activeStep}
//           panelContent={[
//             {
//               header: "Datos del Cliente",

//               children: (
//                 <>
//                   <div className="flex flex-col h-[12rem]">
//                     <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
//                       <CustomerDataModule />
//                     </div>
//                   </div>
//                   <div className="flex pt-4 justify-end">
//                     <Button
//                       label="Next"
//                       icon="pi pi-arrow-right"
//                       iconPos="right"
//                       onClick={() => {
//                         stepperRef.current?.nextCallback();
//                         setActiveStep(1);
//                         localStorage.setItem(CURRENT_ACTIVE_STEP, "1");
//                       }}
//                     />
//                   </div>
//                 </>
//               ),

//             },
//             {
//               header: "Itinerario",
//               children: (
//                 <>
//                   <div className="flex flex-col">
//                     <div className="border-2 h-full w-full p-4 border-dashed surface-border border-round surface-ground font-medium">
//                       <CostingModule />
//                     </div>
//                   </div>
//                   <div className="flex pt-4 justify-between">
//                   <Button
//                       label="Back"
//                       severity="secondary"
//                       icon="pi pi-arrow-left"
//                       onClick={() => {
//                         stepperRef.current?.prevCallback();
//                         setActiveStep(0);
//                         localStorage.setItem(CURRENT_ACTIVE_STEP, "0");
//                       }}
//                     />
//                     <Button
//                       label="Next"
//                       icon="pi pi-arrow-right"
//                       iconPos="right"
//                       onClick={() => {
//                         stepperRef.current?.nextCallback();
//                         setActiveStep(2);
//                         localStorage.setItem(CURRENT_ACTIVE_STEP, "2");
//                       }}
//                     />
//                   </div>
//                 </>
//               ),
//               // footer: (
//               //   <div className="flex pt-4 justify-between">
//               //     <Button
//               //       label="Back"
//               //       severity="secondary"
//               //       icon="pi pi-arrow-left"
//               //       onClick={() => stepperRef.current?.prevCallback()}
//               //     />
//               //     <Button
//               //       label="Next"
//               //       icon="pi pi-arrow-right"
//               //       iconPos="right"
//               //       onClick={() => stepperRef.current?.nextCallback()}
//               //     />
//               //   </div>
//               // ),
//             },
//             {
//               header: "Resumen de costos",
//               children: (
//                 <>
//                 <CostSummaryModule />
//                   <div className="flex flex-col h-12rem">
//                     <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
//                       {/* <CostSummaryModule /> */}
//                     </div>
//                   </div>
//                   <div className="flex pt-4 justify-between">
//                     <Button
//                       label="Back"
//                       severity="secondary"
//                       icon="pi pi-arrow-left"
//                       onClick={() => {
//                         stepperRef.current?.prevCallback();
//                         setActiveStep(1);
//                         localStorage.setItem(CURRENT_ACTIVE_STEP, "1");
//                       }}
//                     />
//                     <Button
//                       label="Next"
//                       icon="pi pi-arrow-right"
//                       iconPos="right"
//                       onClick={() => {
//                         stepperRef.current?.nextCallback();
//                         setActiveStep(3);
//                         localStorage.setItem(CURRENT_ACTIVE_STEP, "3");
//                       }}
//                     />
//                   </div>
//                 </>
//               ),
//               // footer: (
//               //   <div className="flex pt-4 justify-between">
//               //     <Button
//               //       label="Back"
//               //       severity="secondary"
//               //       icon="pi pi-arrow-left"
//               //       onClick={() => stepperRef.current?.prevCallback()}
//               //     />
//               //     <Button
//               //       label="Next"
//               //       icon="pi pi-arrow-right"
//               //       iconPos="right"
//               //       onClick={() => stepperRef.current?.nextCallback()}
//               //     />
//               //   </div>
//               // ),
//             },
//             {
//               header: "Header III",
//               children: (
//                 <>
//                 <div className="flex flex-col h-12rem">
//                   <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
//                     Content III
//                   </div>
//                 </div>
//                 <div className="flex pt-4 justify-between">
//                     <Button
//                       label="Back"
//                       severity="secondary"
//                       icon="pi pi-arrow-left"
//                       onClick={() => {
//                         stepperRef.current?.prevCallback();
//                         setActiveStep(2);
//                         localStorage.setItem(CURRENT_ACTIVE_STEP, "2");
//                       }}
//                     />

//                   </div>
//                 </>
//               ),
//               // footer: (
//               //   <div className="flex pt-4 justify-start">
//               //     <Button
//               //       label="Back"
//               //       severity="secondary"
//               //       icon="pi pi-arrow-left"
//               //       onClick={() => stepperRef.current?.prevCallback()}
//               //     />
//               //   </div>
//               // ),
//             },
//           ]}
//         />

//         {/* <Stepper
//           ref={stepperRef}
//           linear
//           orientation={width > DESKTOP ? "horizontal" : "vertical"}
//         >
//           <StepperPanel header="Datos del Cliente">
//             <div className="flex flex-col h-[12rem]">
//               <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
//                 <CustomerData />
//               </div>
//             </div>
//             <div className="flex pt-4 justify-end">
//               <Button
//                 label="Next"
//                 icon="pi pi-arrow-right"
//                 iconPos="right"
//                 onClick={() => stepperRef.current?.nextCallback()}
//               />
//             </div>
//           </StepperPanel>
//           <StepperPanel header="Header II">
//             <div className="flex flex-col h-12rem">
//               <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
//                 Content II
//               </div>
//             </div>
//             <div className="flex pt-4 justify-between">
//               <Button
//                 label="Back"
//                 severity="secondary"
//                 icon="pi pi-arrow-left"
//                 onClick={() => stepperRef.current?.prevCallback()}
//               />
//               <Button
//                 label="Next"
//                 icon="pi pi-arrow-right"
//                 iconPos="right"
//                 onClick={() => stepperRef.current?.nextCallback()}
//               />
//             </div>
//           </StepperPanel>
//           <StepperPanel header="Header III">
//             <div className="flex flex-col h-12rem">
//               <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
//                 Content III
//               </div>
//             </div>
//             <div className="flex pt-4 justify-between">
//               <Button
//                 label="Back"
//                 severity="secondary"
//                 icon="pi pi-arrow-left"
//                 onClick={() => stepperRef.current?.prevCallback()}
//               />
//               <Button
//                 label="Next"
//                 icon="pi pi-arrow-right"
//                 iconPos="right"
//                 onClick={() => stepperRef.current?.nextCallback()}
//               />
//             </div>
//           </StepperPanel>
//           <StepperPanel header="Header III">
//             <div className="flex flex-col h-12rem">
//               <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
//                 Content III
//               </div>
//             </div>
//             <div className="flex pt-4 justify-start">
//               <Button
//                 label="Back"
//                 severity="secondary"
//                 icon="pi pi-arrow-left"
//                 onClick={() => stepperRef.current?.prevCallback()}
//               />
//             </div>
//           </StepperPanel>
//         </Stepper> */}
//       </section>
//     </MainLayout>
//   );
// };

// export default NewQuotePage;

import {
  Button,
  Stepper,
  type StepperChangeEvent,
  toasterAdapter,
} from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { useEffect, useState } from "react";
import {
  CostingModule,
  CostSummaryModule,
  CustomerDataModule,
  GenerateModule,
} from "./modules";

import { constantRoutes, constantStorage } from "@/core/constants";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import {
  useGetAllHotelRoomQuotationsQuery,
  useGetReservationByIdQuery,
  useGetVersionQuotationByIdQuery,
} from "@/infraestructure/store/services";
import {
  onSetCurrentReservation,
  onSetCurrentStep,
  onSetHotelRoomQuotations,
} from "@/infraestructure/store";

const { CURRENT_ACTIVE_STEP } = constantStorage;
const { QUOTES } = constantRoutes.private;

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

const NewQuotePage = () => {
  const dispatch = useDispatch();
  const { width, DESKTOP } = useWindowSize();

  const { currentQuotation, currentStep } = useSelector(
    (state: AppState) => state.quotation
  );
  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );
  const { currentReservation } = useSelector(
    (state: AppState) => state.reservation
  );

  const versionQuotationId = currentQuotation?.currentVersion?.id;
  const reservationId = currentVersionQuotation?.reservation?.id;

  console.log(versionQuotationId)

  const { data: hotelRoomQuotations } = useGetAllHotelRoomQuotationsQuery(
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

  // useEffect(() => {
  //   if (HotelRoomQuotations) {
  //     dispatch(onSetHotelRoomQuotations(HotelRoomQuotations.data));
  //   }
  // }, [HotelRoomQuotations]);

  // useEffect(() => {
  //   if (currentReservation) {
  //   }
  // }, [currentReservation]);

  // console.log(hotelRoomQuotations?.data)

  useEffect(() => {
    setIsLoadingStep(true);
    setTimeout(() => {
      setIsLoadingStep(false);
    }, 500);
  }, [currentStep]);

  return (
    <section className="bg-white pe-7 py-5 md:p-10 rounded-lg my-auto shadow-md">
      <Stepper
        linear
        orientation={width > DESKTOP ? "horizontal" : "vertical"}
        includePanel
        activeStep={currentStep}
        onChangeStep={handleChangeStep}
        panelContent={steps.map((step, index) => ({
          header: step.header,

          children: !isLoadingStep ? (
            <>
              {renderStepContent(index)}
              <div className="flex pt-4 justify-between">
                {index > 0 && (
                  <Button
                    label="Back"
                    severity="secondary"
                    icon="pi pi-arrow-left"
                    onClick={handleBack}
                  />
                )}

                {index < steps.length - 1 && (
                  <Button
                    label="Confirmar y Continuar"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    onClick={handleNext}
                    disabled={currentStep === 0 && !currentReservation}
                  />
                )}
              </div>
            </>
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
