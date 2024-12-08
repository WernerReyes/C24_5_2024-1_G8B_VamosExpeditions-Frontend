import { Button, Stepper } from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import {  useState } from "react";
import { MainLayout } from "../layouts";
import { CostingModule, CustomerDataModule } from "./modules";
import './Stepper.css';


interface Title {
  header: string;
}

const steps: Title[] = [
  { header: "Datos del Cliente" },
  { header: "Módulo de Costeo" },
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
      return <h1>Resumen de Costos</h1>;
    default:
      return <h1>Finalizar</h1>;
  }
};




const NewQuotePage = () => {
  const { width, DESKTOP } = useWindowSize();
  const [activeStep, setActiveStep] = useState(0);


  const handleNext = () => {
    if (activeStep < steps.length - 1) {

      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleChangeStep = (event: any) => {
    setActiveStep(event.index);
  };




  return (
    <MainLayout>
      <section className="bg-white pe-7 py-5 md:p-10 rounded-lg my-auto shadow-md">
        <Stepper

          linear
          orientation={width > DESKTOP ? "horizontal" : "vertical"}
          includePanel
          activeStep={activeStep} onChangeStep={handleChangeStep}

          panelContent={
          
            steps.map((step,index) => ({
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
            }))
          }
        />


      </section>
    </MainLayout>
  );
};

export default NewQuotePage;
