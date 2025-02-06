import {
  Tooltip as TooltipPrimeReact,
  type TooltipProps,
} from "primereact/tooltip";

interface Props extends TooltipProps {}

export const Tooltip = ({ ...props }: Props) => {
  return <TooltipPrimeReact {...props} />;
};
