import {
  ProgressSpinner as ProgressSpinnerPrimeReact,
  type ProgressSpinnerProps,
} from "primereact/progressspinner";

interface Props extends ProgressSpinnerProps {}

export const ProgressSpinner = ({ ...props }: Props) => {
  return <ProgressSpinnerPrimeReact {...props} />;
};
