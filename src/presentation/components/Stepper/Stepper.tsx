import { forwardRef } from "react";
import {
  Stepper as StepperPrimeReact,
  type StepperProps as StepperPropsPrimeReact,
  type StepperRefAttributes,
  type StepperChangeEvent
} from "primereact/stepper";
import {
  StepperPanel as StepperPanelPrimeReact,
  type StepperPanelProps as StepperPanelPropsPrimeReact,
} from "primereact/stepperpanel";

import './Stepper.css';

interface StepperProps extends StepperPropsPrimeReact {
  panelContent?: StepperPanelProps[];
}

interface StepperPanelProps extends StepperPanelPropsPrimeReact {
  children: React.ReactNode;
}

export const Stepper = forwardRef<StepperRefAttributes, StepperProps>(
  ({ panelContent, ...props }, ref) => {
    return (
      <StepperPrimeReact ref={ref} {...props}>
        {panelContent && panelContent.length > 0 &&
          panelContent.map((panel, index) => (
            <StepperPanelPrimeReact {...panel} key={index} />
          ))}
      </StepperPrimeReact>
    );
  }
);

export {
  type StepperChangeEvent
}

