import {
  ToggleButton as ToggleButtonPrimeReact,
  ToggleButtonProps,
} from "primereact/togglebutton";

interface Props extends ToggleButtonProps {}

export const ToggleButton = ({ ...props }: Props) => {
  return <ToggleButtonPrimeReact {...props} />;
};
