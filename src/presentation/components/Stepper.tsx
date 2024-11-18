import {
  Stepper as StepperPrimeReact,
  type StepperRefAttributes,
  type StepperProps as StepperPropsPrimeReact,
} from "primereact/stepper";
import {
  StepperPanel as StepperPanelPrimeReact,
  type StepperPanelProps as StepperPanelPropsPrimeReact,
} from "primereact/stepperpanel";
import { forwardRef } from "react";

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
          panelContent?.map((panel) => (
            <StepperPanelPrimeReact {...panel} key={panel.header} />
          ))}
      </StepperPrimeReact>
    );
  }
);

export const StepperPanel = ({ children, ...props }: StepperPanelProps) => {
  return <StepperPanelPrimeReact {...props}>{children}</StepperPanelPrimeReact>;
};