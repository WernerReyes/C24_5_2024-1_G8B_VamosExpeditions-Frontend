import { Button, Stepper } from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { Button } from "primereact/button";
import { StepperRefAttributes } from "primereact/stepper";
import { useEffect, useRef, useState } from "react";
import { MainLayout } from "../layouts";
import { CostingModule, CustomerDataModule, CostSummaryModule } from "./modules";
import { constantStorage } from "@/core/constants";

const { CURRENT_ACTIVE_STEP } = constantStorage;

const NewQuotePage = () => {
  const { width, DESKTOP } = useWindowSize();
  const stepperRef = useRef<StepperRefAttributes>(null);
  const [activeStep, setActiveStep] = useState(0);

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
          panelContent={[
            {
              header: "Datos del Cliente",

              children: (
                <>
                  <div className="flex flex-col h-[12rem]">
                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
                      <CustomerDataModule />
                    </div>
                  </div>
                  <div className="flex pt-4 justify-end">
                    <Button
                      label="Next"
                      icon="pi pi-arrow-right"
                      iconPos="right"
                      onClick={() => {
                        stepperRef.current?.nextCallback();
                        setActiveStep(1);
                        localStorage.setItem(CURRENT_ACTIVE_STEP, "1");
                      }}
                    />
                  </div>
                </>
              ),
              
            },
            {
              header: "Itinerario",
              children: (
                <>
                  <div className="flex flex-col">
                    <div className="border-2 h-full w-full p-4 border-dashed surface-border border-round surface-ground font-medium">
                      <CostingModule />
                    </div>
                  </div>
                  <div className="flex pt-4 justify-between">
                  <Button
                      label="Back"
                      severity="secondary"
                      icon="pi pi-arrow-left"
                      onClick={() => {
                        stepperRef.current?.prevCallback();
                        setActiveStep(1);
                        localStorage.setItem(CURRENT_ACTIVE_STEP, "0");
                      }}
                    />
                    <Button
                      label="Next"
                      icon="pi pi-arrow-right"
                      iconPos="right"
                      onClick={() => {
                        stepperRef.current?.nextCallback();
                        setActiveStep(2);
                        localStorage.setItem(CURRENT_ACTIVE_STEP, "2");
                      }}
                    />
                  </div>
                </>
              ),
              // footer: (
              //   <div className="flex pt-4 justify-between">
              //     <Button
              //       label="Back"
              //       severity="secondary"
              //       icon="pi pi-arrow-left"
              //       onClick={() => stepperRef.current?.prevCallback()}
              //     />
              //     <Button
              //       label="Next"
              //       icon="pi pi-arrow-right"
              //       iconPos="right"
              //       onClick={() => stepperRef.current?.nextCallback()}
              //     />
              //   </div>
              // ),
            },
            {
              header: "Resumen de costos",
              children: (
                <>
                <CostSummaryModule />
                  <div className="flex flex-col h-12rem">
                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
                      {/* <CostSummaryModule /> */}
                    </div>
                  </div>
                  <div className="flex pt-4 justify-between">
                    <Button
                      label="Back"
                      severity="secondary"
                      icon="pi pi-arrow-left"
                      onClick={() => {
                        stepperRef.current?.prevCallback();
                        setActiveStep(1);
                        localStorage.setItem(CURRENT_ACTIVE_STEP, "1");
                      }}
                    />
                    <Button
                      label="Next"
                      icon="pi pi-arrow-right"
                      iconPos="right"
                      onClick={() => {
                        stepperRef.current?.nextCallback();
                        setActiveStep(3);
                        localStorage.setItem(CURRENT_ACTIVE_STEP, "3");
                      }}
                    />
                  </div>
                </>
              ),
              // footer: (
              //   <div className="flex pt-4 justify-between">
              //     <Button
              //       label="Back"
              //       severity="secondary"
              //       icon="pi pi-arrow-left"
              //       onClick={() => stepperRef.current?.prevCallback()}
              //     />
              //     <Button
              //       label="Next"
              //       icon="pi pi-arrow-right"
              //       iconPos="right"
              //       onClick={() => stepperRef.current?.nextCallback()}
              //     />
              //   </div>
              // ),
            },
            {
              header: "Header III",
              children: (
                <>
                <div className="flex flex-col h-12rem">
                  <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
                    Content III
                  </div>
                </div>
                <div className="flex pt-4 justify-between">
                    <Button
                      label="Back"
                      severity="secondary"
                      icon="pi pi-arrow-left"
                      onClick={() => {
                        stepperRef.current?.prevCallback();
                        setActiveStep(2);
                        localStorage.setItem(CURRENT_ACTIVE_STEP, "2");
                      }}
                    />
                   
                  </div>
                </>
              ),
              // footer: (
              //   <div className="flex pt-4 justify-start">
              //     <Button
              //       label="Back"
              //       severity="secondary"
              //       icon="pi pi-arrow-left"
              //       onClick={() => stepperRef.current?.prevCallback()}
              //     />
              //   </div>
              // ),
            },
          ]}
        />

        {/* <Stepper
          ref={stepperRef}
          linear
          orientation={width > DESKTOP ? "horizontal" : "vertical"}
        >
          <StepperPanel header="Datos del Cliente">
            <div className="flex flex-col h-[12rem]">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
                <CustomerData />
              </div>
            </div>
            <div className="flex pt-4 justify-end">
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current?.nextCallback()}
              />
            </div>
          </StepperPanel>
          <StepperPanel header="Header II">
            <div className="flex flex-col h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
                Content II
              </div>
            </div>
            <div className="flex pt-4 justify-between">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => stepperRef.current?.prevCallback()}
              />
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current?.nextCallback()}
              />
            </div>
          </StepperPanel>
          <StepperPanel header="Header III">
            <div className="flex flex-col h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
                Content III
              </div>
            </div>
            <div className="flex pt-4 justify-between">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => stepperRef.current?.prevCallback()}
              />
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current?.nextCallback()}
              />
            </div>
          </StepperPanel>
          <StepperPanel header="Header III">
            <div className="flex flex-col h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center items-center font-medium">
                Content III
              </div>
            </div>
            <div className="flex pt-4 justify-start">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => stepperRef.current?.prevCallback()}
              />
            </div>
          </StepperPanel>
        </Stepper> */}
      </section>
    </MainLayout>
  );
};

export default NewQuotePage;
