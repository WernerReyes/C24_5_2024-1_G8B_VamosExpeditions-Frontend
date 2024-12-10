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

import { Button, Stepper, toasterAdapter } from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { useEffect, useState } from "react";
import { MainLayout } from "../layouts";
import {
  CostingModule,
  CostSummaryModule,
  CustomerDataModule,
} from "./modules";
import "./Stepper.css";
import { constantRoutes, constantStorage } from "@/core/constants";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { useNavigate } from "react-router-dom";

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
      return (
        <>
          {/* Control de margen */}
          <h3 className="text-lg font-bold mb-4">Cálculo de margen</h3>
          <div className="max-w-64 mx-auto mb-4">
            <InputText
              value={"9"}
              // onChange={(e) => setMargin(+e.target.value)}
              className="w-full"
            />
            <Slider
              value={9}
              // onChange={(e) => setMargin(+e.value)}
              className="w-full"
            />
          </div>
          <table className="w-full text-left border-collapse mb-5">
            <thead className="bg-primary text-white">
              <tr className="border-b">
                <th className="py-2"></th>
                <th className="py-2">Total de Costos</th>
                <th className="py-2">Margen</th>
                <th className="py-2">Number de personas</th>
                <th className="py-2">Utilidad</th>
                <th className="py-2">Precio venta</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Hotel 1</td>
                <td className="py-2">$0</td>
                <td className="py-2">9%</td>
                <td className="py-2">2</td>
                <td className="py-2">$0</td>
                <td className="py-2">$0</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Hotel 2</td>
                <td className="py-2">$0</td>
                <td className="py-2">9%</td>
                <td className="py-2">3</td>
                <td className="py-2">$0</td>
                <td className="py-2">$0</td>
              </tr>
              <tr className="border-b">
                <td className="py-2"></td>
                <td className="py-2"></td>
                <td className="py-2"></td>
                <td className="py-2"></td>
                <td className="py-2 bg-primary text-white">
                  <i className="pi pi-money-bill mx-3"></i>
                  Total
                </td>
                <td className="py-2 bg-primary text-white">$0</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between">
            <Button
              icon="pi pi-file-check"
              label="Generar Cotización "
              onClick={() => {
                localStorage.removeItem(CURRENT_ACTIVE_STEP);

                toasterAdapter.success("Cotización generada correctamente");

                setTimeout(() => {
                  location.href = QUOTES;
                }, 2000);
              }}
            />
            <Button icon="pi pi-file-pdf" label="Exportar en PDF " />
          </div>
        </>
      );
    default:
      return <h1>Finalizar</h1>;
  }
};

const NewQuotePage = () => {
  const { width, DESKTOP } = useWindowSize();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
      localStorage.setItem(CURRENT_ACTIVE_STEP, (activeStep + 1).toString());
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
      localStorage.setItem(CURRENT_ACTIVE_STEP, (activeStep - 1).toString());
    }
  };

  const handleChangeStep = (event: any) => {
    setActiveStep(event.index);
  };

  // const handleQuotationSuccess = () => {
  //   setActiveStep(0);
  //   localStorage.removeItem(CURRENT_ACTIVE_STEP);

  //   toasterAdapter.success("Cotización generada correctamente");

  //   setTimeout(() => {
  //     navigate(QUOTES);
  //   }, 2000);
  // };

  useEffect(() => {
    const currentStep = localStorage.getItem(CURRENT_ACTIVE_STEP);
    if (currentStep) {
      setActiveStep(+currentStep);
    }
  }, [activeStep]);

  return (
    <MainLayout>
      <section className="bg-white pe-7 py-5 md:p-10 rounded-lg my-auto shadow-md">
        <Stepper
          linear
          orientation={width > DESKTOP ? "horizontal" : "vertical"}
          includePanel
          activeStep={activeStep}
          onChangeStep={handleChangeStep}
          panelContent={steps.map((step, index) => ({
            header: step.header,
            children: (
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
                      label="Next"
                      icon="pi pi-arrow-right"
                      iconPos="right"
                      onClick={handleNext}
                    />
                  )}
                </div>
              </>
            ),
          }))}
        />
      </section>
    </MainLayout>
  );
};

export default NewQuotePage;
