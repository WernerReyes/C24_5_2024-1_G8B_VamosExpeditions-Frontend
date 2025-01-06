import { forwardRef } from "react";
import {
  Stepper as StepperPrimeReact,
  type StepperProps as StepperPropsPrimeReact,
  type StepperRefAttributes,
} from "primereact/stepper";
import {
  StepperPanel as StepperPanelPrimeReact,
  type StepperPanelProps as StepperPanelPropsPrimeReact,
} from "primereact/stepperpanel";

import './Stepper.css';

interface StepperProps extends StepperPropsPrimeReact {
  includePanel?: boolean;
  panelContent?: StepperPanelProps[];
}

interface StepperPanelProps extends StepperPanelPropsPrimeReact {
  children: React.ReactNode;
}

export const Stepper = forwardRef<StepperRefAttributes, StepperProps>(
  ({ includePanel, panelContent, ...props }, ref) => {
    return (
      <StepperPrimeReact ref={ref} {...props}>
        {includePanel &&
          panelContent?.map((panel, index) => (
            <StepperPanelPrimeReact {...panel} key={index} />
          ))}
      </StepperPrimeReact>
    );
  }
);

// export const StepperPanel = ({ children, ...props }: StepperPanelProps) => {
//   return <StepperPanelPrimeReact {...props}>{children}</StepperPanelPrimeReact>;
// };